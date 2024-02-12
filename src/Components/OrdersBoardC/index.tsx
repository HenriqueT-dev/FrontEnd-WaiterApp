import { useState } from "react";
import { toast } from 'react-toastify';

import { Order } from '../../types/Order';
import { Board, OrdersContainer } from "./styles";
import OrderModal from "../OrderModal";
import { api } from "../../utils/Api";

interface OrdersBoardProps {
  icon: string;
  title: string;
  orders: Order[];
  onCancelOrder: (orderId: string) => void
  onChangeOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function OrdersBoardC({ icon, title, orders, onCancelOrder, onChangeOrderStatus }: OrdersBoardProps) {
  const [isVisibleModal, setisVisibleModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<null | Order>(null)
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenModal(order: Order){
    setisVisibleModal(true);
    setSelectedOrder(order)
  }
  function handleCloseModal(){
    setisVisibleModal(false);
    setSelectedOrder(null)
  }
  async function handleChangeOrderStatus() {
    setIsLoading(true)

    const newStatus = selectedOrder?.status === 'WAITING'
    ? 'IN_PRODUCTION'
    : 'DONE';

    await api.patch(`/orders/${selectedOrder?._id}`, { status: newStatus })

    setIsLoading(false)
    setisVisibleModal(false)
    onChangeOrderStatus(selectedOrder!._id, newStatus);
    toast.success(`O pedido da mesa ${selectedOrder?.table} teve o status alterado!`)
  }
  async function handleCancelOrder() {
    setIsLoading(true)

    await api.delete(`/orders/${selectedOrder?._id}`);

    setIsLoading(false)
    setisVisibleModal(false)

    onCancelOrder(selectedOrder!._id)
    toast.success(`O pedido da mesa ${selectedOrder?.table} foi cancelado`)
  }

  return (
    <Board>
      <OrderModal
        visible={isVisibleModal}
        order={selectedOrder}
        onClose={handleCloseModal}
        onCancelOrder={handleCancelOrder}
        isLoading={isLoading}
        onChangeOrderStatus={handleChangeOrderStatus}
        />

      <header>
        <span>{icon}</span>
        <strong>{title}</strong>
        <span>({orders.length})</span>
      </header>

      {orders.length > 0 && (
        <OrdersContainer>
          {orders.map((order) =>
            <button type="button" key={order._id} onClick={() => handleOpenModal(order)}>
              <strong>Mesa {order.table}</strong>
              <span>{order.products.length} itens</span>
            </button>
          )}
        </OrdersContainer>
      )}
    </Board>
  )
}
