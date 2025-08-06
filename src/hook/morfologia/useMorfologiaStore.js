import { EstacionesStore, MorfologiaStore } from "../../store/index";


export const useMorfologiaStore = () => {
  const lineacosta = MorfologiaStore((state) => state.lineacosta);   
  const startAllLineaCosta = MorfologiaStore((state) => state.startAllLineaCosta);   

  ///////////////////////////////////////////////////////////////
  //Carga todos los dispositivos asociados al proyecto activo
  const cargarAllLineasCosta= async () => {
    const lineascosta = await startAllLineaCosta(); 
    // console.log(estaciones); 
    return lineascosta;
  }
  
  ///////////////////////////////////////////////////////////////

  return {
    cargarAllLineasCosta,
    lineacosta
  };
}