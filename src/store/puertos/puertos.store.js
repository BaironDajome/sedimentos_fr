import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PuertosService } from '../../service/puertos/puertos.service';
///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////
const puertosApi = (set) => ({    
    puertos: undefined,
    puerto:'all', 
    ///////////////////////////////////////////////////////////////
    starLoadAllPuertos: async ( ) => {
        try {
        const {ok,datos}= await PuertosService.cargarPuertosAll();
        // console.log(datos);

        if(!ok){
          set({puertos:undefined});
          return false
        }
          set({puertos:datos});

          return datos;
        } catch (error) {

        }
    },
    ///////////////////////////////////////////////////////////////
    setPuerto: async (puerto) => {
      // console.log(puerto);
      set({puerto:puerto})
     },
    ///////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////

});
export const PuertosStore = create()(
    devtools(
      persist(
        puertosApi,
        {name:'puertos' }
      )
    )
  );