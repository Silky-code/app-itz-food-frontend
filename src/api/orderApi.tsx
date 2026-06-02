import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'sonner';
import type { CheckOutSessionRequest, CheckOutSessionResponse, Order, UpdateOrderStatusRequest } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Hook para crear una sesión de checkout en Stripe
export function useCreateCheckOutSession() {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();

    const createCheckOutSessionRequest = async (checkOutSessionRequest: CheckOutSessionRequest): Promise<CheckOutSessionResponse> => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + '/api/order/checkout/create-checkout-session', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkOutSessionRequest)
        });
        if (!res.ok) throw new Error("Error al crear la sesión de checkout de stripe");
        return res.json();
    };

    return useMutation<CheckOutSessionResponse, Error, CheckOutSessionRequest>({
        mutationFn: (checkOutSessionRequest) => createCheckOutSessionRequest(checkOutSessionRequest),
        onError: (err) => {
            toast.error('Error al crear la sesión de checkout en stripe');
            console.log(err);
        },
        onSuccess: (order) => {
            toast.success('Sesión de checkout en stripe creada correctamente');
            console.log(order);
            queryClient.invalidateQueries({ queryKey: ['order'] });
        }
    });
}


export function useGetOrders() {
    const { getAccessTokenSilently } = useAuth0();

    const getOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/order`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Error al obtener las órdenes");
        return res.json();
    };

    return useQuery({
        queryKey: ["fetchMyOrders"],
        queryFn: getOrdersRequest,
        refetchInterval: 5000,
    });
}


export function useGetRestaurantOrders() {
    const { getAccessTokenSilently } = useAuth0();

    const getRestaurantOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(`${API_BASE_URL}/api/order/restaurant-orders`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Error al obtener las órdenes del restaurante");
        return res.json();
    };

    return useQuery({
        queryKey: ["fetchRestaurantOrders"],
        queryFn: getRestaurantOrdersRequest,
        refetchInterval: 5000,
    });
}

// Hook para actualizar el estado de una orden
export function useUpdateRestauranteOrder() {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();

    const updateRestaurantOrderRequest = async (updateStatusOrderRequest: UpdateOrderStatusRequest) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(
            `${API_BASE_URL}/api/order/${updateStatusOrderRequest.orderId}/status`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: updateStatusOrderRequest.status })
            }
        );
        if (!res.ok) throw new Error("Error al actualizar el estado de la orden");
        return res.json();
    };

    return useMutation<Order, Error, UpdateOrderStatusRequest>({
        mutationFn: updateRestaurantOrderRequest,
        onSuccess: () => {
            toast.success("Estado de la orden actualizado");
            queryClient.invalidateQueries({ queryKey: ['fetchRestaurantOrders'] });
        },
        onError: (err) => {
            console.log(err);
            toast.error("Error al actualizar el estado de la orden");
        }
    });
}