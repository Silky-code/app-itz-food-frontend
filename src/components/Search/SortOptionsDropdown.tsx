import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type Props={
    onChange: (value:string)=>void;
    sortOptions: String;
}

const SORT_OPTIONS = [
    {
        label: "Mejor coincidencia",
        value: "bestMatch"
    },
    {
        label:"Precio de entrega",
        value:"deliveryPrice"
    },
    {
        label:"Tiempo estimado de entrega",
        value: "estimateDeliveryTime"
    }
]

export default function sortOptionsDropdown({onChange, sortOptions}: Props){

    const selectedSortLabel =
            SORT_OPTIONS.find((option)=> option.value===sortOptions) ?.label || SORT_OPTIONS[0].label;
        
    return(
        <div className="text-xl font-bold flex flex-col gap-3 justify-between lg:items-center lg:flex-row">
            <DropdownMenu>
            <DropdownMenuTrigger className={'cursor-pointer'}>
                <Button variant='outline'
                        className="w-full"
                >
                    OrdenarPor: {selectedSortLabel}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {SORT_OPTIONS.map((option)=>(
                    <DropdownMenuItem
                        key={option.value}
                        className='cursor-pointer'
                        onClick={()=>onChange(option.value)}
                    >
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
        
        </div>
        
    )
}