import { useContext, useEffect, useState } from "react";
import supabase from "../supabase/config";
import "./TotalHours.css";
import { UserContext } from "../context/usercontext";

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

  const fetchData = async () => {
    const { data: resumen, error } = await supabase
      .from("resumen")
      .select("*")
      .eq("user_id", user);
    if (error && user) {
      console.log(error);
    } else if (resumen && resumen.length > 0) {
      setData({
        hoursDone: resumen[0].horas_hechas || 0,
        totalHours: resumen[0].horas_necesarias || 0,
        hoursLeft: resumen[0].horas_faltantes || 0,
        days_done: resumen[0].dias_hechos || 0,
      });
    }

    const { data: practicas, error: practicasError } = await supabase
      .from("practicas")
      .select("horas_extras")
      .gte("horas_extras", 1);

    if (practicasError) {
      console.log(practicasError);
    } else {
      let totalExtra = practicas.reduce((acc, p) => acc + p.horas_extras, 0);
      setExtraHours(totalExtra);
    }

    const { data: lastDayData, error: lastDayError } = await supabase
      .from("practicas")
      .select("fecha")
      .order("fecha", { ascending: false })
      .limit(1);

    if (lastDayError) {
      console.log(lastDayError);
    } else if (lastDayData.length > 0) {
      setLastDay(lastDayData[0].fecha);
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
              <p className="hours-left">
                Faltan {data.totalHours - data.hoursDone} horas
              </p>
              <p className="total">
                {Math.round((data.hoursDone / data.totalHours) * 100)}% de las
                horas completas
              </p>
            </div>
            <div className="total-hours-container">
              <p className="days-done">Días trabajados: {data.days_done}</p>
              <p className="Extra-hours">Horas Extras Hechas: {extraHours}</p>
              <p className="last-day">Último Día Trabajado: {lastDay}</p>
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
