
import CIMSymbol from '@arcgis/core/symbols/CIMSymbol';
import crossfilter from 'crossfilter2';
import { AHtiempo } from '../../../../helpers/formatoFecha';
import kriging from '@sakitam-gis/kriging';
import * as turf from '@turf/turf';

/**
 * Agrupa estaciones con Crossfilter y permite filtrar por puerto.
 * @param {Object[]} estaciones - Array crudo de estaciones.
 * @param {string}    puerto    - "Tumaco" | "Buenaventura" | "all".
 * @returns {Object[]}  Estaciones agrupadas (nombre único) con sets limpiados.
 */

//export function clearEstaciones({ estaciones = [], puerto = [{ key: 'all', label: 'Todas las estaciones' }] }) {
/**
 * Filtra las estaciones por puerto usando Crossfilter
 *
 * @param {Object} params - Parámetros de entrada
 * @param {Array} [params.estaciones=[]] - Lista de estaciones a filtrar
 * @param {Array} [params.puerto=[{ key: 'all', label: 'Todas las estaciones' }]] - Puerto seleccionado (array con un objeto)
 * @returns {Array} Estaciones filtradas
 */
export function clearEstaciones({
  estaciones = [],
  puerto = [{ key: 'all', label: 'Todas las estaciones' }],
}) {

  // console.log(estaciones);
  // console.log(puerto);

  const cf = crossfilter(estaciones);
  const dPuerto = cf.dimension(d => d.puerto_id);

  const seleccionar = puerto ?? { key: 'all' };
  // console.log(seleccionar);

  if (seleccionar === 'all') {
    dPuerto.filterAll();
  } else {
    dPuerto.filterExact(seleccionar.id);
  }

  const estacionesFiltradas = dPuerto.top(Infinity);

  // Agrupamiento por descripción
  const agrupadostotal = {};
  const detallesPorDescripcion = {};

  estacionesFiltradas.forEach(estacion => {
    const desc = estacion.descripcion || 'Sin descripción';

    // Conteo
    agrupadostotal[desc] = (agrupadostotal[desc] || 0) + 1;

    // Coordenadas y nombres
    if (!detallesPorDescripcion[desc]) {
      detallesPorDescripcion[desc] = [];
    }
    detallesPorDescripcion[desc].push({
      nombre: estacion.nombre,
      localizacion: estacion.localizacion, // { type, coordinates }
    });
  });

  const agrupados = Object.entries(agrupadostotal).map(([descripcion, count]) => {
    const iniciales = (descripcion.match(/[A-ZÁÉÍÓÚÜÑ]/g) || []).slice(0, 3).join('');
    return {
      descripcion,
      count,
      iniciales,
      estaciones: detallesPorDescripcion[descripcion], // lista de {nombre, localizacion}
    };
  });

  dPuerto.filterAll();
  // console.log(estacionesFiltradas);
  return {
    estacionesFiltradas,
    agrupados,
  };
}


/////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------- helpers ----------------------------
export function getColorByPrefix (name) {
  // console.log('getColorByPrefix:', name);
  if (name.startsWith('DES')) return [255,   0,   0, 100];   // rojo
  if (name.startsWith('MCT')) return [  0, 255,   0, 255];   // verde
  if (name.startsWith('PMT')) return [  80,   20, 190,255];   // azul
  if (name.startsWith('PMB')) return [255, 165,   0, 255];   // naranja
  return                             [  0, 112, 255, 255];        // defecto
}

// genera 1 anillo con N vértices para un círculo suave
function makeCircle (cx = 0, cy = 0, r = 10, steps = 64) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * 2 * Math.PI;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return [pts];          //  ArcGIS CIM espera array de rings
}

// ---------------------- símbolo ----------------------------
export function buildCIMSymbol (rgba) {
  // color del punto central opaco
  const [r, g, b] = rgba;
  const fill      = [r, g, b, 100];
  const strokeWhite = [255, 255, 255, 255]; // contorno blanco

  return new CIMSymbol({
    data: {
      type: 'CIMSymbolReference',
      symbol: {
        type: 'CIMPointSymbol',
        symbolLayers: [
          // círculo relleno con color definido (centro) y contorno blanco
          {
            type:  'CIMVectorMarker',
            size:  5,
            frame: { xmin: -10, ymin: -10, xmax: 10, ymax: 10 },
            markerGraphics: [{
              type:     'CIMMarkerGraphic',
              geometry: { rings: makeCircle() }, // círculo
              symbol: {
                type: 'CIMPolygonSymbol',
                symbolLayers: [
                  { type: 'CIMSolidFill',  enable: true, color: fill },
                  { type: 'CIMSolidStroke', enable: true, width: 2, color: strokeWhite }
                ]
              }
            }],
            respectFrame: true
          },

          // anillo blanco animado con relleno tenue y contorno blanco
          {
            type:  'CIMVectorMarker',
            size:  7,
            frame: { xmin: -10, ymin: -10, xmax: 10, ymax: 10 },
            markerGraphics: [{
              type:     'CIMMarkerGraphic',
              geometry: { rings: makeCircle() }, // círculo para anillo
              symbol: {
                type: 'CIMPolygonSymbol',
                symbolLayers: [
                  { type: 'CIMSolidFill',  enable: true, color: [255, 255, 255, 40] },  // relleno blanco tenue
                  { type: 'CIMSolidStroke', enable: true, width: 1, color: [255, 255, 255, 100] } // contorno blanco
                ]
              }
            }],
            respectFrame: true,
            primitiveName: 'whiteRingAlpha'  // identificador para animación
          }
        ],
        animations: [
          {
            type: 'CIMSymbolAnimationScale',
            primitiveName: 'whiteRingAlpha', // animar solo anillo blanco
            scaleFactor: 2.0,                 // tamaño del pulso más grande
            animatedSymbolProperties: {
              type: 'CIMAnimatedSymbolProperties',
              primitiveName: 'whiteRingAlpha',
              playAnimation: true,
              repeatType: 'Loop',
              repeatDelay: 1.5,
              duration: 1.5
            }
          }
        ]
      }
    }
  });
}
///////////////////////////////////////////////////////////////////
export function formatCampanias(estacion) {
  // console.log(estacion);
  // Mapeo de nombres de componente a etiquetas legibles
  const labelMap = {
    Nivelmar: 'Nivel del mar',
    Perfilctd: 'Perfil Ctd',
    Marea: 'Marea',
    Oleaje: 'Oleaje'
  };

  // Si no hay campañas, devolvemos un arreglo vacío
  if (!estacion.campanias || typeof estacion.campanias !== 'object') {
    return [];
  }

  // Iteramos sobre cada campaña dinámicamente (CTSH2023, CTSH2024...)
  return Object.values(estacion.campanias).map(camp => ({
    value: camp.nombre,
    label: camp.nombre,
    categorias: (camp.componentes || []).map(comp => ({
      value: comp,
      label: labelMap[comp] || comp // Usa el label mapeado o el mismo valor si no existe
    }))
  }));
}
/**
 * Devuelve las pestañas disponibles según el componente seleccionado
 * @param {string} componentValue - valor del componente (ej: 'Nivelmar')
 * @returns {Array<{itemKey: string, label: string}>}
 */
export function getTabsByComponent(componentValue) {
  // console.log('componentValue:', componentValue);
  switch (componentValue) {
    case 'Nivelmar':
      return [
        { itemKey: 'descripcion', label: 'Descripción' },
        { itemKey: 'grafica', label: 'Gráfica' }
      ];
    case 'Perfilctd':
      return [
        { itemKey: 'perfil', label: 'Perfil CTD' },
        { itemKey: 'resumen', label: 'Resumen' }
      ];
    case 'Marea':
      return [
        { itemKey: 'mareografo', label: 'Mareógrafo' },
        { itemKey: 'prediccion', label: 'Predicción' }
      ];
    case 'Oleaje':
      return [
        { itemKey: 'informe', label: 'Informe' },
        { itemKey: 'grafica', label: 'Gráfica' }
      ];
    default:
      return [{ itemKey: 'default', label: 'Sin información' }];
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Desplaza una geometría en pantalla (en píxeles verticales) para evitar
     * que el popup cubra el punto cuando se centra la vista.
     * @param {Geometry} geometry - Geometría a desplazar.
     * @param {number} offsetY - Desplazamiento vertical en píxeles (negativo hacia arriba).
     * @returns {Point} - Nueva geometría desplazada en coordenadas de mapa.
     */
    export const desplazarTarget = (view,geometry, offsetY = 0) => {
      const screenPoint = view.toScreen(geometry);
      if (!screenPoint) return geometry; // fallback sin desplazamiento

      // Aplicar desplazamiento vertical en coordenadas de pantalla
      const movedScreenPoint = {
        x: screenPoint.x,
        y: screenPoint.y + offsetY,
      };

      // Convertir el punto desplazado de vuelta a coordenadas de mapa
      return view.toMap(movedScreenPoint) || geometry;
    };
/////////////////////////////////////////////////////////////////////////////////////////////
export const graficaDatos = (campaign, component, datosgrafica) => {
  const campaniaSeleccionada = datosgrafica.campanias[campaign];
  if (
    !campaniaSeleccionada ||
    !campaniaSeleccionada.componentes.includes(component)
  ) {
    return [];
  }
  const datosComponente = campaniaSeleccionada.datos[component.toLowerCase()];
  return datosComponente || [];
};
/////////////////////////////////////////////////////////////////////////////////////////
export const sacarPerfilCTD = ({ datos, component }) => {
  // 1) Normalizamos el nombre del componente
  const comp = (component || '').toLowerCase();
  console.log(comp);
  // console.log(datos);
  // 2) Creamos la instancia Crossfilter
  const cf = crossfilter(datos);

  // 3) Dimensión por hora exacta (la clave 'hora' viene tal cual en el dato)
  const horaDim = cf.dimension(d => d.hora);

  /* 4) Agrupamos usando un reduce custom que construye un array por hora.
         - reduceAdd   → se llama cuando un registro entra al grupo
         - reduceRemove→ se llama cuando se quita (por un filtro)
         - reduceInitial→ estado inicial del acumulador (array vacío)
  */
  const perfilesGroup = horaDim.group().reduce(
    // ---------- ADD ----------
    (acum, v) => {
      switch (comp) {
        case 'perfilctd':
          acum.push({
            profundidad: v.profundidad,
            temperatura: v.temperatura,
            salinidad:   v.salinidad,
          });
          break;
        case 'nivelmar':        // <–– mareógrafo
          acum.push({ altura: v.altura_significativa });
          break;
        
        case 'oleaje':        // <–– Oleaje
          acum.push({ 
            altura: v.altura_significativa,
            direccion: v.direccion, 
            periodo:v.periperiodo_picoodoOla

          });
          break;
        
        case 'corriente':        // <–– Oleaje
          acum.push({ 
            velocidad: v.velocidad,
            direccion: v.dereccion, //TODO Corregir direccion
            nivel:v.nivel,
            corrientex:v.ceste,
            corrientey:v.cnorte
          
          });
          break;
        
          default:
          // nada
      }
      return acum;
    },
    // ---------- REMOVE ----------
    (acum, v) => {
      // Buscamos y quitamos el mismo objeto que añadimos.
      // Podrías optimizar con índices, aquí usamos findIndex por claridad.
      let idx = -1;
      switch (comp) {
        case 'perfilctd':
          idx = acum.findIndex(
            o =>
              o.profundidad === v.profundidad &&
              o.temperatura === v.temperatura &&
              o.salinidad   === v.salinidad
          );
          break;

        case 'nivelmar':
          idx = acum.findIndex(o => o.altura === v.altura_significativa);
          break;

        case 'oleaje':
          // Solo agregar si el periodo es válido
          if (v.periperiodo_picoodoOla !== -9999 && !isNaN(v.periperiodo_picoodoOla)) {
            acum.push({
              altura: v.altura_significativa,
              direccion: v.direccion,
              periodo: v.periperiodo_picoodoOla,
            });
          }
          break;

        case 'corriente':
            idx = acum.findIndex(
              o => 
                o.velocidad === v.velocidad &&
                o.direccion === v.direccion &&
                o.nivel === v.nivel &&
                o.corrientex === v.ceste &&
                o.corrientey === v.cnorte
            );
          break;



      }
      if (idx !== -1) acum.splice(idx, 1);
      return acum;
    },
    // ---------- INITIAL ----------
    () => []
  );

  // 5) Pasamos el group a un objeto plano {hora: [...]}
  const perfilesPorHora = {};
  perfilesGroup.all().forEach(g => {
    // g.key → hora, g.value → array de objetos
    // Para perfilctd ordenamos por profundidad
    if (
      (comp === 'perfilctd' || comp === 'perfilcdt') &&
      g.value.length > 0 &&
      g.value[0].profundidad !== undefined
    ) {
      g.value.sort((a, b) => a.profundidad - b.profundidad);
    }
    perfilesPorHora[g.key] = g.value;
  });
  console.log(perfilesPorHora);
  // 6) Generamos la métrica (o cualquier salida que uses para Vega)
  const metrica = prepareVegaData(perfilesPorHora,comp);
  console.log(metrica);
  return metrica;
};


/////////////////////////////////////////////////////////////////////////////7

// Convertimos los datos antes de pasarlos al componente
/**
 * Convierte perfilesPorHora en un arreglo plano apto para Vega.
 *
 *  • Para PERFIL CTD produce dos registros por punto (Temperatura y Salinidad)
 *    con las claves: {hora, profundidad, tipo, valor}
 *
 *  • Para NIVELMAR produce un registro por punto con las claves:
 *    {hora, tipo: 'Altura', valor}
 */
function prepareVegaData(perfilesPorHora,comp) {
  const result = [];

  Object.entries(perfilesPorHora).forEach(([hora, puntos]) => {
    puntos.forEach(punto => {
      // Determinamos el tipo de punto según sus claves

      switch (comp) {
        case 'perfilctd':
          result.push({
            hora,
            profundidad: punto.profundidad,
            tipo: 'Temperatura',
            valor: punto.temperatura,
          });
          result.push({
            hora,
            profundidad: punto.profundidad,
            tipo: 'Salinidad',
            valor: punto.salinidad,
          });
          break;

        case 'nivelmar':
          result.push({
            hora,
            tipo: 'Altura',
            valor: punto.altura,
          });
          break;

          case 'oleaje':
          result.push({
            hora,
            tipo: 'Direccion',
            valor: punto.altura,
            direccion:punto.direccion,
            periodo:punto.periodo
          });
          break;

          case 'corriente':
          result.push({
            hora,
            tipo: 'Corriente',
            corriente: punto.velocidad,
            direccion:punto.direccion,
            nivel:punto.nivel,
            corrientex:punto.corrientex,
            corrientey:punto.corrientey
          });
          break;

        // Aquí puedes añadir más casos si tienes nuevos tipos en el futuro
        default:
          // No hacer nada si no se reconoce el tipo
          break;
      }
    });
  });

  return result;
}
////////////////////////////////////////////////////////////////////////////////
export function prepararCampanas(puertoSeleccionado, campanias) {
  // console.log(campanias);
  // console.log(puertoSeleccionado);
  // Crear instancia de crossfilter con las campañas
  const cf = crossfilter(campanias);

  // Crear dimensión basada en la descripción (en minúsculas para comparación robusta)
  const descripcionDim = cf.dimension(d => d.descripcion.toLowerCase());

  // Filtrar las campañas que contienen el nombre del puerto en la descripción
  descripcionDim.filter(desc => desc.includes(puertoSeleccionado.toLowerCase()));

  // Obtener todos los registros filtrados
  const filtrados = descripcionDim.top(Infinity);

  // Limpiar el filtro (opcional, si se reutiliza crossfilter)
  descripcionDim.filterAll();

  // Retornar solo los campos requeridos
  return filtrados.map(d => ({
    nombre: d.nombre,
    descripcion: d.descripcion,
    fecha: AHtiempo(d.fecha).formattedDate 
  }));
}
////////////////////////////////////////////////////////////////////////////////
export function prepararMCAlor(puertoSeleccionado, campaniaSeleccionada, profundidad, allestacionesd, tipoDato) {
  const estacionesAplanadas = allestacionesd.data.flatMap(est => {
    const camp = est.campanias?.[campaniaSeleccionada];
    if (!camp) return [];

    return [{
      id: est.id,
      nombre: est.nombre,
      localizacion: est.localizacion.coordinates,
      puerto: est.puerto.name,
      campaniaNombre: camp.nombre,
      fecha: camp.fecha,
      epoca: camp.epoca,
      perfilctd: camp.datos?.perfilctd || []
    }];
  });

  const cf = crossfilter(estacionesAplanadas);
  const byCampania = cf.dimension(d => d.campaniaNombre);
  byCampania.filter(campaniaSeleccionada);

  const result = byCampania.top(Infinity);

  // Extraemos todos los valores reales
  const valoresReales = result
    .map(est => est.perfilctd.find(p => p.profundidad === profundidad)?.[tipoDato])
    .filter(v => v !== undefined);

  const min = Math.min(...valoresReales);
  const max = Math.max(...valoresReales);

  // Evitar división por cero si todos los valores son iguales
  const valores = result
    .map(est => {
      const dato = est.perfilctd.find(p => p.profundidad === profundidad);
      if (dato?.[tipoDato] === undefined) return null;

      const valorOriginal = dato[tipoDato];
      const valorNormalizado = (max !== min) ? (valorOriginal - min) / (max - min) : 0.5; // Si todos iguales, fija en 0.5
      return {
        localizacion: est.localizacion,
        valorn: valorNormalizado,
        valor:valorOriginal
      };
    })
    .filter(Boolean);

  // console.log(valores);
  return {valores};
}/////////////////////////////////////////////////////////////////////////////
// Función que define los colorStops del heatmap
export const getColorTemperatura = () => [
  { ratio: 0, color: "rgba(0, 0, 0, 0)" },                    // transparente
  { ratio: 0.083, color: "rgba(0, 0, 255, 0.6)" },            // azul
  { ratio: 0.166, color: "rgba(0, 255, 255, 0.6)" },          // cian
  { ratio: 0.333, color: "rgba(0, 255, 0, 0.6)" },            // verde
  { ratio: 0.5, color: "rgba(255, 255, 0, 0.6)" },            // amarillo
  { ratio: 0.666, color: "rgba(255, 165, 0, 0.6)" },          // naranja
  { ratio: 0.833, color: "rgba(255, 0, 0, 0.6)" },            // rojo
  { ratio: 1, color:      "rgba(128, 0, 0, 0.6)" },                // rojo oscuro
];
/////////////////////////////////////////////////////////////////////////////

export const getColorSalinidad = () => [
  { ratio: 0, color: "rgba(0, 0, 0, 0)" },                    // transparente
  { ratio: 0.083, color: "rgba(0, 0, 255, 0.6)" },            // azul
  { ratio: 0.166, color: "rgba(0, 255, 255, 0.6)" },          // cian
  { ratio: 0.333, color: "rgba(0, 255, 0, 0.6)" },            // verde
  { ratio: 0.5, color: "rgba(255, 255, 0, 0.6)" },            // amarillo
  { ratio: 0.666, color: "rgba(255, 165, 0, 0.6)" },          // naranja
  { ratio: 0.833, color: "rgba(255, 0, 0, 0.6)" },            // rojo
  { ratio: 1, color: "rgba(128, 0, 0, 0.6)" },                // rojo oscuro
];
/////////////////////////////////////////////////////////////////////////////import * as turf from '@turf/turf';
export function krigin(datos, punto, modelo = 'gaussian', paramA = 0, paramB = 100) {
  
  if (!Array.isArray(datos) || datos.length === 0 || !Array.isArray(punto) || punto.length !== 2) {
    return null;
  }

  // console.log(paramA);
  const poligono = crearPoligonoConvexo(datos);
  if (!poligono) return null;

  const t = datos.map(d => d.valor);
  const x = datos.map(d => d.localizacion[0]);
  const y = datos.map(d => d.localizacion[1]);

  // Entrenar el modelo kriging
  const variogram = kriging.train(t, x, y, modelo, paramA, paramB);

  // Predecir valor en el punto dado
  const value = kriging.predict(punto[0], punto[1], variogram);

  // Comprobar si el punto está dentro del polígono convexo
  const puntoTurf = turf.point(punto);
  const dentroDelPoligono = turf.booleanPointInPolygon(puntoTurf, turf.polygon(poligono.geometry.coordinates));

  return dentroDelPoligono ? value : null;
}

/////////////////////////////////////////////////////////////////////////
export const crearPoligonoConvexo = (datos) => {
  const puntos = datos.map(d => turf.point(d.localizacion));
  const featureCollection = turf.featureCollection(puntos);
  const poligono = turf.convex(featureCollection);
  return poligono || null;
};
/////////////////////////////////////////////////////////////////////////
export const lienasdeCosta = ({ lineacosta, puerto }) => {
  if (!lineacosta || !puerto || !puerto.id) return [];

  const cf = crossfilter(lineacosta);
  const puertoDimension = cf.dimension(d => d.puerto_id);

  const resultados = puertoDimension.filterExact(puerto.id).top(Infinity);

  puertoDimension.dispose();

  return resultados.map(item => ({
    anio: item.anio,
    coordinates: item.geometry?.coordinates || []
  }));
};