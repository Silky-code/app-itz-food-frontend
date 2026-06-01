import { useMutation, useQueryClient, useQuery} from '@tanstack/react-query';
import { useAuth0} from '@auth0/auth0-react';
import { toast} from 'sonner';
import type {Restaurante, RestauranteSearchResponse} from '@/api/types';
import type {SearchState} from '@/pages/SearchPage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//hook para obtener los datos de un restaurante del backend
export function useGetRestaurante(){
    const { getAccessTokenSilently } = useAuth0();
    
    //funcion para obtener los datos de un restaurante
    const getRestauranteRequest = async ():Promise<Restaurante> =>{
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + '/api/restaurante', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok){
            throw new Error("Error al obtener el restaurante")
        }
        return res.json()
    }// fin de getRestauranteRequest

    return useQuery({
        queryKey: ['restaurante'],
        queryFn: getRestauranteRequest,
    });
}// fin de useGetRestaurante

export function useCreateRestaurante(){
    const queryClient = useQueryClient();
    const {getAccessTokenSilently} = useAuth0();

    //funcion para crear un restaurante en el backend
    const createRestauranteRequest = async (restaurantFormData: FormData): Promise<Restaurante> =>{
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + '/api/restaurante', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
            body: restaurantFormData
        });
        if (!res.ok){
            throw new Error("Error al crear el restaurante")
        }
        return res.json()
    }// fin de createREstauranteRequest
    
    return useMutation({
        mutationFn: (restaurante: FormData)=>createRestauranteRequest(restaurante),
        onError: (err)=>{
            toast.error("error al crear el restaurante");
            console.log(err);
            throw new Error("Error al crear el restaurante")
        },
        onSuccess: (restaurante) => {
            toast.success("Restaurante creado exitosamente");
            console.log(restaurante);
            queryClient.invalidateQueries({queryKey: ['restaurante']});
        }
    })
}// fin de useCreateRestaurante

//hook para actualizar un restarante
export function useUpdateRestaurante(){
    const queryClient = useQueryClient();
    const {getAccessTokenSilently} = useAuth0();

    //funcion para actualizar un restaurante en el backend
    const updateRestauranteRequest = async (restaurantFormData: FormData): Promise<Restaurante> =>{
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + '/api/restaurante', {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
            body: restaurantFormData
        });
        if (!res.ok){
            throw new Error("Error al actualizar el restaurante")
        }
        return res.json()
    }// fin de updateRestauranteRequest

    return useMutation({
        mutationFn: (formData: FormData)=>updateRestauranteRequest(formData),
        onError: (err)=>{
            toast.error(err.toString());
            console.log(err);
            throw new Error("Error al actualizar el restaurante")
        },
        onSuccess: ()=>{
            toast.success("Restaurante actualizado exitosamente")
            queryClient.invalidateQueries({queryKey: ['restaurante']});
        }
    })
}// funcion useupdaterestaurantes

export const useSearchRestarantes = (searchState: SearchState, city?: string) =>{
    const getSearchRestauranteRequest = async (searchState: SearchState):Promise<RestauranteSearchResponse>=>{
        const params = new URLSearchParams();
        params.set("searchQuery", searchState.searchQuery);
        params.set("page", searchState.page.toString());
        params.set("selectedCuisines", searchState.selectedCuisines.join(","));
        params.set("sortOptions", searchState.sortOptions);
        
        const url = API_BASE_URL
                    + '/api/restaurante/search/'
                    + city
                    + '?'
                    + params.toString();
        console.log(url);

        const res = await fetch(url);

        if(!res.ok){
            throw new Error("Error al buscar un restaurante");
        }

        return res.json();
    }// fin de getSearchRestauranteRequest

    return useQuery({
        queryKey: ['restaurante', searchState],
        queryFn: ()=>getSearchRestauranteRequest(searchState),
        enabled: !!city,
    });// fin de useQuery
}//fin de useSearchRestaurantes