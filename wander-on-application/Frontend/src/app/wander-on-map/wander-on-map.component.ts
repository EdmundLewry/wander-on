import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, NgZone, Output } from '@angular/core';
import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { Style, Stroke, Fill } from 'ol/style';
import { GPX, GeoJSON } from 'ol/format';
import Vector from 'ol/source/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';
import { fromLonLat } from 'ol/proj';
import Raster from 'ol/source/Raster';
import ImageLayer from 'ol/layer/Image';
import { DragAndDrop, defaults as defaultInteractions } from 'ol/interaction';
import { Geometry } from 'ol/geom';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-wander-on-map',
  templateUrl: './wander-on-map.component.html',
  styleUrls: ['./wander-on-map.component.css']
})
export class WanderOnMapComponent implements AfterViewInit {
  @Output() mapReady = new EventEmitter<Map | null>();
  
  private readonly attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
  
  private readonly key = "201kiHc1yfrCuvBeKrfe";
  
  private Map: Map | null = null;
  private gpxFormat : GPX;
  private gpxSource : Vector;
  private base : TileLayer<XYZ>;
  private pathStyle : Style;
  private gpxLayer : VectorImageLayer<Vector>;
  private raster : Raster;
  private fog : ImageLayer<Raster>;
  private fileDropInteraction : DragAndDrop;
  private geoJsonFormat : GeoJSON;

  constructor(private zone: NgZone, private cd: ChangeDetectorRef, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { 
    this.gpxFormat  = new GPX();
    this.geoJsonFormat = new GeoJSON();

    this.base = new TileLayer({
      source: new XYZ({
        url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + this.key,
        attributions: this.attributions,
        crossOrigin: 'anonymous',
        tileSize: 512,
      })
    });
    
    this.pathStyle = new Style({
      stroke: new Stroke({
        color: "#f00",
        width: 20,
      }),
      fill: new Fill({
        color: "#b7b7b7"
      })
    });

    this.gpxSource = new Vector({
      url: "./assets/empty.gpx",
      format: this.gpxFormat,
    });

    this.gpxLayer = new VectorImageLayer({
      source: this.gpxSource,
      style: this.pathStyle
    });

    this.raster = new Raster({
      sources: [this.base, this.gpxLayer],
      operation: function(pixels, data) {
        if(!(pixels as number[][]))
          return [183, 183, 183, 255];
  
          //TODO: to avoid use of Empty gpx, can I find a different condition for the pixel data?
        let pixelData = pixels as number[][];
        if(pixelData[1][3] === 0 || pixelData[1][3] === undefined) {
          return [183, 183, 183, 255];
        }
        return pixels[0];
      },
    });

    this.fog = new ImageLayer({
      source: this.raster
    });

    this.fileDropInteraction = new DragAndDrop({
      formatConstructors: [GPX]
    });
  }

  ngAfterViewInit(): void {
    if (!this.Map) {
      this.zone.runOutsideAngular(() => this.initialiseMap())
    }
    setTimeout(() => {
      this.mapReady.emit(this.Map);
      this.retrieveTravelData();
    });
  }

  private initialiseMap(): void {
    this.Map = new Map({
      interactions: defaultInteractions().extend([this.fileDropInteraction]),
      layers: [this.fog],
      target: 'map',
      view: new View({
        center: fromLonLat([-0.058898418, 51.406058646]),
        zoom: 16,
      }),
    });

    let gpx = this.gpxSource;
    let httpClient = this.http;
    let url = this.baseUrl + 'api/map';
    let geoJsonFormat = this.geoJsonFormat;
    this.fileDropInteraction.on('addfeatures', function (event) {
      console.log("Adding new features");
      gpx.addFeatures(event.features as Feature<Geometry>[]);
      httpClient.post(url, geoJsonFormat.writeFeaturesObject(gpx.getFeatures())).subscribe(
        result => { console.log(result); },
        error => { console.log(error); });
    });
  }

  private retrieveTravelData() {
    this.http.get<string>(this.baseUrl + 'api/map').subscribe(result => {
      if(result != null) {
        this.gpxSource.clear();
        let features : Feature<Geometry>[] = this.geoJsonFormat.readFeatures(result);
        this.gpxSource.addFeatures(features);
      }
    }, error => console.error(error));
  }

  public printFeatures() {
    // console.log("button clicked");
    // console.log(this.Map);

    let gpxFormat = this.gpxFormat;
    let geoJsonFormat = this.geoJsonFormat;

    console.log(geoJsonFormat.writeFeaturesObject(this.gpxSource.getFeatures()));
    // this.gpxSource.forEachFeature(function (feature) {
    //   console.log(gpxFormat.writeFeatures([feature]));
    //   //https://stackoverflow.com/questions/2601745/how-to-convert-vector-layer-coordinates-into-map-latitude-and-longitude-in-openl/2607145#2607145
    // });
  }
}