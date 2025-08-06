import { GeoJsonStore } from "../../store/index";


export const useGeojsonStore = () => {

    const starLoadAllGeoJson = GeoJsonStore((state) => state.starLoadAllGeoJson);
    const starLoadiDGeoJson = GeoJsonStore((state) => state.starLoadiDGeoJson);
      ///////////////////////////////////////////////////////////////
  //Carga todos los dispositivos asociados al proyecto activo
  const cargarAllGeoJson= async () => {
    const salida = await starLoadAllGeoJson(); 
    //console.log(salida); 
    return salida;
  }

  const cargarAllGeoJsonId= async (id) => {
    // console.log(id);
    const salida = await starLoadiDGeoJson(id); 
    // console.log(salida); 
    return salida;
  }
  ///////////////////////////////////////////////////////////////
  return {
    cargarAllGeoJson, 
    cargarAllGeoJsonId    

  };
}