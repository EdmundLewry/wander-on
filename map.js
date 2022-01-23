const base = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

const pathStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "#f00",
    width: 5,
  }),
  fill: new ol.style.Fill({
    color: "#b7b7b7"
  })
});

const gpxFormat = new ol.format.GPX({extractStyles: false});
const gpxSource = new ol.source.Vector({
  url: "./local-park.gpx",
  format: gpxFormat,
  //Is there a way that I can style everything except the features?
});

const gpxLayer = new ol.layer.Vector({
  source: gpxSource,
  style: pathStyle
});

const map = new ol.Map({
  layers: [gpxLayer],
  target: 'map',
  view: new ol.View({
    // center: ol.proj.fromLonLat([8.23, 46.86]),
    // zoom: 7,
    center: ol.proj.fromLonLat([-0.058898418,51.406058646]),
    zoom: 14,
  }),
});

const featureCheckOptions = {
  layerFilter: function(layer) {
    console.log(`Layer is ${layer}`);
    return layer === gpxLayer;
  }
};

function getGpxPixels() {
  let pixels = [];
  gpxSource.forEachFeature(function(feature) {
    let geom = feature.getGeometry();
    let coords = geom.getCoordinates();
    coords[0].forEach(function(coord){
      pixels.push(map.getPixelFromCoordinate(coord));
    });
  });

  return "pixels";
}

const raster = new ol.source.Raster({
  sources: [gpxSource],
  operation: function(pixels, data) {
    const pixel = pixels[0];

    // console.log(data.pixels);
    if(pixel[0] == 255 && pixel[1] == 0 && pixel[2] == 0 && pixel[4] == 255) {

      console.log(`Found pixel ${pixel}`);
      pixel[0] = 0;
      pixel[1] = 255;
      pixel[2] = 0;
      pixel[3] = 255;
    }

    pixel[0] = 183;
    pixel[1] = 183;
    pixel[2] = 183;
    pixel[3] = 255;
    //Is there a way I can check to see that a pixel is on the path?
    // let localMap = getMap();
    // let featurePresent = localMap.hasFeatureAtPixel(pixel, featureCheckOptions);
    //  console.log(`Feature Present: ${featurePresent}`);
    return pixel;
  },
});

raster.on('beforeoperations', function (event) {
  //Create a collection for each coordinate on the gpx layer and the pixel of that. Set this as data
  //Could recalculate on map drag
  // let gpxPixels = getGpxPixels();
  // event.data.pixels = gpxPixels;
  //This data disappears somehow...
});

const fog = new ol.layer.VectorImage({
  source: raster
});

map.addLayer(fog);