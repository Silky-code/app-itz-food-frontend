import { z } from "zod";

export const formSchema = z.object({
    restauranteName: z.string('El nombre del restaurante es requerido'),
    city: z.string('El nombre de la ciudad es requerido'),
    country: z.string('El nombre del pais es requerido'),
    deliveryPrice: z.string('Precio de entrega es requerido')
        .min(1,'El precio de entrega es requerido')
        .refine((val)=>!isNaN(Number(val)),{error:'El precio de entrega debe ser un numero valido'}),
    estimatedDeliveryTime: z.string('El tiempo estimado de entrega es requerido')
        .min(1,'El tiempo estimado de entrega es requerido')
        .refine((val)=>!isNaN(Number(val)),{error:'El tiempo estimado de entrega debe ser un numero valido'}),
    cuisines: z.array(z.string()).min(1,'Por favor selecciona un item de cocina'),
    menuItems: z.array(
        z.object({
            name: z.string().min(1,'El nombre del platillo es requerido').min(1,'El nombre del platillo debe tener al menos 1 caracter'),
            price: z.string('El precio del platillo es requerido').min(1,'El precio del platillo es requerido')
                .refine( (val) =>!isNaN(Number(val)),{error:'El precio del platillo debe ser un numero valido'}),
    })
    ).min(1,'El menu debe contener al menos un item'),

    imageFile: z.instanceof(File,{message:'Imagen requerida'}).optional(),
    imageUrl: z.string().optional()

}).refine((data)=>data.imageUrl || data.imageFile,{
        message: 'Se debe proporcionar un archivo de imagen o una URL de la imagen',
        path: ['imageFile']
});

export type RestaurantFormData = z.infer<typeof formSchema>