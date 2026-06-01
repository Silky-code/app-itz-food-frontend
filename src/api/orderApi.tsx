import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'sonner';
import type { CheckOutSessionRequest, CheckOutSessionResponse, Order, UpdateOrderStatusRequest } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//Hook para crear un sesión de checkout en stripe
export function useCreateCheckOutSession(){
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();

    //Función para realizar la petición de una sesión de stripe en el backend
    const createCheckOutSessionRequest = async (checkOutSessionRequest: CheckOutSessionRequest):Promise<any> =>{
        const accessToken = await getAccessTokenSilently();

        const res = await fetch(API_BASE_URL + '/api/order/checkout/create-checkout-session', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkOutSessionRequest)
        });

        if (!res.ok){
            throw new Error("Error al crear la sesión de checkout de stripe");
        }

        return res.json();
    }; //Fin de createCheckOutSessionRequest
    return useMutation<CheckOutSessionResponse, Error, CheckOutSessionRequest>({
    mutationFn: (checkOutSessionRequest: CheckOutSessionRequest)=>createCheckOutSessionRequest(checkOutSessionRequest),
    onError: (err)=>{
        toast.error('Error al crear la sesión de chekout en stripe');
        console.log(err);
        throw new Error('Error al crear la sesión de checkout en stripe')
    },
    onSuccess: (order)=>{
        toast.success('Sesión de checkout en stripe creada correctamente');
        console.log(order);
        queryClient.invalidateQueries({queryKey: ['order']})
    }
});//Fin de return

}; //Fin de useCreateCheckOutSession
// Hook para obtener órdenes del cliente
export function useGetOrders() {
  const { getAccessTokenSilently } = useAuth0();

  const getOrderRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(API_BASE_URL + '/api/order', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Error al obtener las órdenes');
    return res.json();
  };

  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrderRequest,
    refetchInterval: 5000,
  });
}

// 1. Hook para obtener las órdenes del restaurante (con recarga automática cada 5 segundos)
export function useGetRestaurantOrders() {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(`${API_BASE_URL}/api/order/order`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error("Error al obtener las órdenes del restaurante");
    }
    return res.json();
  };

  return useQuery<Order[], Error>({
    queryKey: ['fetchRestaurantOrders'],
    queryFn: getRestaurantOrdersRequest,
    refetchInterval: 5000, // Hace polling cada 5 segundos
  });
}

// 2. Hook para actualizar el estado de una orden (utiliza el método PATCH)
export function useUpdateRestauranteOrder() {
  const { getAccessTokenSilently } = useAuth0();

  const updateRestaurantOrderRequest = async (updateStatusOrderRequest: UpdateOrderStatusRequest) => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(`${API_BASE_URL}/api/order/${updateStatusOrderRequest.orderId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: updateStatusOrderRequest.status })
    });

    if (!res.ok) {
      throw new Error("Error al actualizar el estado de la orden");
    }
    return res.json();
  };

  const { mutateAsync: updateStatusOrder, isPending, isSuccess, isError, reset } = useMutation({
    mutationFn: updateRestaurantOrderRequest
  });

  return {
    updateStatusOrder,
    isLoading: isPending,
    isSuccess,
    isError,
    reset
  };
}