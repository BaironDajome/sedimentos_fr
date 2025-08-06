import {create} from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { EstacionesService } from '../../service/estaciones/estaciones.service';

///////////////////////////////////////////////////////////////
const estacionesApi = (set) => ({    
    estaciones: undefined,
    estacion:undefined,
    todosdatos:undefined,
    marcadores:[],
    localizacion:{lat: 2.68, lon: -78.026 },
    ///////////////////////////////////////////////////////////////
    startAllEstaciones: async() => {
        try {
        const {ok,datos}= await EstacionesService.cargarEstacionesAll();
        // console.log(datos);

        if(!ok){
          set({estaciones:undefined});
          return false
        }
          set({estaciones:datos});

          return datos;
        } catch (error) {

        }    
      },
    ///////////////////////////////////////////////////////////////
    cargarTodosEstacionesC:async()=>{
        try {
        const {ok,datos}= await EstacionesService.cargardatosEstacionesC();
        //console.log(datos);

        if(!ok){
          set({todosdatos:undefined});
          return false
        }
          set({todosdatos:datos});

          return datos;
        } catch (error) {

        }    
    },
    ///////////////////////////////////////////////////////////////    
        startEstacionId: async(id) => {
        try {
        const {ok,datos}= await EstacionesService.cargarEstacionesId(id);
        // console.log(datos);

        if(!ok){
          set({estacion:undefined});
          return false
        }
          set({estacion:datos});

          return datos;
        } catch (error) {

        }    },
    ///////////////////////////////////////////////////////////////
      setEstacionmarcadoresState: (marcadores) => {      
      set({ marcadores: marcadores });
      },
    ///////////////////////////////////////////////////////////////

        setEstacionState: (localizacion) => {      
        set({localizacion: localizacion });
        },

    ///////////////////////////////////////////////////////////////

});
export const EstacionesStore = create()(
    devtools(
      persist(
        estacionesApi,
        {name:'estaciones' }
      )
    )
  );