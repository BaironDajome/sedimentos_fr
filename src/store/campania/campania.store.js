import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CampaniaService } from '../../service/campania/campania.service';
// import { CampaniaService } from '../../service/campania/campania.service';

///////////////////////////////////////////////////////////////
const campaniaApi = (set) => ({    
    campania: undefined,
   ///////////////////////////////////////////////////////////////
    startAllCampania: async() => {
        try {
        const {ok,datos}= await CampaniaService.cargarCampaniasAll();
        //  console.log(datos);

        if(!ok){
          set({campania:undefined});
          return false
        }
          set({campania:datos});

          return datos;
        } catch (error) {

        }    },
    ///////////////////////////////////////////////////////////////

});
export const CampaniaStore = create()(
    devtools(
      persist(
        campaniaApi,
        {name:'campania' }
      )
    )
  );