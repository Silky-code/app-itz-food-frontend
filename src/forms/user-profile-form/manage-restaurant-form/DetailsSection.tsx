import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext, Controller } from "react-hook-form";
import { type RestaurantFormData } from "./RestaurantFromSchema";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function DetailsSection(){
    const { control } = useFormContext<RestaurantFormData>();
    return(
        <div className="space-y-2">
            <CardHeader>
                <CardTitle className='text-2xl font-bold'>
                    Detalles
                </CardTitle>
                <CardDescription>
                    Detalles del restaurante
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <Controller 
                        control={control}
                        name="restauranteName"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Nombre del Restaurante</FieldLabel>
                            <Input
                                {...field}
                                id="restauranteName"
                                placeholder="Ej: Restaurante ITZ"
                                aria-invalid={fieldState.invalid}
                                className="bg-white"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />
                </FieldGroup>
                <div className="flex gap-4">
                    <FieldGroup className="flex-1">
                        <Controller
                            control={control}
                            name="city"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Ciudad</FieldLabel>
                                    <Input
                                        {...field}
                                        id="city"
                                        placeholder="Ej: Zacatecas"
                                        aria-invalid={fieldState.invalid}
                                        className="bg-white"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <FieldGroup className="flex-1">
                        <Controller
                            control={control}
                            name="country"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>País</FieldLabel>
                                    <Input
                                        {...field}
                                        id="country"
                                        placeholder="Ej: México"
                                        aria-invalid={fieldState.invalid}
                                        className="bg-white"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FieldGroup>
                        <Controller
                            control={control}
                            name="deliveryPrice"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className='max-w-[20%] md:max-w-[50%]'>
                                    <FieldLabel>Precio de Entrega ($pesos)</FieldLabel>
                                    <Input
                                        {...field}
                                        id="deliveryPrice"
                                        placeholder="Ej: 100.00"
                                        aria-invalid={fieldState.invalid}
                                        className="bg-white"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </div>
                <div>
                    <FieldGroup>
                        <Controller
                            control={control}
                            name="estimatedDeliveryTime"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className='max-w-[20%] md:max-w-[50%]'>
                                    <FieldLabel>Tiempo Estimado de Entrega (minutos)</FieldLabel>
                                    <Input
                                        {...field}
                                        id="estimatedDeliveryTime"
                                        placeholder="Ej: 30"
                                        aria-invalid={fieldState.invalid}
                                        className="bg-white"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </div>

            </CardContent>

        </div>
    )
}