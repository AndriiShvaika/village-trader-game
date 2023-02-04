import { settings } from "../../config";
import "./Stats.scss";

interface StatsProps {
  days: number;
  money: number;
}

function Stats({ days, money }: StatsProps) {
  return (
    <div>
      <h2 className="title">Statistics</h2>

      <div className="panel stats-panel">
        <div className="money">
          {money} / {settings.goalMoney}
        </div>
        <div className="days">
          Days: {days} / {settings.goalDays}
        </div>
      </div>
    </div>
  );
}

export default Stats;
