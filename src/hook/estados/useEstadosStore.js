import { EstadosStore } from "../../store/index";

export const useEstadosStore = () => {
  const ventana_layer = EstadosStore((state) => state.ventana_layer); // ✅ Reactivo
  const setventanaState = EstadosStore((state) => state.setventanaState);
  // const getventanaState = EstadosStore((state) => state.getventanaState);

  const setestadoVentana = (ventana_layer) => {
    // console.log("Nuevo valor:", ventana_layer);
    setventanaState(ventana_layer);
  };

  return {
    ventana_layer,        // ✅ Estado reactivo
    setestadoVentana,     // Setter personalizado
    // getventanaState       // Getter directo (no reactivo)
  };
};
