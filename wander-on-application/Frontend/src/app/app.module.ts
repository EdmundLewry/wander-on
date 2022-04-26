import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { WanderOnMapComponent } from './wander-on-map/wander-on-map.component';
import { WanderOnSceneComponent } from './wander-on-scene/wander-on-scene.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    WanderOnMapComponent,
    WanderOnSceneComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: WanderOnSceneComponent, pathMatch: 'full' },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
