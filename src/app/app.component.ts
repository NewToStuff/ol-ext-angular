import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ol-ext-angular';
  geoObj = 'This is a test Geo Obj';

  onGeoSaved(geoJson){
    this.geoObj = geoJson;
  }
}
