import { Actions, ModalBody, OrderDetails, Overlay } from "./styles";

import close from '../../assets/images/close-icon.svg'
import { Order } from '../../types/Order';
import { formartCurrency } from "../../utils/formatCurrency";
import { useEffect } from "react";

interface OrderModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onCancelOrder: () => Promise<void>;
  isLoading: boolean
  onChangeOrderStatus: () => void;
}

export default function OrderModal({ visible, order, onClose, onCancelOrder, isLoading, onChangeOrderStatus}: OrderModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!visible || !order) {
    return null;
  }

  // logica de somar o valor final usando forEach(jeito menos perfomático Ass: HenriqueT)
  // let total = 0;
  // order.products.forEach(({product, quantity}) => {
  //   total += product.price * quantity;
  // });

  //jeito usando o reduce, para melhor entendimento use o chatGPT e peça para que ele explique detalhadamente cada elemento
  const total = order.products.reduce((total, { product, quantity }) => {
    return total + (product.price * quantity);
  }, 0);

  return (
    <Overlay>
      <ModalBody>
        <header>
          <h2>Mesa {order.table}</h2>
          <button type="button">
            <img src={close} alt="image para fechar o modal" onClick={onClose} />
          </button>
        </header>

        <div className="status-pedido">
          <small>Status do pedido</small>
          <div>
            <span>
              {order.status === 'WAITING' && '🕒'}
              {order.status === 'IN_PRODUCTION' && '👨‍🍳'}
              {order.status === 'DONE' && '✅'}
            </span>
            <strong>
              {order.status === 'WAITING' && 'Fila de espera'}
              {order.status === 'IN_PRODUCTION' && 'Em preparação'}
              {order.status === 'DONE' && 'Pronto!'}
            </strong>
          </div>
        </div>
        <OrderDetails>
          <strong>Itens</strong>

          <div className="order-items">
            {order.products.map(({ _id, product, quantity }) => (
              <div className="item" key={_id}>
                <img
                  src={`http://localhost:3001/uploads/${product.imagePath}`}
                  alt={product.name}
                  width='56'
                  height='28.51'
                />
                <span className="quantity">{quantity}x</span>

                <div className="product-details">
                  <strong>{product.name}</strong>
                  <span>{formartCurrency(product.price)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="total">
            <span>Total</span>
            <strong>{formartCurrency(total)}</strong>
          </div>
        </OrderDetails>

        <Actions>
          {order.status !== 'DONE' && (
            <button
              type="button"
              className="primary"
              disabled={isLoading}
              onClick={onChangeOrderStatus}
            >
              <span>
                {order.status === 'WAITING' && '👨‍🍳'}
                {order.status === 'IN_PRODUCTION' && '✅'}
              </span>

              <strong>
                {order.status === 'WAITING' && 'Iniciar Produção'}
                {order.status === 'IN_PRODUCTION' && 'Concluir pedido'}
              </strong>
            </button>
          )}

          <button
            type="button"
            className="secondary"
            onClick={onCancelOrder}
            disabled={isLoading}
          >
            Cancelar Pedido
          </button>
        </Actions>
      </ModalBody>
    </Overlay>
  )
}
