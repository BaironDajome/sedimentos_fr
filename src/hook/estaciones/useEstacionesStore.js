import { EstacionesStore } from "../../store/index";


export const useEstacionesStore = () => {
  const marcadores = EstacionesStore((state) => state.marcadores);   
  const localizacion = EstacionesStore((state)=>state.localizacion);
  const setEstacionState = EstacionesStore((state)=>state.setEstacionState);
  const startAllEstaciones = EstacionesStore((state) => state.startAllEstaciones);
  const startEstacionId = EstacionesStore((state) => state.startEstacionId);
  const setEstacionmarcadoresState = EstacionesStore((state) => state.setEstacionmarcadoresState);
  const cargarTodosEstacionesC = EstacionesStore((state) => state.cargarTodosEstacionesC);   
  ///////////////////////////////////////////////////////////////
  //Carga todos los dispositivos asociados al proyecto activo
  const cargarAllEstaciones= async () => {
    const estaciones = await startAllEstaciones(); 
    // console.log(estaciones); 
    return estaciones;
  }
  ///////////////////////////////////////////////////////////////
    //Carga todos los dispositivos asociados al proyecto activo
  const cargarDatosEstacionesC= async () => {
    const estaciones = await cargarTodosEstacionesC(); 
    // console.log(estaciones); 
    return estaciones;
  }
  ///////////////////////////////////////////////////////////////
    const cargarEstacionId= async (id) => {
    // console.log(id);
    const estacion = await startEstacionId(id); 
    // console.log(estaciones); 
    return estacion;
  }
  ///////////////////////////////////////////////////////////////
    const setMarcadores= (marcadores) => {
    // console.log(id);
    const estacion =  setEstacionmarcadoresState(marcadores); 
    // console.log(estaciones); 
    return estacion;
  }

  ///////////////////////////////////////////////////////////////
    const setEstacion= (localizacion) => {
    // console.log(localizacion);
    const estacion =  setEstacionState(localizacion); 
    // console.log(estaciones); 
    return estacion;
  }

  ///////////////////////////////////////////////////////////////

  return {
    cargarDatosEstacionesC,
    cargarAllEstaciones, 
    cargarEstacionId,
    setMarcadores,
    setEstacion,
    marcadores,
    localizacion

  };
}