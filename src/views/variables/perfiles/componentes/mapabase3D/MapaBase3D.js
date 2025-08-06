import MapaCesium from "./Mapacesium";
import { ContenedorMarcadores } from "../marcadores/ContenedorMarcadores";
// import { datToJson } from "../../helpers/Helpers";

const CesiumViewer = () => {


  return (
    
        <MapaCesium>
            <ContenedorMarcadores/>
        </MapaCesium>
    
  );
};

export default CesiumViewer;
