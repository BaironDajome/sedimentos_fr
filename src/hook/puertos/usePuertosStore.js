import { PuertosStore } from "../../store/index";


export const usePuertosStore = () => {

  const puerto = PuertosStore((state) => state.puerto); // ✅ Reactivo
  const starLoadAllPuertos = PuertosStore((state) => state.starLoadAllPuertos);
  const setPuerto = PuertosStore((state) => state.setPuerto);
  //const loaPuert = 
          ///////////////////////////////////////////////////////////////
  //Carga todos los dispositivos asociados al proyecto activo
  const cargarAllPuertos= async () => {
    const puertos = await starLoadAllPuertos(); 

    // console.log(puertos); 
    return puertos;
  }
  ///////////////////////////////////////////////////////////////
  const definirPuerto=(puerto)=>{
    setPuerto(puerto);
  }
  ///////////////////////////////////////////////////////////////
  const cargarPuerto=()=>{
    const puerto = PuertosStore.getState().puerto;
    if (puerto) {
      // console.log('PUERTO CARGADO:', puerto);
    } else {
      console.warn('puerto aún no disponible');
    }
  }
  ///////////////////////////////////////////////////////////////

  return {
    puerto,
    cargarAllPuertos, 
    definirPuerto,
    cargarPuerto
  };
}