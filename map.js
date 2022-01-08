const background = new ol.layer.Tile({
  className: 'stamen',
  source: new ol.source.Stamen({
    layer: 'toner',
  }),
});

const base = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

const gpxLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: "./"
  });
});

const clipLayer = new ol.layer.Vector({
  style: null,
  source: new ol.source.Vector({
    url: 'data.json',
    format: new ol.format.GeoJSON(),
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
  const vectorContext = ol.render.getVectorContext(e);
  e.context.globalCompositeOperation = 'destination-in';
  clipLayer.getSource().forEachFeature(function (feature) {
    console.log(feature);
    vectorContext.drawFeature(feature, style);
  });
  e.context.globalCompositeOperation = 'source-over';
});

const map = new ol.Map({
  layers: [background, base],
  target: 'map',
  view: new ol.View({
    center: ol.proj.fromLonLat([-0.058898418,51.406058646]),
    // center: ol.proj.fromLonLat([8.23, 46.86]),
    // zoom: 7,
    zoom: 14,
  }),
});