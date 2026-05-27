import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel} from "@/components/ui/field";
import { type ControllerRenderProps } from "react-hook-form";
import { type RestaurantFormData } from "./RestaurantFromSchema";

type Props = {
    cuisine: string, 
    field: ControllerRenderProps<RestaurantFormData, "cuisines">;
}
export default function CuisineCheckbox({cuisine, field}:Props){
    return (
        <div className="flex flex-row items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
            <Checkbox 
                id={`cuisine-${cuisine}`}
                className='bg-white h-4 w-4 flex'
                checked={field.value.includes(cuisine)}
                onCheckedChange={ (checked) =>{
                    if(checked)
                        field.onChange([...field.value, cuisine]);
                    else
                        field.onChange(field.value.filter((value:string)=> value !== cuisine));
                }}    
                />    
                <FieldLabel
                    htmlFor={`cuisine-${cuisine}`}
                    className="text-sm font-normal flex">
                    {cuisine}
                </FieldLabel>   
        </div>
    )
}