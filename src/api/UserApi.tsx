const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { User, UpdateUser,BackEndUser } from "../api/types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react"; 
import { toast } from "sonner";

type CreateUserRequest = {
    email: string;
    auth0Id: string;
}


export function useCreateUser () {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();

    const createUserRequest = async (formData: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + "/api/user", {
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        if (!res.ok) { 
            throw new Error("Error al crear el usuario");
        }
        return res.json();
    };

    return useMutation({
        mutationFn: (user: CreateUserRequest) => createUserRequest(user), 
        onError: (err) => {
            console.error(err);
            toast.error(err.toString())
            throw new Error("Error al crear el usuario")
        },
        onSuccess: (user) => {
            console.log(user)
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const { getAccessTokenSilently } = useAuth0();

    const updateUserRequest = async (formData: UpdateUser) => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + "/api/user", {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });

        if (!res.ok) {
            throw new Error("Error al actualizar el usuario");
        }
        return res.json();
    };

    return useMutation({
        mutationFn: (formData: UpdateUser) => updateUserRequest(formData),
        onError: (err) => {
            console.error(err);
            throw new Error("Error al actualizar el usuario");
        },
        onSuccess: (user) => {
            console.log(user)
            queryClient.invalidateQueries({ queryKey: ["user"] });
        }
    });//fin del return
};


export function useGetUser(){
    const { getAccessTokenSilently } = useAuth0();
    const getUserRequest = async (): Promise<BackEndUser> => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + "/api/user", {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) { 
            throw new Error("Error al obtener el usuario");
        }
        return res.json();
    }//fin de obtener usuario
    return useQuery({
        queryKey: ["user"],
        queryFn: getUserRequest,
    });
}//fin de use get user