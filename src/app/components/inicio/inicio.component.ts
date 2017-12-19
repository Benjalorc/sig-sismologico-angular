import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../../services/categorias/categorias.service'
import { CapasService } from '../../services/capas/capas.service'
import { FlashMessagesService } from 'angular2-flash-messages';
import * as L from 'leaflet';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {


  activeMap: any;
  geoJsons: any;

  baseMaps: any;
  overlayMaps: any;
  control: any;


  agregarDatosActivado: boolean;
  editarDatosActivado: boolean;
  eliminarDatosActivado: boolean;


  capas: any;
  categorias: any;


  constructor(
  			private flashMessage: FlashMessagesService,
  			private categoriasService: CategoriasService,
  			private capasService: CapasService) { }

  ngOnInit() {


	this.flashMessage.show('Bienvenido!', { cssClass: 'alert-success', timeout: 1000 });

    eval("window.yo = this");

  	this.agregarDatosActivado = false;
  	this.editarDatosActivado = false;
  	this.eliminarDatosActivado = false;

	this.categoriasService.obtener().subscribe(data =>{

		if(data.status == 200){			
			this.categorias = data.body;
			window.localStorage.categorias = JSON.stringify(this.categorias);
		}
		else{
		  	this.categorias = [];
		}
	},
		error => {
			console.log(error);
		}
	);

	this.categorias = [
		{
			codigo: "1",
			nombre: "Categoria 1",
			descripcion: "Descripcion 1",
			eliminable: false
		},
		{
			codigo: "2",
			nombre: "Categoria 2",
			descripcion: "Descripcion 2",
			eliminable: true
		},
		{
			codigo: "3",
			nombre: "Categoria 3",
			descripcion: "Descripcion 3",
			eliminable: false
		}
	]


	this.capasService.obtener().subscribe(data =>{

		if(data.status == 200){
			this.capas = data.body;

			console.log(this.capas);

			this.capas.forEach((element) =>{

				if(!element.categoria){
					element.categoria = {
						nombre: "N/A",
						id: ""
					}
				}

				element.geometria = element.tipo;

			});

			window.localStorage.capas = JSON.stringify(this.capas);
		}
		else{
		  	this.capas = [];
		}
	},
		error => {
			console.log(error);
		}
	);

	this.capas = [
		{
			categoria: "Categoria 1",
			nombre: "Capa 1",
			geometria: "PUNTO",
			coordenadas: [],
			eliminable: false,
			propiedades: 
			[
				{ 
				nombre: "nombre",
				tipo: "text"
				},				
				{ 
				nombre: "fundacion",
				tipo: "number"
				}
			]
		},
		{
			categoria: "Categoria 1",
			nombre: "Capa 2",
			geometria: "POLIGONO",
			coordenadas: [],
			eliminable: false,
			propiedades: 
			[
				{ 
				nombre: "nombre",
				tipo: "text"
				},				
				{ 
				nombre: "extension",
				tipo: "number"
				}
			]		},
		{
			categoria: "Categoria 2",
			nombre: "Capa 3",
			geometria: "LINEA",
			coordenadas: [],
			eliminable: false,
			propiedades: 
			[
				{ 
				nombre: "nombre",
				tipo: "text"
				},				
				{ 
				nombre: "largo",
				tipo: "number"
				}
			]		
		},
		{
			categoria: "Categoria 2",
			nombre: "Capa 4",
			geometria: "POLIGONO",
			coordenadas: [],
			eliminable: true,
			propiedades: 
			[
				{ 
				nombre: "nombre",
				tipo: "text"
				},				
				{ 
				nombre: "altura",
				tipo: "number"
				}
			]		
		},
		{
			categoria: "Categoria 3",
			nombre: "Capa 5",
			geometria: "PUNTO",
			coordenadas: [],
			eliminable: false,
			propiedades: 
			[
				{ 
				nombre: "nombre",
				tipo: "text"
				},				
				{ 
				nombre: "tipo",
				tipo: "text"
				}
			]		
		},
		{
			categoria: "Categoria 3",
			nombre: "Capa 6",
			geometria: "LINEA",
			coordenadas: [],
			eliminable: true,
			propiedades: 
			[
				{ 
				nombre: "nombre",
				tipo: "text"
				},				
				{
				nombre: "kilometros",
				tipo: "number"
				}
			]		
		}
	]


  	this.control = [];
  	this.baseMaps = {};
  	this.overlayMaps = {};
  	this.geoJsons = [];
	this.initDraw();
	eval("window.yo = this");
  	document.getElementById("montar").click();
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
		this.addPointToArr(ev.latlng.lng, ev.latlng.lat);		
	});


  }

  addPointToArr(lng, lat){

  	let tipo = "";
	let coordenadas = [];

  	if(window.localStorage.capaActiva){

	  	tipo = JSON.parse(window.localStorage.capaActiva).geometria;

	  	if(window.localStorage.coordenadas){

	  		coordenadas = JSON.parse(window.localStorage.coordenadas);

	  		switch(tipo){

	  			case "Point":
				  	coordenadas = [lng, lat];
			  		window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  			break;

	  			case "LineString":

		  			if(coordenadas.length < 1){

				  		coordenadas.push([lng, lat]);
		  			}
		  			else{

				  		coordenadas = [lng, lat];	  				
		  			}
		  			window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  			break;

	  			case "Polygon":

		  			if(coordenadas.length < 1){

				  		coordenadas.push([lng, lat]);
		  			}
		  			else{

				  		coordenadas = [lng, lat];	  				
		  			}
		  			window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  			break;
	  		}


	  	}
	  	else{
	  		coordenadas = [lng, lat];
	  		console.log(coordenadas);
	  		window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  	}

  	}
  	else{

  		return false;
  	}

  }

  cargarGeojson(geoJson){


  	try{
  		if(!this.verificarGeojsonExistente(geoJson)){
			this.addOverlayToControl(geoJson);
  		}
  		else{
  			console.log("Repetido");
  		}
  	}
  	catch(err){
  		console.log(err);
  	}
  }  

  cargarGeojsonFromLocal(){

  	let geoJson = JSON.parse(window.localStorage.capaNueva);

  	try{
  		if(!this.verificarGeojsonExistente(geoJson)){
			this.addOverlayToControl(geoJson);
  		}
  	}
  	catch(err){
  		console.log(err);
  	}
  }


  verificarGeojsonExistente(geoJson){

  	let match = false;

  	geoJson.features.forEach((element) =>{

  		let nuevo = element.name;

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

  agregarDatos(){
  	document.getElementById("montar").click();
  	this.agregarDatosActivado = true;
  }

  terminarAgregar(ev){

  	if(ev){
  		this.agregarDatosActivado = false;
  	}

  }

  editarDatos(){

  	document.getElementById("montar").click();
  	this.editarDatosActivado = true;
  }

  terminarEditar(ev){

  	if(ev){
  		this.editarDatosActivado = false;
  	}

  }

  eliminarDatos(){

  	document.getElementById("montar").click();
  	this.eliminarDatosActivado = true;
  }

  terminarEliminar(ev){

  	if(ev){
  		this.eliminarDatosActivado = false;
  	}

  }

}