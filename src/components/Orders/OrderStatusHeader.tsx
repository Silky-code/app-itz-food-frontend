"use client";

import type { Order } from "@/api/types";
import { Progress } from "@/components/ui/progress";
import { ORDER_STATUS } from "@/config/order-status-config";
import OrderStatusMessage from "./OrderStatusMessage";

type Props = {
  order: Order;
};

export default function OrderStatusHeader({ order }: Props) {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt);
    created.setMinutes(
      created.getMinutes() + parseInt(order.restaurant.estimatedDeliveryTime.toString())
    );

    const hours = created.getHours();
    const minutes = created.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes}`;
  };

  const getOrderStatusInfo = () => {
    return ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0];
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between gap-5 md:items-center">
        <h1 className="text-2xl font-bold tracking-tighter flex flex-col gap-2">
          <span>Estado de la Orden:</span>
          <OrderStatusMessage status={order.status} />
        </h1>
        <div className="flex flex-col text-right">
          <span className="text-sm text-gray-500">Tiempo estimado de entrega:</span>
          <span className="text-lg font-semibold">{getExpectedDelivery()}</span>
        </div>
      </div>
      <Progress className="animate-pulse" value={getOrderStatusInfo().progressiveValue} />
    </>
  );
}