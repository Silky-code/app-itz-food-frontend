import { useCreateRestaurante, useGetRestaurante, useUpdateRestaurante } from "@/api/RestauranteApi";
import ManageRestaurantForm from "@/forms/user-profile-form/manage-restaurant-form/ManageRestaurantForm";

export default function ManageRestaurantPage() {
    const createRestaurantRequest = useCreateRestaurante();
    const { data: restaurante, isLoading } = useGetRestaurante();
    const updateRestauranteRequest = useUpdateRestaurante();

    const isEditing = !!restaurante;
    return (
        <ManageRestaurantForm
            restaurante={restaurante}
            onSave={isEditing ? updateRestauranteRequest.mutate : createRestaurantRequest.mutate}
            isLoading={isLoading}
        />
    );
}