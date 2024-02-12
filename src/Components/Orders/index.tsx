import { useEffect, useState } from "react";
import socketIo from 'socket.io-client';

import { Order } from "../../types/Order";
import OrdersBoardC from "../OrdersBoardC";
import { Container } from "./styles";
import { api } from "../../utils/Api";


export default function Orders(){
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const socket = socketIo('http://localhost:3001', {
      transports: ['websocket'],
    });

    socket.on('orders@new', (order: Order) => {
      setOrders(prevState => prevState.concat(order));
    });
  }, []);

  useEffect(() => {
    api.get('/orders')
      .then(({data}) => {
        setOrders(data)
      })
  }, []);

  const waiting = orders.filter((order) => order.status === 'WAITING');
  const inProduction = orders.filter((order) => order.status === 'IN_PRODUCTION');
  const done = orders.filter((order) => order.status === 'DONE');

  function handleOrderStatusChange(orderId: string, status: Order['status']) {
    setOrders((prevState) => prevState.map((order) => (
      order._id === orderId
      ? {...order, status }
      : order
    )))
  }

  function handleCancelOrder(orderId: string) {
    setOrders((prevState) => prevState.filter(order => order._id !== orderId))
  }

  return(
    <Container>
      <OrdersBoardC
        icon= '🕒'
        title= 'Fila de espera'
        orders={waiting}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
      <OrdersBoardC
        icon= '👨‍🍳'
        title= 'Em preparação'
        orders={inProduction}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
      <OrdersBoardC
        icon= '✅'
        title= 'Pronto!'
        orders={done}
        onCancelOrder={handleCancelOrder}
        onChangeOrderStatus={handleOrderStatusChange}
      />
    </Container>
  )
}
