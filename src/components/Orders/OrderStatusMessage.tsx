import type { OrderStatus } from "@/api/types";
import { FaCheckCircle, FaClipboardList, FaClock, FaTimesCircle, FaTruck } from "react-icons/fa";
import { FaKitchenSet } from "react-icons/fa6";

type Props = {
  status: OrderStatus;
};

export default function OrderStatusMessage({ status }: Props) {
  switch (status) {
    case "placed":
      return (
        <span className="flex items-center gap-2 text-blue-500">
          <FaClipboardList /> Recibida
        </span>
      );
    case "paid":
      return (
        <span className="flex items-center gap-2 text-orange-500">
          <FaClock /> Esperando confirmación del restaurante
        </span>
      );
    case "inProgress":
      return (
        <span className="flex items-center gap-2 text-yellow-500">
          <FaKitchenSet /> En proceso
        </span>
      );
    case "outForDelivery":
      return (
        <span className="flex items-center gap-2 text-purple-500">
          <FaTruck /> En reparto
        </span>
      );
    case "delivered":
      return (
        <span className="flex items-center gap-2 text-green-500">
          <FaCheckCircle /> Entregada
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-2 text-red-500">
          <FaTimesCircle /> Estado inválido
        </span>
      );
  }
}