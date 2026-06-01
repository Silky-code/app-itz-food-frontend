import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'sonner';
import type { CheckOutSessionRequest, CheckOutSessionResponse } from "./types";

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