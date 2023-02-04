import "./Transportations.scss";
import { cities } from "../../cities";

interface transportationsProps {
  orders: {
    id: number;
    fromCityId: number;
    targetCityId: number;
    goodId: number;
    qty: number;
    days: number;
  }[];
  goods: {
    id: number;
    title: string;
  }[];
  onAcceptOrder: (order: transportationsProps["orders"][number]) => void;
}

function Transportations({
  orders,
  goods,
  onAcceptOrder,
}: transportationsProps) {
  const findGoodById = (itemId: number) =>
    goods.find((item) => item.id === itemId)?.title;

  const getCityNameById = (cityId: number) =>
    cities.find((city) => city.id === cityId)?.title;

  return (
    <div className="transportations">
      <h2 className="title">Active Transportations</h2>

      <div className="panel">
        {orders.map((order, idx) => (
          <div className="good-item-wrapper" key={idx}>
            <div className="good-item-description">
              <div className={`good-item item-${order.goodId}`} />
            </div>
            <div className="good-item-transport-info">
              <div>
                <div className="header">
                  {findGoodById(order.goodId)}, {order.qty} psc
                </div>
                <div className="path">
                  From: {getCityNameById(order.fromCityId)} <br />
                  To: {getCityNameById(order.targetCityId)}
                </div>
              </div>
              <div>
                <div className="days">Days: {order.days}</div>
                <button
                  className={`button ${order.days && "disabled"}`}
                  disabled={order.days ? true : false}
                  onClick={() => {
                    onAcceptOrder(order);
                  }}
                >
                  Get
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transportations;
