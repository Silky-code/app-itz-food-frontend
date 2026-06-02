import type { Order, OrderStatus } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUS } from "@/config/order-status-config";
import { useUpdateRestauranteOrder } from "@/api/orderApi";
import { useEffect, useState } from "react";

type Props = {
  order: Order;
};

export default function OrderItemsCard({ order }: Props) {
  const updateRestauranteOrderRequest = useUpdateRestauranteOrder();
  const [status, setStatus] = useState<OrderStatus>(order.status);

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    await updateRestauranteOrderRequest.mutateAsync({
      orderId: order._id,
      status: newStatus
    });
    setStatus(newStatus);
  };

  const getTime = () => {
    const orderDateTime = new Date(order.createdAt);
    const hours = orderDateTime.getHours();
    const minutes = orderDateTime.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes}`;
  };

  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle className="grid md:grid-cols-4 gap-4 justify-between items-center mt-3">
          <div>
            Cliente: <span className="font-normal">{order.deliveryDetails.name}</span>
          </div>
          <div>
            Dirección:{" "}
            <span className="font-normal">
              {order.deliveryDetails.address}, {order.deliveryDetails.city}
            </span>
          </div>
          <div>
            Hora del pedido: <span className="font-normal">{getTime()}</span>
          </div>
          <div>
            Total: <span className="font-normal">${(order.totalAmount / 100).toFixed(2)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-6 pt-6">
        <div className="flex flex-col gap-2">
          {order.cartItems.map((item) => (
            <span key={item.menuItemId} className="flex items-center gap-1">
              <Badge variant="outline">{item.quantity}</Badge>
              {item.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="status">¿Cuál es el estado de la orden?</Label>
          <Select value={status} onValueChange={(value) => handleStatusChange(value as OrderStatus)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUS.map((statusItem) => (
                <SelectItem key={statusItem.value} value={statusItem.value}>
                  {statusItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}