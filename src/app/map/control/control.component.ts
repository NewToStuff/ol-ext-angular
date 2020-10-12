import { Component, Input, ElementRef, OnInit, Host, Optional } from '@angular/core';

import { MapService } from '../map.service';
import { MapidService } from '../mapid.service';
import OlMap from 'ol/Map';
import BookmarkCtrl from 'ol-ext/control/GeoBookmark';
import EditBar from 'ol-ext/control/EditBar';
import Tooltip from 'ol-ext/overlay/Tooltip';
import Popup from 'ol-ext/overlay/Popup';
import ol_layer_Vector from 'ol/layer/Vector';
import ol_source_Vector from 'ol/source/Vector';


/**
 * Add a control to the map
 * The control can be set inside the map (using parent id) or outside (using a mapId attribute)
 * @example
  <!-- Display a control inside a map -->
  <app-map>
    <app-control></app-control>
  </app-map>

  <!-- Display a control outside a map -->
  <app-control mapId="map"></app-control>
 */
@Component({
  selector: 'app-control',
  template: ''
})

export class ControlComponent implements OnInit {

  /** Map id
   */
  @Input() mapId: string;

  /** Define the service
   */
  constructor(
    private mapService: MapService,
    @Host()
    @Optional()
    private mapidService: MapidService,
    private elementRef: ElementRef
  ) { }

  /** Add the control to the map
   */
  ngOnInit() {
    // Get the current map or get map by id
    const map: OlMap = this.mapService.getMap(this.mapidService || this.mapId);
    // Get the target if outside the map
    const target = this.elementRef.nativeElement.parentElement ? this.elementRef.nativeElement : null;
    // Create the control
    const mark = new BookmarkCtrl({ target: target });
    map.addControl(mark);




    //  Vector layer
    var vector = new ol_layer_Vector( { source: new ol_source_Vector() })

  // Add the editbar
  var edit = new EditBar({ source: vector.getSource() });
  map.addControl(edit);

  // Add a tooltip
  var tooltip = new Tooltip();
  map.addOverlay(tooltip);

  edit.getInteraction('Select').on('select', function(e){
    if (this.getFeatures().getLength()) {
      tooltip.setInfo('Drag points on features to edit...');
    }
    else tooltip.setInfo();
  });
  edit.getInteraction('Select').on('change:active', function(e){
    tooltip.setInfo('');
  });
  edit.getInteraction('ModifySelect').on('modifystart', function(e){
    if (e.features.length===1) tooltip.setFeature(e.features[0]);
  });
  edit.getInteraction('ModifySelect').on('modifyend', function(e){
    tooltip.setFeature();
  });
  edit.getInteraction('DrawPoint').on('change:active', function(e){
    tooltip.setInfo(e.oldValue ? '' : 'Click map to place a point...');
  });
  edit.getInteraction('DrawLine').on(['change:active','drawend'], function(e){
    tooltip.setFeature();
    tooltip.setInfo(e.oldValue ? '' : 'Click map to start drawing line...');
  });
  edit.getInteraction('DrawLine').on('drawstart', function(e){
    tooltip.setFeature(e.feature);
    tooltip.setInfo('Click to continue drawing line...');
  });
  edit.getInteraction('DrawPolygon').on('drawstart', function(e){
    tooltip.setFeature(e.feature);
    tooltip.setInfo('Click to continue drawing shape...');
  });
  edit.getInteraction('DrawPolygon').on(['change:active','drawend'], function(e){
    tooltip.setFeature();
    tooltip.setInfo(e.oldValue ? '' : 'Click map to start drawing shape...');
  });
  edit.getInteraction('DrawHole').on('drawstart', function(e){
    tooltip.setFeature(e.feature);
    tooltip.setInfo('Click to continue drawing hole...');
  });
  edit.getInteraction('DrawHole').on(['change:active','drawend'], function(e){
    tooltip.setFeature();
    tooltip.setInfo(e.oldValue ? '' : 'Click polygon to start drawing hole...');
  });
  edit.getInteraction('DrawRegular').on('drawstart', function(e){
    tooltip.setFeature(e.feature);
    tooltip.setInfo('Move and click map to finish drawing...');
  });
  edit.getInteraction('DrawRegular').on(['change:active','drawend'], function(e){
    tooltip.setFeature();
    tooltip.setInfo(e.oldValue ? '' : 'Click map to start drawing shape...');
  });

  }
}
