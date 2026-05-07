"use client"
import { useEffect } from "react"; 
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BackEndUser } from "@/api/types";


const formSchema = z.object({
    email: z.string().optional(),
    name: z.string({error: "El nombre debe ser requerido"}).min(3,{error:"El nombre debe tener al menos 3 caracteres"}),
    address: z.string({error: "La direccion debe ser requerida"}),
    city: z.string({error: "La ciudad debe ser requerida"}),
    country: z.string({error: "El pais debe ser requerido"})
});

export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    onSave: (userProfileData: UserFormData) => void;
    getUser: BackEndUser
}

export default function UserProfileForm({ onSave, getUser }: Props) {
    const form = useForm<UserFormData>({
        defaultValues: {
            name: '',
            email: '',
            address: '',
            city: '',
            country: ''
        },
        resolver: zodResolver(formSchema)
    });
    useEffect(() => {
        form.reset(getUser);
    }, [getUser, form]);

    function onSubmit(data: UserFormData) {
        onSave(data);
    }

    return (
        <Card>
            <form id="user-profile-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 rounded-lg md:p-10">
                <CardHeader>
                    <CardTitle>Perfil del Usuario</CardTitle>
                    <CardDescription>Consulta y cambia la informacion de tu perfil aqui</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FieldGroup>
                        <Controller name="email" control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input 
                                        {...field} 
                                        disabled // El email se envía pero no se edita
                                        className="bg-white opacity-70 cursor-not-allowed" 
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Controller name="name" control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Nombre</FieldLabel>
                                    <Input {...field} className="bg-white" />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <div className="flex flex-col md:flex-row gap-4">
                        <Controller name="address" control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="flex-1">
                                    <FieldLabel>Direccion</FieldLabel>
                                    <Input {...field} className="bg-white" />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller name="city" control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="flex-1">
                                    <FieldLabel>Ciudad</FieldLabel>
                                    <Input {...field} className="bg-white" />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller name="country" control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="flex-1">
                                    <FieldLabel>Pais</FieldLabel>
                                    <Input {...field} className="bg-white" />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <CardFooter className="px-0 pt-6">
                        <Button type="submit" className="bg-orange-500 text-white w-full md:w-auto">
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </CardContent>
            </form>
        </Card>
    );
}


