import { useContext, useEffect, useState } from "react";
import supabase from "../supabase/config";
import "./TotalHours.css";
import { UserContext } from "../context/usercontext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function TotalHours({ refresh }) {
  const { user } = useContext(UserContext);
  const [data, setData] = useState({
    hoursDone: 0,
    totalHours: 0,
    hoursLeft: 0,
    days_done: 0,
  });

  const diasFestivos = [
    "2025-03-03",
    "2025-03-04",
    "2025-04-18",
    "2025-04-21",
    "2025-05-01",
    "2025-05-02",
  ];
  const [extraHours, setExtraHours] = useState(0);
  const [lastDay, setLastDay] = useState("");
  const [finishingDate, setFinishingDate] = useState("");
  const [daysDone, setDaysDone] = useState([]);
  const [date, setDate] = useState(new Date());

  const fetchData = async () => {
    const { data: resumen, error } = await supabase
      .from("resumen")
      .select("*")
      .eq("user_id", user);
    if (error && user) {
      console.error(error);
    } else if (resumen && resumen.length > 0) {
      setData({
        hoursDone: resumen[0].horas_hechas || 0,
        totalHours: resumen[0].horas_necesarias || 0,
        hoursLeft: resumen[0].horas_faltantes || 0,
        days_done: resumen[0].dias_hechos || 0,
      });
    }

    const { data: practicasData, error: practicasError } = await supabase
      .from("practicas")
      .select("fecha, horas_extras")
      .eq("user_id", user);

    if (practicasError) {
      console.error(practicasError);
    } else {
      setDaysDone(practicasData);
      daysDone.forEach((p) => {});
    }

    const { data: extraHoursData, error: extraHoursError } = await supabase
      .from("practicas")
      .select("horas_extras")
      .eq("user_id", user)
      .gte("horas_extras", 1);

    if (extraHoursError) {
      console.error(extraHoursError);
    } else {
      let totalExtra = extraHoursData.reduce(
        (acc, p) => acc + p.horas_extras,
        0
      );
      setExtraHours(totalExtra);
    }
    if (user) {
      const { data: lastDayData, error: lastDayError } = await supabase
        .from("practicas")
        .select("fecha")
        .eq("user_id", user)
        .order("fecha", { ascending: false })
        .limit(1);

      if (lastDayError) {
        console.error("Error al obtener el último día:", lastDayError);
      } else if (lastDayData && lastDayData.length > 0) {
        setLastDay(lastDayData[0].fecha);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, refresh]);

  useEffect(() => {
    if (data.hoursLeft > 0) {
      const lasDayOfWork = (horasRestantes, festivos = []) => {
        let fecha = new Date();
        const horasPorDia = { 1: 4, 2: 4, 3: 5, 4: 5, 5: 4 };

        while (horasRestantes > 0) {
          fecha.setDate(fecha.getDate() + 1);
          let diaSemana = fecha.getDay();
          let fechaStr = fecha.toISOString().split("T")[0];
          if (diaSemana in horasPorDia && !festivos.includes(fechaStr)) {
            horasRestantes -= horasPorDia[diaSemana];
          }
        }
        return fecha.toISOString().split("T")[0];
      };

      setFinishingDate(lasDayOfWork(data.hoursLeft, diasFestivos));
    }
  }, [data.hoursLeft, extraHours]);

  return (
    <div className="bottom-container">
      {user ? (
        <>
          <div className="bottom-container-up">
            <div className="total-hours-container">
              <p className="hours-done">
                Horas Hechas: {data.hoursDone}h de {data.totalHours}h
              </p>
              <p className="hours-left">Faltan {data.hoursLeft} horas</p>
              <p className="total">
                {Math.round((data.hoursDone / data.totalHours) * 100)}% de las
                horas completas
              </p>
            </div>
            <div className="total-hours-container">
              <p className="days-done">Días trabajados: {data.days_done}</p>
              <p className="Extra-hours">Horas Extras Hechas: {extraHours}</p>
              <p className="last-day">
                Último Día Trabajado:{" "}
                {new Date(
                  new Date(lastDay).setDate(new Date(lastDay).getDate())
                ).toLocaleDateString()}
              </p>
            </div>
            <div className="total-hours-container">
              <Calendar
                onChange={setDate}
                value={date}
                calendarType="iso8601"
                tileClassName={({ date }) => {
                  if (!daysDone || daysDone.length === 0) return null;
                  const formattedDate = new Date(date);
                  formattedDate.setDate(formattedDate.getDate() + 1);
                  const formattedDateString = formattedDate
                    .toISOString()
                    .split("T")[0];
                  const practica = daysDone.find(
                    (p) => p.fecha === formattedDateString
                  );
                  if (practica) {
                    return practica.horas_extras > 0
                      ? "extra-hours"
                      : "no-extra-hours";
                  }
                  return null;
                }}
              />
            </div>
          </div>
          <div className="finishing-date-container">
            <p className="finishing-date">
              Fecha de Fin Estimada: {finishingDate}
            </p>
          </div>
        </>
      ) : (
        <p>Inicia sesión primero</p>
      )}
    </div>
  );
}

export default TotalHours;
