import React, { useEffect } from "react";
import Compass from "@arcgis/core/widgets/Compass";

const CompassWidget = ({ view }) => {
  useEffect(() => {
    if (!view) return;

    const compassWidget = new Compass({ view: view });

    view.ui.add(compassWidget, "top-left");

    return () => {
      if (compassWidget) {
        compassWidget.destroy();
      }
    };
  }, [view]);

  return null;
};

export default CompassWidget;