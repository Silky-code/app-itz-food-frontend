import { useGetOrders } from "@/api/orderApi";
import OrderStatusDetail from "@/components/Orders/OrderStatusDetail";
import OrderStatusHeader from "@/components/Orders/OrderStatusHeader";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function OrderStatusPage() {
  const { data: orders, isLoading } = useGetOrders();

  if (isLoading) {
    return <span className="flex justify-center items-center h-screen">Cargando...</span>;
  }

  if (!orders || orders.length === 0) {
    return <span className="text-center block mt-10">No tienes órdenes registradas.</span>;
  }

  return (
    <div className="space-y-10">
      {orders.map((order) => (
        <div key={order._id} className="space-y-10 bg-gray-50 p-5 rounded-lg">
          <OrderStatusHeader order={order} />
          <div className="grid gap-10 md:grid-cols-2">
            <OrderStatusDetail order={order} />
            <AspectRatio ratio={16 / 5}>
              <img
                src={order.restaurant.imageUrl}
                alt={order.restaurant.restauranteName}
                className="rounded-md object-cover h-full w-full"
              />
            </AspectRatio>
          </div>
        </div>
      ))}
    </div>
  );
}