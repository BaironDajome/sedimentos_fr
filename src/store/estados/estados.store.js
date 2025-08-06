import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const estadosApi = (set, get) => ({    
  ventana_layer: false,

  // Setter
  setventanaState: (ventana_layer) => {
    // console.log(ventana_layer);
    set({ ventana_layer: ventana_layer });
  },

  // Getter
  // getventanaState: () => {
  //   console.log(get().ventana_layer);
  //   return get().ventana_layer;
  // },
});

export const EstadosStore = create()(
  devtools(
    persist(estadosApi, { name: 'estados' })
  )
);
