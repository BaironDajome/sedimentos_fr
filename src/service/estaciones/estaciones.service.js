
import { iotApi } from "../../api/iotApi";

export class EstacionesService {
///////////////////////////////////////////////////////////////////////////////////////////    
    static cargarEstacionesAll= async()=>{
        try {
            const resp = await iotApi.get('/dispositivo/lista');
            const datos = resp.data;
            // console.log(resp);
            return{
                ok: true, 
                datos
            }        
        } catch (error) {
            const errorMessage = "Las estaciones no se pudieron cargar";  
            return {
                ok: false,
                errorMessage,
            }       
            
        }    
    }

///////////////////////////////////////////////////////////////////////////////////////////    
    static cargarEstacionesId= async(id)=>{
        try {
            const resp = await iotApi.get(`/consulta/detalle/${id}`);
            const datos = resp.data;
            // console.log(resp);
            return{
                ok: true, 
                datos
            }        
        } catch (error) {
            const errorMessage = "Las estaciones no se pudieron cargar";  
            return {
                ok: false,
                errorMessage,
            }       
            
        }    
    }
///////////////////////////////////////////////////////////////////////////////////////////    
    static cargardatosEstacionesC= async(id)=>{
        try {
            const resp = await iotApi.get('/consulta/completo');
            const datos = resp.data;
            // console.log(resp);
            return{
                ok: true, 
                datos
            }        
        } catch (error) {
            const errorMessage = "Las estaciones no se pudieron cargar";  
            return {
                ok: false,
                errorMessage,
            }       
            
        }    
    }



}