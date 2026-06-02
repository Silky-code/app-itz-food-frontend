import { useCreateRestaurante, useGetRestaurante, useUpdateRestaurante } from "@/api/RestauranteApi";
import ManageRestaurantForm from "@/forms/user-profile-form/manage-restaurant-form/ManageRestaurantForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetRestaurantOrders } from "@/api/orderApi";
import OrderItemsCard from "@/components/Orders/OrderItemsCard";

export default function ManageRestaurantPage() {
    const createRestaurantRequest = useCreateRestaurante();
    const { data: restaurante, isLoading } = useGetRestaurante();
    const updateRestauranteRequest = useUpdateRestaurante();
    const { data: orders } = useGetRestaurantOrders();

    const isEditing = !!restaurante;

    return (
        <Tabs defaultValue="orders">
            <TabsList>
                <TabsTrigger value="orders" className="text-sm font-semibold">
                    Órdenes
                </TabsTrigger>
                <TabsTrigger value="manage-restaurant" className="text-sm font-semibold">
                    Administrar Restaurante
                </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-5 bg-gray-50 p-10 rounded-lg">
                <h2 className="text-2xl font-semibold">
                    {orders?.length ?? 0} órdenes activas
                </h2>
                {orders?.map((order) => (
                    <OrderItemsCard key={order._id} order={order} />
                ))}
            </TabsContent>

            <TabsContent value="manage-restaurant">
                <ManageRestaurantForm
                    restaurante={restaurante}
                    onSave={isEditing ? updateRestauranteRequest.mutate : createRestaurantRequest.mutate}
                    
                    isLoading={isLoading || createRestaurantRequest.isPending || updateRestauranteRequest.isPending}
                />
            </TabsContent>
        </Tabs>
    );
}