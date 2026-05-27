import { useFormContext, Controller } from 'react-hook-form';
import { type RestaurantFormData } from './RestaurantFromSchema';
import { Field, FieldError, FieldGroup, FieldLabel} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


type Props = {
    index: number;
    removeMenuItem: ()=> void;
}
export default function MenuItemInput({index, removeMenuItem}:Props){
    const { control } = useFormContext<RestaurantFormData>();
    return (
        <div className='flex flex-row items-end gap-2'>
            <FieldGroup>
                <Controller 
                    control={control}
                    name={`menuItems.${index}.name`}
                    render={({field,fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className='flex items-center gap-1'>
                                Nombre
                            </FieldLabel>
                            <FieldGroup>
                                <Input 
                                    {...field} 
                                    className='bg-white' 
                                    placeholder='Hamurguesa'
                                />
                            </FieldGroup>

                            { fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <FieldGroup>
                <Controller 
                    control={control}
                    name={`menuItems.${index}.price`}
                    render={({field,fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className='flex items-center gap-1'>
                                Precio ($)
                            </FieldLabel>
                            <FieldGroup>
                                <Input 
                                    {...field} 
                                    className='bg-white' 
                                    placeholder='99.99'
                                />
                            </FieldGroup>

                            { fieldState.invalid && (
                                <FieldError
                                    errors={[fieldState.error]}
                                    />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            <Button
                type='button'
                onClick={removeMenuItem}
                className="bg-red-500 max-h-fit"
            >
                Eliminar
            </Button>
        </div>
    )
}