const base = new ol.layer.Tile({
  source: new ol.source.OSM(),
});


const raster = new ol.source.Raster({
  sources: [base],
  operation: function(pixels, data) {
    const pixel = pixels[0];
    pixel[0] = 183;
    pixel[1] = 183;
    pixel[2] = 183;
    pixel[3] = 255;

    return pixel;
  }
});

const fog = new ol.layer.Image({
  source: raster
});

const pathStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "#f00",
    width: 5
  })
});

const gpxLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: "./local-park.gpx",
    format: new ol.format.GPX(),
  }),
  style: function(feature) {
    return pathStyle;
  }
});

const clipLayer = new ol.layer.Vector({
  style: null,
  source: new ol.source.Vector({
    // url: 'data.json',
    // format: new ol.format.GeoJSON(),
    url: "./local-park.gpx",
    format: new ol.format.GPX(),
  }),
});

//Giving the clipped layer an extent is necessary to avoid rendering when the feature is outside the viewport
clipLayer.getSource().on('addfeature', function () {
  base.setExtent(clipLayer.getSource().getExtent());
});

const style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'black',
  }),
});

base.on('postrender', function (e) {
  var i = 0;
  const vectorContext = ol.render.getVectorContext(e);
  e.context.globalCompositeOperation = 'destination-in';
  clipLayer.getSource().forEachFeature(function (feature) {
    console.log(++i);
    console.log(feature.A);
    vectorContext.drawFeature(feature, style);
  });
  e.context.globalCompositeOperation = 'source-over';
});

const map = new ol.Map({
  layers: [base, clipLayer, gpxLayer],
  target: 'map',
  view: new ol.View({
    // center: ol.proj.fromLonLat([8.23, 46.86]),
    // zoom: 7,
    center: ol.proj.fromLonLat([-0.058898418,51.406058646]),
    zoom: 14,
  }),
});