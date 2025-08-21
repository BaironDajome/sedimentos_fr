import React from 'react'

const Mediciones = React.lazy(() => import('./views/mediciones/Mediciones'))
const Sedimentos = React.lazy(() => import('./views/mediciones/Sedimentos'))
const Morfologia = React.lazy(() => import('./views/morfologia/Morfologia'))
const Modelaciones = React.lazy(() => import('./views/modelaciones/Modelaciones'))
const Canales = React.lazy(() => import('./views/canales/Canales'))

const routes = [
  { 
    path: '/', 
    exact: true, 
    name: 'Mediciones' 
  },

  {
    path: '/mediciones',
    name: 'Mediciones',
    element: Mediciones,
    exact: true,
  },


  {
    path: '/sedimentos',
    name: 'Sedimentos',
    element: Sedimentos,
    exact: true,
  },

  {
    path: '/morfologia/costa',
    name: 'Costas',
    element: Morfologia,    
  },


  {
    path: '/modelaciones/marea',
    name: 'Modelaciones',
    element: Modelaciones,    
  },


  {
    path: '/canal/buenaventura',
    name: 'Canales',
    element: Canales,    
  },


]

export default routes
