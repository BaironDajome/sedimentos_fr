
import { iotApi } from "../../api/iotApi";

export class CampaniaService {
///////////////////////////////////////////////////////////////////////////////////////////    
    static cargarCampaniasAll= async()=>{
        try {
            const resp = await iotApi.get('/campania');
            const datos = resp.data;
            // console.log(resp);
            return{
                ok: true, 
                datos
            }        
        } catch (error) {
            const errorMessage = "Las campañas no se pudieron cargar";  
            return {
                ok: false,
                errorMessage,
            }       
            
        }    
    }


}