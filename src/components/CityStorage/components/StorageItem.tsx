import { useState } from "react";

interface StorageItemProps {
  good: {
    id: number;
    priceStats: number[];
    maxStep: number;
    minPrice: number;
    maxPrice: number;
  };
  onBuy: (goodId: number, qty: number, price: number) => void;
}

function StorageItem({ good, onBuy }: StorageItemProps) {
  const [number, setNumber] = useState<number | string>("");

  return (
    <div className="good-item-description">
      <div className={`good-item item-${good.id}`} />
      <input
        className="input-number"
        name={"count" + new Date()}
        autoComplete="new-password"
        value={number}
        maxLength={3}
        onChange={(e) => {
          setNumber(parseInt(e.currentTarget.value, 10) || "");
        }}
      />

      <button
        className="button"
        onClick={() => {
          if (number) {
            onBuy(
              good.id,
              +number,
              good.priceStats[good.priceStats.length - 1]
            );
            setNumber(0);
          }
        }}
      >
        Buy
      </button>

      <p className="price-description">
        {good.priceStats[good.priceStats.length - 1]} a psc
      </p>
    </div>
  );
}

export default StorageItem;
