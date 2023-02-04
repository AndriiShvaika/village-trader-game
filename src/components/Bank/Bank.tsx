import { useState } from "react";
import "./Bank.scss";

interface BankProps {
  deposits: {
    id: number;
    days: number;
    amount: number;
  }[];
  onOpenDeposit: (amount: number) => void;
  money: number;
}

function Bank({ deposits, onOpenDeposit, money }: BankProps) {
  const [amount, setAmount] = useState<"" | number>("");

  return (
    <div>
      <h2 className="title">Bank</h2>

      <div className="panel">
        <div className="sell-panel">
          <div className="sell-panel-content">
            <div>Total:</div>
            <div className="controls">
              <input
                type="text"
                className="input"
                maxLength={4}
                value={amount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  // @ts-ignore
                  setAmount(parseInt(event.target.value, 10) || "");
                }}
              />
              <button
                className="button"
                onClick={() => {
                  onOpenDeposit(+amount);
                }}
                disabled={!amount || money < amount}
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {deposits.map((deposit) => {
          return (
            <div className="good-item-wrapper" key={deposit.id}>
              <div className="good-item-description">
                <div className={"good-item item-deposit"} />
              </div>
              <div className="good-item-deposit-info">
                <div>
                  <div className="header">Sum: {deposit.amount}</div>
                  <div className="days">Days to close: {deposit.days}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bank;
