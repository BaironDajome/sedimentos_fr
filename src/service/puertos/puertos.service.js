
import { iotApi } from "../../api/iotApi";

export class PuertosService {
///////////////////////////////////////////////////////////////////////////////////////////    
    static cargarPuertosAll= async(id)=>{
        try {
            const resp = await iotApi.get('/puertos');
            const datos = resp.data;
            // console.log(resp);
            return{
                ok: true, 
                datos
            }        
        } catch (error) {
            const errorMessage = "La capa no se pudo cargar";  
            return {
                ok: false,
                errorMessage,
            }       
            
        }    
    }


}