import "./Cities.scss";
import { cities } from "../../cities";

interface CitiesProps {
  currentCity: number;
  onChange: (city: number) => void;
}

function Cities({ currentCity, onChange }: CitiesProps) {
  return (
    <div className="cities-list">
      {cities.map((city) => (
        <span
          key={city.id}
          className={"city " + (currentCity === city.id ? "active" : "")}
          onClick={() => {
            onChange(city.id);
          }}
        >
          {city.title}
        </span>
      ))}
    </div>
  );
}

export default Cities;
