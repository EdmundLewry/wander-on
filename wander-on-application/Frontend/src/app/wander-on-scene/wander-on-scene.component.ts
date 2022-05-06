import { Component, ViewChild } from '@angular/core';
import { WanderOnMapComponent } from '../wander-on-map/wander-on-map.component';

@Component({
  selector: 'app-wander-on-scene',
  templateUrl: './wander-on-scene.component.html',
  styleUrls: ['./wander-on-scene.component.css']
})
export class WanderOnSceneComponent {
  @ViewChild(WanderOnMapComponent) _map!: WanderOnMapComponent;
  public readonly profiles = ["Edmund", "Teddy"];
  public profile: string = this.profiles[0];

  public printFeatures() {
    this._map.printFeatures();
  }

  public addData(file: File) {
    file.text().then((data) => {
      this._map.addFeatureData(data);
    });
  }

  public switchProfile(profile: string) {
    this.profile = profile;
    this._map.onProfileChanged(profile);
  }
}
