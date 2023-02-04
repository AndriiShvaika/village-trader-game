import { useState } from "react";
import "./Storage.scss";
import { cities } from "../../cities";

interface StorageProps {
  currentCity: number;
  selectedGood: number | null;
  selectedProductPrice: number;
  storage: {
    id: number;
    qty: number;
  }[];
  goods: { id: number; title: string }[];
  onSelectGood: (goodId: number) => void;
  onSell: (id: number, qty: number, getTotalPrice: number) => void;
  onTransport: (targetCityId: number) => void;
}

function Storage({
  currentCity,
  storage,
  goods,
  selectedProductPrice,
  selectedGood,
  onSelectGood,
  onSell,
  onTransport,
}: StorageProps) {
  const [qty, setQty] = useState<number | string>("");
  const [targetCityId, setTargetCityId] = useState(1);

  const findGoodById = (itemId: number) =>
    goods.find((item) => item.id === itemId)?.title;

  const getEmptyCells = () => {
    if (storage.length < 8) {
      return Array(8 - storage.length)
        .fill(undefined)
        .map((_, idx) => <li key={idx} className="good-item no-item"></li>);
    }
  };

  const getTotalPrice = () =>
    parseInt((selectedProductPrice * +qty * 0.9).toString(), 10);

  return (
    <div>
      <h2 className="title">My storage</h2>

      <div className="panel">
        <ul className="goods">
          {storage.map((item) => (
            <li
              key={item.id}
              className={`good-item item-${item.id} ${
                selectedGood === item.id ? "selected" : ""
              }`}
              onClick={() => onSelectGood(item.id)}
            >
              <span className="good-description">{item.qty} psc</span>
            </li>
          ))}{" "}
          {getEmptyCells()}
        </ul>

        {selectedGood ? (
          <>
            <div className="sell-panel">
              <div className="sell-panel-content">
                <div>{findGoodById(selectedGood)}</div>
                <div className="controls">
                  <input
                    type="text"
                    className="input"
                    maxLength={3}
                    value={qty}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setQty(parseInt(event.target.value, 10) || "");
                    }}
                  />{" "}
                  psc
                  <button
                    className="button"
                    onClick={() => {
                      onSell(selectedGood, +qty, getTotalPrice());
                    }}
                    disabled={!qty || !selectedProductPrice}
                  >
                    Sell
                  </button>
                </div>
              </div>
              {qty && selectedProductPrice ? (
                <div className="sell-panel-info">
                  By price {selectedProductPrice} x {qty} psc, tax: 10%. Total:{" "}
                  {getTotalPrice()}
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="order-panel">
              <div>
                <select
                  className="select-city"
                  value={targetCityId}
                  onChange={(e) => {
                    setTargetCityId(parseInt(e.currentTarget.value, 10));
                  }}
                >
                  {cities.map((city) => (
                    <option
                      key={city.id}
                      disabled={city.id === currentCity}
                      value={city.id}
                    >
                      {city.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="controls">
                <button
                  className="button"
                  onClick={() => {
                    onTransport(targetCityId);
                  }}
                  disabled={targetCityId === currentCity}
                >
                  Transport
                </button>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Storage;
