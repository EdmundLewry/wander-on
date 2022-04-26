import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WanderOnMapComponent } from '../wander-on-map/wander-on-map.component';

@Component({
  selector: 'app-wander-on-scene',
  templateUrl: './wander-on-scene.component.html',
  styleUrls: ['./wander-on-scene.component.css']
})
export class WanderOnSceneComponent implements OnInit {
  @ViewChild(WanderOnMapComponent) _map!: WanderOnMapComponent;
  
  constructor() { }

  ngOnInit(): void {
  }

  public printFeatures() {
    this._map.printFeatures();
  }

}
