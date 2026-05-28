import { Card } from "@/components/ui/card";
import {formSchema, type RestaurantFormData} from "./RestaurantFromSchema";
import { useForm, FormProvider} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DetailsSection from "./DetailsSection"; 
import LoadingButton from "@/components/LoadingButton";
import {Button} from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import type { Restaurante } from "@/api/types";
import { useEffect } from "react";

type Props = {
    restaurante?: Restaurante
    onSave: (restaurantFormData: FormData)=>void;
    isLoading: boolean;
}


export default function ManageRestaurantForm({onSave,isLoading, restaurante}: Props) {
    const form = useForm<RestaurantFormData>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            restauranteName: "",
            city: "Zacatecas",
            country: "Mexico",
            deliveryPrice: "100",
            estimatedDeliveryTime: "30",
            cuisines: [],
            menuItems: [{name: "", price:"0.00"}],
        }
    });
 
    useEffect( () => {
        if (!restaurante)
            return;
        //cargamos los datos del restaurante extraidos del backend
        //en el formulario
     form.reset({
        ...restaurante,
        menuItems: restaurante.menuItems.map(item => ({
            ...item,
            price: item.price.toString()
        }))
    });

    }, [form, restaurante]);//fin del useEffect

    //funcion para procesar los datos del usuario   
    const onSubmit=(formDataJson: RestaurantFormData)=>{
        //console.log(formData);
        const formData = new FormData();

        formData.append("restauranteName",formDataJson.restauranteName);
        formData.append("city",formDataJson.city);
        formData.append("country",formDataJson.country);
        formData.append("deliveryPrice",formDataJson.deliveryPrice.toString());
        formData.append("estimatedDeliveryTime",formDataJson.estimatedDeliveryTime.toString());

        //procesamos el arreglo de cocinas 
        formDataJson.cuisines.forEach(
            (cuisine, index) =>{
                formData.append(`cuisines[${index}]`, cuisine)
            }
        )

        //procesamos el arreglo de los items del menú
        formDataJson.menuItems.forEach(
            (menuItem, index)=>{
                formData.append(`menuItems[${index}][name]`, menuItem.name)
                formData.append(`menuItems[${index}][price]`, menuItem.price.toString())
            }
        );

        //procesamos la imagen del restaurante
        if (formDataJson.imageFile) {
            formData.append("imageFile", formDataJson.imageFile||"");
        }

        //enviamos los datos al backend
        onSave(formData);
    };// fin del submit

    return(
        <Card>
            <FormProvider {...form}>
                <form id="manage-restaurant-form" onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8 bg-gray-50 p-10 rounded-lg'>
                    <DetailsSection />
                    <Separator/>
                    <CuisinesSection />
                    <Separator/>
                    <MenuSection />
                    <Separator/>
                    <ImageSection />
                    {
                        isLoading ? <LoadingButton />
                        : <Button className="bg-black text-white" type="submit">Guardar</Button>
                    }
                </form>
            </FormProvider>
        </Card>
    )
}
