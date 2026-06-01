import type { Order } from "@/api/types";
import { Separator } from "@/components/ui/separator";

type Props = {
  order: Order;
};

export default function OrderStatusDetail({ order }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="font-bold">Entregar a:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>
          {order.deliveryDetails.address}, {order.deliveryDetails.city}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">Tu pedido:</span>
        <ul className="space-y-1">
          {order.cartItems.map((item) => (
            <li key={item.menuItemId}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="font-bold">Total Pagado:</span>
        <span>${(order.totalAmount / 100).toFixed(2)} MXN</span>
      </div>
    </div>
  );
}