import { useParams } from "react-router";
import { useGetRestauranteById } from "@/api/RestauranteApi";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import LoadingButton from "@/components/LoadingButton";
import RestaurantInfo from "@/components/Search/RestaurantInfo";
import MenuItemCard from "@/components/Search/MenuItemCard";
import { useState } from "react";
import type { CartItem } from "@/api/types";
import OrderSummary from '@/components/Search/OrderSumary';
import { Card, CardFooter } from "@/components/ui/card";
import CheckOutButton from "@/components/Search/CheckOutButton";
import type { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useCreateCheckOutSession } from "@/api/orderApi";

export default function DetailPage() {
    const { restaurantId } = useParams();
    const createCheckOutSessionRequest = useCreateCheckOutSession();
    const { data: restaurante, isLoading } = useGetRestauranteById(restaurantId);
    const [cartItems, setCartItems] = useState<CartItem[]>(()=>{
        const storedCartItems = sessionStorage.getItem('cartItems-'+restaurantId);
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });

    const addToCart = (menuItem: { _id: string; name: string; price: number }) => {
        setCartItems((prevItems: CartItem[]) => {
            // 1. Verificar si el Item ya se encuentra en el carrito
            const existingCartItem = prevItems.find(
                (cartItem) => cartItem._id === menuItem._id
            );

            let updatedCartItems;

            // 2. Si se encuentra, se actualiza la cantidad
            if (existingCartItem) {
                updatedCartItems = prevItems.map((cartItem) =>
                    cartItem._id === menuItem._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                // 3. Si no se encuentra, se agrega al carrito
                updatedCartItems = [
                    ...prevItems,
                    {
                        _id: menuItem._id,
                        name: menuItem.name,
                        price: menuItem.price,
                        quantity: 1,
                    },
                ];
            }

            return updatedCartItems;
        });
    }; //fin de addToCart
    const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
        const updateCartItems = prevCartItems.filter(
            (item) => cartItem._id !== item._id
        );

        sessionStorage.setItem(
            'cartItems-' + restaurantId, JSON.stringify(updateCartItems)
        );

        return updateCartItems;
    });
    }; //Fin de removeFromCart
    const onCheckOut = async (userFormData: UserFormData) => {
        if (!restaurante) {
            return;
        }

        const checkOutData = {
            cartItems: cartItems.map((item) => ({
                menuItemId: item._id,
                name: item.name,
                quantity: item.quantity.toString(),
            })),
            deliveryDetails: {
                name: userFormData.name,
                address: userFormData.address,
                city: userFormData.city,
                country: userFormData.country,
                email: userFormData.email as string
            },
            restaurantId: restaurante._id
        }; //Fin de checkOutData

        //Creamos la sesión de checkout en stripe
        createCheckOutSessionRequest.mutate(checkOutData, {
            onSuccess: (data) => {
                window.location.href = data.url;
            }
        });
    }; //Fin de onCheckOut

    if (isLoading || !restaurante) {
        return <LoadingButton />;
    }

    return (
        <div className="flex flex-col gap-10">
            <AspectRatio ratio={16 / 5}>
                <img
                    src={restaurante.imageUrl}
                    className="rounded-md object-cover h-full w-full"
                />
            </AspectRatio>
            <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
                <div className="flex flex-col gap-4">
                    <RestaurantInfo restaurant={restaurante} />
                    <span className="text-2xl font-bold tracking-tight">Menu</span>
                    {restaurante.menuItems.map((menuItem, key) => (
                        <MenuItemCard
                            menuItem={menuItem}
                            key={key}
                            addToCart={() => addToCart(menuItem)}
                        />
                    ))}
                </div>
                <div>
                    <OrderSummary restaurant={restaurante} cartItems={cartItems} removeFromCart={removeFromCart} />
                    <CardFooter>
                        <CheckOutButton
                            disabled={cartItems.length === 0}
                            onCheckOut={onCheckOut}
                        />
                    </CardFooter>
                </div>
            </div>
        </div>
    );
}