import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GeoJsonService } from '../../service/geojson/geojson.service';
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
const geojsonApi = (set) => ({    
    jeogson: undefined,
    ///////////////////////////////////////////////////////////////
    starLoadAllGeoJson: async ( ) => {
        try {
        const {ok,datos}= await GeoJsonService.cargarGeoJsonAll();
        // console.log(datos);

        if(!ok){
          set({jeogson:undefined});
          return false
        }
          set({jeogson:datos});

          return datos;
        } catch (error) {

        }
    },
    ///////////////////////////////////////////////////////////////
    starLoadiDGeoJson: async (id) => {
        try {
        const {ok,datos}= await GeoJsonService.cargarGeoJsonId(id);
        return datos;
        } catch (error) {

        }
    },
    ///////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////

});
export const GeoJsonStore = create()(
    devtools(
      persist(
        geojsonApi,
        {name:'geojson' }
      )
    )
  );