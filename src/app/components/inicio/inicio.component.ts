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
  capas: any;
  geoJsons: any;

  baseMaps: any;
  overlayMaps: any;
  control: any;

  ngOnInit() {

  	this.control = [];
  	this.baseMaps = {};
  	this.overlayMaps = {};
  	this.geoJsons = [];
  	this.capas = [];
	this.initDraw();
	eval("window.yo = this");
  }


  initDraw(){


	let osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	let cartoUrl='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'

	const osm = L.tileLayer(osmUrl, {
	    attribution: 'Open Street Maps | CSUDO'
	});

	const carto = L.tileLayer(cartoUrl, {
	    attribution: 'Carto Tiles | CSUDO'
	});

	this.activeMap = L.map('mapid', {
		center: [10.456389, -64.1675],
		zoom: 11,
		layers: [osm]
	});

	this.baseMaps = {
	    "OSM": osm,
	    "Carto": carto
	};

	this.overlayMaps = {

	};

	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
	
	this.activeMap.on("click", (ev) =>{
		console.log(ev.latlng);
	});


  }

  cargarGeojson(data){

  	let fr = new FileReader();

  	fr.addEventListener("load", (e)=>{

		let geoJson = JSON.parse(e.target["result"]);

  		try{
  			if(!this.verificarGeojsonExistente(geoJson)){
  			  	this.addOverlayToControl(geoJson);
  			}
  		}
  		catch(err){
  			console.log(err);
  		}

  	}, false);

  	console.log(data.files);
  	fr.readAsText(data.files[0]);
  }


  verificarGeojsonExistente(geoJson){

  	let match = false;

  	geoJson.features.forEach((element) =>{

  		let nuevo = element.properties.name;

  		this.geoJsons.forEach((element) =>{

  			if(element.features.find((element) =>{return element.properties.name == nuevo})){
  				match = true;
  			}

  		});

  	});
  	return match;
  }

  addOverlayToControl(geoJson){

	switch(geoJson.features[0].geometry.type){

		case 'Polygon':

			let polygonStyle = function(){
			  return { 
			    fillColor: '#bdd7e7',
			    weight: 2,
			    opacity: 1,
			    color: 'white',
			    dashArray: '3',
			    fillOpacity: 0.7
			  }
			}

			this.addPolygonLayerToControl(geoJson, polygonStyle);

		break;

		case 'LineString':

			let lineStyle = function(){
				return {
				    "color": '#08519c',
				    "weight": 5,
				    "opacity": 0.65
				}
			}

			this.addLineLayerToControl(geoJson, lineStyle);

		break;

		case 'Point':


			let circleStyle = function(){

				return {
				    radius: 8,
				    fillColor: "#ff7800",
				    color: "#000",
				    weight: 1,
				    opacity: 1,
				    fillOpacity: 0.8
				}

			}

			this.addPointLayerToControl(geoJson, circleStyle)

		break;

		default:
			
			console.log("Desconocido");

		break;
	} //FIN DEL SWTICH


  }

  addPolygonLayerToControl(geoJson, estilo){

	let popup = function(feature, layer){
		layer.bindPopup(feature.properties.name);
	}

	let myLayer = L.geoJSON(geoJson, {style: estilo, onEachFeature: popup}).addTo(this.activeMap);

	let nombre = (Object.getOwnPropertyNames(this.overlayMaps).length)+1;

	this.overlayMaps[""+nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);


	this.geoJsons.push(geoJson);
  }

  addLineLayerToControl(geoJson, estilo){

	let popup = function(feature, layer){
		layer.bindPopup(feature.properties.name);
	}

	let myLayer = L.geoJSON(geoJson, {style: estilo, onEachFeature: popup}).addTo(this.activeMap);

	let nombre = (Object.getOwnPropertyNames(this.overlayMaps).length)+1;

	this.overlayMaps[""+nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);

	this.geoJsons.push(geoJson);
  }

  addPointLayerToControl(geoJson, estilo){

	let popup = function(feature, layer){
		layer.bindPopup(feature.properties.name);
	}

	let myLayer = L.geoJSON(geoJson, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, estilo);
	    },		
	    onEachFeature: popup}).addTo(this.activeMap);

	let nombre = (Object.getOwnPropertyNames(this.overlayMaps).length)+1;

	this.overlayMaps[""+nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);

	this.geoJsons.push(geoJson);
  }

}