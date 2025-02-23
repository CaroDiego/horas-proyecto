import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

/**
 * TODO: ESQUEMA BBDD:
 *  - Dia
 *  - Horas del dia (4max)
 *  - Horas extras (la de los miercoles y jueves)
 *  ! No hay horas extras si horas no es == 4
 *  - Horas totales (383)
 *  - Horas totales hechas
 *  - Horas que quedan por hacer
 */
