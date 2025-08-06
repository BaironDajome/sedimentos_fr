import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import 'cesium/Build/Cesium/Widgets/widgets.css';
import App from './App'
import store from './store'
import './i18n'
import '@arcgis/core/assets/esri/themes/light/main.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
