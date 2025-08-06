
import { iotApi } from "../../api/iotApi";

export class MorfologiaService {
///////////////////////////////////////////////////////////////////////////////////////////    
    static cargarLineasCostaAll= async()=>{
        try {
            const resp = await iotApi.get('/archivomorfologia');
            const datos = resp.data;
            // console.log(resp);
            return{
                ok: true, 
                datos
            }        
        } catch (error) {
            const errorMessage = "Las lineas de costa no se han podido cargar correctamente";  
            return {
                ok: false,
                errorMessage,
            }       
            
        }    
    }

///////////////////////////////////////////////////////////////////////////////////////////    

}