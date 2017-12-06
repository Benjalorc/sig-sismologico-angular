import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor() { }


  activeMap: any;

  ngOnInit() {

	this.initDraw()
  }


  initDraw(){


	let osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';

	const base = L.tileLayer(osmUrl, {
	    attribution: 'CSUDO',
	    maxZoom: 18
	});

	this.activeMap = L.map('mapid', {
		center: [10.645556, -63.038889],
		zoom: 8,
		layers: [base]
	});

	var baseMaps = {
	    "Base": base
	};

	var overlayMaps = {

	};

	L.control.layers(baseMaps, overlayMaps).addTo(this.activeMap);


  }

}
