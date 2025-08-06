import { DateTime } from "luxon";
export const formatDate = (date) => {
  if (!date) return null;

  // Verificar si date es una cadena, y si lo es, convertirla en un objeto Date
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }

  // Verificar si date es una instancia válida de Date
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
  };
  //////////////////////////////////////////////////////////////////////////////
  export const AHtiempo = (tiempo) => {

    if (tiempo !== undefined) {
      // console.log(tiempo);
      const dt = DateTime.fromISO(tiempo, { zone: "America/Bogota" });
      const formattedTime = `${dt.toFormat("HH")}:${dt.toFormat("mm")}:${dt.toFormat("ss")}`;
      //const formattedDate = `${dt.year}-${dt.month}-${dt.day}`;
      const formattedDate = `${dt.toFormat("yyyy")}-${dt.toFormat("LL")}-${dt.toFormat("dd")}`;
      //const dia = DateTime.fromISO(formattedDate).setLocale("es");
      //const diaDeLaSemana = dia.toFormat('(cccc)');
      const diaDeLaSemana = capitalize(
        DateTime.local(dt.year, dt.month, dt.day).setLocale("es").weekdayLong
      );
      const mesdelDia = capitalize(
        DateTime.local(dt.year, dt.month, dt.day).setLocale("es").monthLong
      );
  
      // console.log(diaDeLaSemana,mesdelDia);
      return {
        diaDeLaSemana,
        mesdelDia,
        formattedTime,
        formattedDate,
        //dia,
      };
    } else {
      return {
        diaDeLaSemana: "00:00:00",
        mesdelDia: "00:00:00",
        formattedTime: "00:00:00",
        formattedDate: "00:00:00",
        dia:"00"
      };
    }
  };
  
/////////////////////////////////////////////////////////////////////
export const capitalize = (str) =>
  str.length ? str.charAt(0).toUpperCase() + str.slice(1) : "";
/////////////////////////////////////////////////////////////////////
export const formatoFecha = (date) => {
  console.log(date);

  if (date) {
      const formattedDate = formatDate(date);
      let [year, month, day] = formattedDate.split('-');

      // Sumar 1 al mes
      month = (parseInt(month, 10) + 1).toString().padStart(2, '0');

      // Ajustar el año si el mes es superior a 12
      if (parseInt(month, 10) > 12) {
          month = '01';
          year = (parseInt(year, 10) + 1).toString();
      }

      // Convertir a string para setStartYearMonth
          year = year.toString();
          month = month.toString();
          day = day.toString();

      return({ year, month, day });
  } else {
      const currentDate = new Date();
      return({
          year: currentDate.getFullYear().toString(),
          month: (currentDate.getMonth() + 1).toString().padStart(2, '0'), // Sumando 1 ya que getMonth() devuelve 0-11
          day: currentDate.getDate().toString().padStart(2, '0')
      });
  }
};

