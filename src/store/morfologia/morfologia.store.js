import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { MorfologiaService } from '../../service/morfologia/morfologia.service';


///////////////////////////////////////////////////////////////
const morfologiaApi = (set) => ({    
    lineacosta:[],
    ///////////////////////////////////////////////////////////////
    startAllLineaCosta: async() => {
        try {
        const {ok,datos}= await MorfologiaService.cargarLineasCostaAll();
        // console.log(datos);

        if(!ok){
          set({lineacosta:undefined});
          return false
        }
          set({lineacosta:datos});

          return datos;
        } catch (error) {

        }    
      },


});
export const MorfologiaStore = create()(
    devtools(
      persist(
        morfologiaApi,
        {name:'morfologia' }
      )
    )
  );