import { useState } from "react";
import supabase from "../supabase/config";
import "./AddDay.css";

function AddDay() {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [extraHours, setExtraHours] = useState("");

  const dateChange = (e) => {
    setDate(e.target.value);
  };

  const hoursChange = (e) => {
    const value = e.target.value;
    if (value <= 4) {
      setHours(value);
    }
  };

  const extraHoursChange = (e) => {
    setExtraHours(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(date, hours, extraHours);
    const { data, error } = await supabase
      .from("practicas")
      .insert([
        {
          fecha: date,
          horas: hours,
          horas_extras: extraHours,
        },
      ])
      .select();
  };

  const isFormValid = date && hours;

  return (
    <div className="AddHours-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Fecha</label>
        <input type="date" value={date} onChange={dateChange} />

        <label htmlFor="hours">Horas Hechas</label>
        <input
          type="number"
          value={hours}
          onChange={hoursChange}
          max="4"
          required
        />

        <label htmlFor="extraHours">Horas Extras</label>
        <input
          type="number"
          value={extraHours}
          onChange={extraHoursChange}
          disabled={hours !== "4"}
        />

        <button type="submit" disabled={!isFormValid}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default AddDay;
