import { CampaniaStore } from "../../store/index";


export const useCampaniaStore = () => {

  const startAllCampania = CampaniaStore((state) => state.startAllCampania);
  
  ///////////////////////////////////////////////////////////////
  //Carga todos las campañas del proyecto
  const cargarAllCampanias= async () => {
    const campania = await startAllCampania(); 
    // console.log(campania); 
    return campania;
  }
 
  ///////////////////////////////////////////////////////////////

  return {
    cargarAllCampanias, 
  };
}