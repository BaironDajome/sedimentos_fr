import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import Expand from "@arcgis/core/widgets/Expand";
import SidebarCoreUI from "../../sidebar/SidebarCoreUI";

const SearchWidget = ({ view }) => {
  const containerRef = useRef(null);
  const expandRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    // Si no hay vista o contenedor, no hacemos nada
    if (!view || !containerRef.current) return;

    // Solo crear el root si no existe
    if (!rootRef.current) {
      rootRef.current = createRoot(containerRef.current);
      rootRef.current.render(<SidebarCoreUI />);
    }

    // Añadir el contenedor al UI (si no está ya agregado)
    if (!containerRef.current.parentElement) {
      view.ui.add(containerRef.current, "top-right");
    }

    // Crear el widget Expand solo si no existe
    if (!expandRef.current) {
      const expand = new Expand({
        view,
        content: containerRef.current,
        expandTooltip: "Ubicaciones",
        expandIconClass: "esri-icon-map-pin",
      });

      expandRef.current = expand;
      view.ui.add(expand, "top-right");
    }

    // Cambiar icono después de que el botón se haya creado
    const timer = setTimeout(() => {
      const expandButton = document.querySelector(
        '.esri-ui-top-right .esri-widget-button .esri-expand__icon'
      );
      if (expandButton) {
        expandButton.classList.remove("esri-icon-expand");
        expandButton.classList.add("esri-icon-map-pin");
      }
    }, 300);

    // === Limpieza segura y asincrónica ===
    return () => {
      clearTimeout(timer);

      // Limpiar widget Expand
      if (expandRef.current) {
        setTimeout(() => {
          try {
            view.ui.remove(expandRef.current);
            expandRef.current.destroy();
          } catch (error) {
            console.warn("Error al destruir el widget Expand:", error);
          } finally {
            expandRef.current = null;
          }
        }, 0); // Retrasamos la limpieza para evitar conflictos de renderizado
      }

      // Limpiar React Root
      if (rootRef.current) {
        setTimeout(() => {
          try {
            rootRef.current.unmount();
          } catch (error) {
            console.warn("Error al desmontar el React Root:", error);
          } finally {
            rootRef.current = null;
          }
        }, 0);
      }
    };
  }, [view]); // Solo vuelve a ejecutarse si 'view' cambia

  return <div ref={containerRef} />;
};

export default SearchWidget;