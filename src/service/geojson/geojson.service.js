
import { iotApi } from "../../api/iotApi";

export class GeoJsonService {
///////////////////////////////////////////////////////////////////////////////////////////    
    static cargarGeoJsonId= async(id)=>{
        try {
            const resp = await iotApi.get(`/geojson/buscar-subcapa/${id}`);
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
///////////////////////////////////////////////////////////////////////////////////////////
static cargarGeoJsonAll= async()=>{
    try {
        const resp = await iotApi.get('/geojson/all');
        const datos = resp.data;
        console.log(resp);
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
///////////////////////////////////////////////////////////////////////////////////////////
static guardarGeoJson= async()=>{
    try {
        const resp = await iotApi.post(`/geojson/upload-geojson`);
        const datos = resp.data;
        // console.log(datos);
        return{
            ok: true, 
            datos
        }        
    } catch (error) {
        const errorMessage = "La capa no pudo ser guardada";  
        return {
            ok: false,
            errorMessage,
        }               
    }
}
///////////////////////////////////////////////////////////////////////////////////////////

}