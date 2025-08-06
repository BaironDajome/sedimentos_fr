import { BusquedaStore } from "../../store/index";


export const useBusquedaStore = () => {
    const cadena = BusquedaStore((state) => state.cadena);
    const cadenaBusquedaLayer = BusquedaStore((state) => state.cadenaBusquedaLayer);
    
      ///////////////////////////////////////////////////////////////
  //Carga todos los dispositivos asociados al proyecto activo
  const cargarBusqueda= async (cadena) => {
    const salida = await cadenaBusquedaLayer(cadena); 
    //console.log(salida); 
    return salida;
  }

  ///////////////////////////////////////////////////////////////
  return {
    cadena,
    cargarBusqueda, 

  };
}