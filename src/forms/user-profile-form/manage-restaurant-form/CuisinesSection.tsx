import { CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { useFormContext, Controller } from 'react-hook-form';
import { type RestaurantFormData } from "./RestaurantFromSchema";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import CuisineCheckbox from "./CuisineCheckbox";
import { cuisineList } from '@/config/restaurant-options-config';

export default function CuisinesSection() {
    const { control } = useFormContext<RestaurantFormData>();
    return (
        <div className="space-y-2">
            <CardContent>
                <CardTitle className="text-2xl font-bold">
                    Cocinas
                </CardTitle>
                <CardDescription>
                    Selecciona el tipo de cocina que el restaurante servirá
                </CardDescription>
                <FieldGroup>
                    <Controller 
                        control={control}
                        name="cuisines"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-4 bg-white rounded-lg border">
                                    {cuisineList.map((cuisineItem) => (
                                        <CuisineCheckbox
                                            cuisine={cuisineItem}
                                            field={field}
                                            key={cuisineItem}
                                        />
                                    ))}
                                </div>
                                {fieldState.invalid && (
                                    <FieldError className="mt-2">
                                        {fieldState.error?.message}
                                    </FieldError>
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </CardContent>
        </div>
    );
}