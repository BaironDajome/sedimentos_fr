/**
 * @file CoordinateConversionWidget.js
 * @brief Componente que agrega un widget de conversión de coordenadas en un mapa de ArcGIS.
 */

import React, { useEffect } from "react";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";

/**
 * @class CoordinateConversionWidget
 * @brief Componente que integra el widget de conversión de coordenadas en la vista del mapa.
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.view - Instancia de la vista del mapa de ArcGIS.
 * @returns {null} No renderiza contenido en el DOM, solo agrega widgets a la vista del mapa.
 */
const CoordinateConversionWidget = ({ view }) => {
  /**
   * @brief Efecto secundario que inicializa el widget CoordinateConversion y lo agrega a la vista.
   * Se ejecuta cada vez que `view` cambia.
   */
  useEffect(() => {
    // Verifica si la vista del mapa está disponible
    if (!view) return;

    /**
     * @var {CoordinateConversion} coordinateWidget
     * @brief Instancia del widget CoordinateConversion que permite visualizar coordenadas en diferentes formatos.
     */
    const coordinateWidget = new CoordinateConversion({
      view: view, // Asigna la vista del mapa al widget
      activeTool: "UTM", // Establecer la herramienta activa en UTM
      // mode: "decimal", // Usar coordenadas en formato decimal
      visibleElements: {
        settingsButton: false, // Deshabilitar el botón de configuración
        captureButton: false, // Deshabilitar el botón de captura
        editButton: false, // Deshabilitar el botón de edición      
        expandButton: false, // Deshabilitar el botón de expansión
        coordinateFormat: false, // Deshabilitar el formato de coordenadas
        coordinateConversion: false, // Deshabilitar la conversión de coordenadas
      },
    });

    // Agrega el widget a la esquina inferior izquierda de la vista del mapa
    view.ui.add(coordinateWidget, "bottom-left");

    /**
     * @brief Función de limpieza que destruye el widget cuando el componente se desmonta.
     */
    return () => {
      if (coordinateWidget) {
        coordinateWidget.destroy();
      }
    };
  }, [view]); // Se ejecuta cuando `view` cambia

  /**
   * @returns {null} No renderiza ningún elemento en el DOM, solo maneja widgets en la vista del mapa.
   */
  return null;
};

export default CoordinateConversionWidget;
