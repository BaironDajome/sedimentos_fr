import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';

///////////////////////////////////////////////////////////////
const busquedaApi = (set) => ({    
    cadena: undefined,
   
    ///////////////////////////////////////////////////////////////
    cadenaBusquedaLayer: (cadena ) => {
      set({ cadena: { ...cadena } });
      return cadena;
    },
    ///////////////////////////////////////////////////////////////

});
export const BusquedaStore = create()(
    devtools(
      persist(
        busquedaApi,
        {name:'busqueda' }
      )
    )
  );