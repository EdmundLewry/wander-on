import { AfterViewInit, Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
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
import { Geometry, MultiLineString } from 'ol/geom';
import { WanderDataService } from '../wander-data-service/wander-data.service';

@Component({
  selector: 'app-wander-on-map',
  templateUrl: './wander-on-map.component.html',
  styleUrls: ['./wander-on-map.component.css']
})
export class WanderOnMapComponent implements AfterViewInit {
  @Output() mapReady = new EventEmitter<Map | null>();
  @Input() profile: string = "";

  private readonly attributions =
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

  private readonly key = "201kiHc1yfrCuvBeKrfe";

  private Map: Map | null = null;
  private gpxFormat: GPX;
  private gpxSource: Vector;
  private base: TileLayer<XYZ>;
  private pathStyle: Style;
  private gpxLayer: VectorImageLayer<Vector>;
  private raster: Raster;
  private fog: ImageLayer<Raster>;
  private fileDropInteraction: DragAndDrop;
  private geoJsonFormat: GeoJSON;

  constructor(
    private zone: NgZone, 
    private dataService: WanderDataService,
    ) {
    this.gpxFormat = new GPX();
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
      sources: [this.gpxLayer],
      operation: function (images, _data) {
        const gpx = images[0] as ImageData;
        const width = gpx.width;
        const height = gpx.height;
        const shadeData = new Uint8ClampedArray(width * height * 4);
        const maxX = width - 1;
        const maxY = height - 1;
        const fogColour = [183, 183, 183, 255];
        const base = [0,0,0,0];

        let pixelX, pixelY, offset;

        function distanceToNearestEmpty(imageData: ImageData, x: number, y: number): number {
          let pixelOffset = (y * imageData.width + x) * 4;
          let alphaPixel = pixelOffset + 3;

          if (imageData.data[alphaPixel] === 0 || imageData.data[alphaPixel] === undefined)
            return 0;

          return 1;
        }

        for (pixelY = 0; pixelY <= maxY; ++pixelY) {
          for (pixelX = 0; pixelX <= maxX; ++pixelX) {
            offset = (pixelY * width + pixelX) * 4;
            let proximity = distanceToNearestEmpty(gpx, pixelX, pixelY);
            shadeData[offset] = fogColour[0] - ((fogColour[0] - base[0]) * proximity)
            shadeData[offset + 1] = fogColour[1] - ((fogColour[1] - base[1]) * proximity)
            shadeData[offset + 2] = fogColour[2] - ((fogColour[2] - base[2]) * proximity)
            shadeData[offset + 3] = fogColour[3] - ((fogColour[3] - base[3]) * proximity)
          }
        }
        return { data: shadeData, width: width, height: height };
      },
      operationType: 'image'
    });

    this.fog = new ImageLayer({
      source: this.raster,
      opacity: 0.95
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
      layers: [this.base, this.fog],
      target: 'map',
      view: new View({
        center: fromLonLat([-0.058898418, 51.406058646]),
        zoom: 16,
      }),
    });

    let gpx = this.gpxSource;
    let dataService = this.dataService;
    let geoJsonFormat = this.geoJsonFormat;
    let profile = this.profile;
    this.fileDropInteraction.on('addfeatures', function (event) {
      console.log("Adding new features");
      gpx.addFeatures(event.features as Feature<Geometry>[]);
      if(profile!="")
        dataService.saveWanderData(profile, geoJsonFormat.writeFeaturesObject(gpx.getFeatures()));
    });
  }

  private retrieveTravelData() {
    if(this.profile=="")
      return;

    this.dataService.getWanderData(this.profile).subscribe(result => {
      this.gpxSource.clear();
      if (result != null) {
        let features: Feature<Geometry>[] = this.geoJsonFormat.readFeatures(result);
        this.gpxSource.addFeatures(features);
      }
      else
      {
        var emptyFeature = new Feature({
          geometry: new MultiLineString([
              [
                [-6587,6693418,0,1640995200]
              ]
            ]
          ),
          name: 'Empty Feature'
        });
        
        this.gpxSource.addFeature(emptyFeature);
      }

    }, error => console.error(error));
  }

  public printFeatures() {
    console.log(this.geoJsonFormat.writeFeaturesObject(this.gpxSource.getFeatures()));
    // this.gpxSource.forEachFeature(function (feature) {
    //   console.log(gpxFormat.writeFeatures([feature]));
    //   //https://stackoverflow.com/questions/2601745/how-to-convert-vector-layer-coordinates-into-map-latitude-and-longitude-in-openl/2607145#2607145
    // });
  }

  public addFeatureData(data: string) {
    let features: Feature<Geometry>[] = this.gpxFormat.readFeatures(data, { featureProjection: 'EPSG:3857' });
    this.gpxSource.addFeatures(features);

    if(this.profile != "")
      this.dataService.saveWanderData(this.profile, this.geoJsonFormat.writeFeaturesObject(this.gpxSource.getFeatures()));
  }

  public onProfileChanged(profile: string) {
    this.profile = profile;
    this.retrieveTravelData();
  }
}
