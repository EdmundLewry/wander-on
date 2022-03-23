import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Style, Stroke, Fill} from 'ol/style';
import {GPX, GeoJSON} from 'ol/format';
import Vector from 'ol/source/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';
import { fromLonLat } from 'ol/proj';
import Raster from 'ol/source/Raster';
import ImageLayer from 'ol/layer/Image';
import { DragAndDrop, defaults as defaultInteractions } from 'ol/interaction';

const base = new TileLayer({
  source: new OSM(),
});

const pathStyle = new Style({
  stroke: new Stroke({
    color: "#f00",
    width: 20,
  }),
  fill: new Fill({
    color: "#b7b7b7"
  })
});

const gpxFormat = new GPX({extractStyles: false});
const gpxSource = new Vector({
  url: "../data/local-park.gpx",
  format: gpxFormat,
});

const gpxLayer = new VectorImageLayer({
  source: gpxSource,
  style: pathStyle
});


const raster = new Raster({
  sources: [base, gpxLayer],
  operation: function(pixels, data) {
    
    if(pixels[1][3] === 0) {
      return [183, 183, 183, 255];
    }
    return pixels[0];
  },
});

const fog = new ImageLayer({
  source: raster
});

const fileDropInteraction = new DragAndDrop({
  formatConstructors: [GPX]
});

fileDropInteraction.on('addfeatures', function (event) {
  console.log("Adding new features");
  gpxSource.addFeatures(event.features);
});

const map = new Map({
  interactions: defaultInteractions().extend([fileDropInteraction]),
  layers: [fog],
  target: 'map',
  view: new View({
    center: fromLonLat([-0.058898418,51.406058646]),
    zoom: 16,
  }),
});

const geoJsonFormat = new GeoJSON({extractStyles: false});
var button = document.getElementById("button");
button.onclick = function () {
  console.log("button clicked");
  gpxSource.forEachFeature( function(feature) {
    console.log(gpxFormat.writeFeatures([feature]));
    // console.log(geoJsonFormat.writeFeature(feature));
    //https://stackoverflow.com/questions/2601745/how-to-convert-vector-layer-coordinates-into-map-latitude-and-longitude-in-openl/2607145#2607145
  });
}