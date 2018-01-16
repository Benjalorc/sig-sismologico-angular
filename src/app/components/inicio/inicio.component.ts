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


  loading: boolean;

  geojsonEditable: any;
  geojsonVertices: any;
  geojsonCamino: any;
  geojsonFigura: any;
  puntosEnEdicion: any;
  verticesEnEdicion: any;
  caminoEnEdicion: any;
  figuraEnEdicion: any;

  moviendoVertice: boolean;
  verticeEnMovimiento: any;
  caminoCerrado: boolean;

  popupOpened: boolean;
  insertandoVertice: boolean;

  capasActivas: any;
  categoriaActiva: any;

  capaShapefile: any;

  layerToFilter: string;
  attributesToFilter: any;
  atributoFiltrado: string;
  atributoElegido: any;
  filtroElegido: any;

  valorBusqueda: string;

  constructor(

  			private flashMessage: FlashMessagesService,
  			private categoriasService: CategoriasService,
  			private capasService: CapasService) { }

  ngOnInit() {

  	this.categoriaActiva = "";

  	this.layerToFilter = "";
  	this.attributesToFilter = [];
  	this.atributoFiltrado = "";
  	this.atributoElegido = {
  		"nombre": "",
  		"tipo": ""
  	};

  	this.valorBusqueda = "";
  	this.filtroElegido = "";

  	this.capasActivas = [];

  	this.insertandoVertice = false;

  	this.caminoCerrado = false;

  	this.popupOpened = false;

  	this.control = [];
  	this.baseMaps = {};
  	this.overlayMaps = {};
  	this.geoJsons = [];

  	this.geojsonEditable = {
	  "type": "Feature",
	  "geometry": {
	    "type": "",
	    "coordinates": []
	  },
	  "properties": {
	  }
	}  	

	this.geojsonVertices = {
	  "type": "FeatureCollection",
	  "features": []
	}  	

	this.geojsonCamino = {
	  "type": "FeatureCollection",
	  "features": []
	}	

	this.geojsonFigura = {
	  "type": "Feature",
	  "geometry": {
	    "type": "Polygon",
	    "coordinates": []
	  },
	  "properties": {
	  }
	}

	if(window.localStorage.capaActiva){
		window.localStorage.removeItem("capaActiva");
	}
	if(window.localStorage.coordenadas){
		window.localStorage.removeItem("coordenadas");
	}

  	this.loading = false;

	this.flashMessage.show('Bienvenido!', { cssClass: 'alert-success', timeout: 1000 });

    eval("window.yo = this");

  	this.agregarDatosActivado = false;
  	this.editarDatosActivado = false;
  	this.eliminarDatosActivado = false;

  	this.loading = true;
	this.categoriasService.obtener().subscribe(data =>{
  	this.loading = false;

		if(data.status == 200){			
			this.categorias = data.body;
			window.localStorage.categorias = JSON.stringify(this.categorias);
		}
		else{
		  	this.categorias = [];
		}
	},
		error => {
	  		
	  		this.loading = false;
			console.log(error);
		}
	);


  	this.loading = true;
	this.capasService.obtener().subscribe(data =>{
  	this.loading = false;

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

		  	this.loading = false;
			console.log(error);
		}
	);



	this.initDraw();
  	document.getElementById("montar").click();


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

		if(!this.insertandoVertice){

			if(!this.popupOpened && !this.moviendoVertice){

				if(!this.caminoCerrado){

					if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
					if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
				}
				this.addPointToArr(ev.latlng.lng, ev.latlng.lat);
			}
			if(this.moviendoVertice){
				this.moverVertice(ev.latlng, 2);
			}
		}

	});

	this.activeMap.on("popupopen", (ev) =>{

		this.popupOpened = true;
	});	

	this.activeMap.on("popupclose", (ev) =>{

		this.popupOpened = false;
	});

	this.activeMap.scrollWheelZoom.disable()
	
	let este = this;


	window.addEventListener("keydown", function(e){

		if(e.keyCode == 16){
			este.activeMap.scrollWheelZoom.enable()
		}

	});

	window.addEventListener("keyup", function(e){

		if(e.keyCode == 16){
			este.activeMap.scrollWheelZoom.disable()
		}

	});

  }

  estiloEdicion(){

  	let estilo = "";

  	let coordenadas = JSON.parse(window.localStorage.coordenadas);

  	
  	if(coordenadas.length > 1){

  		if((coordenadas[0][0] == coordenadas[0][1])&&(coordenadas[coordenadas.length-1][0] == coordenadas[coordenadas.length-1][1])){
  			estilo = "Polygon";
  		}
  		else{
  			estilo = "LineString";
  		}
  	}
	else{
  		estilo = "Point";
  	}

  	if(estilo == "Point"){
  	
		return {
			radius: 8,
			fillColor: "#ff7800",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		}
  	}
  	else if(estilo == "LineString"){
  	
		return {
			"color": '#08519c',
			"weight": 5,
			"opacity": 0.65
		}  	
	}
  	else if(estilo == "Polygon"){

		return { 
			fillColor: '#bdd7e7',
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		}
  	}

  }

  addPointToArr(lng, lat){

  	let tipo = "";
	let coordenadas = [];

  	if(window.localStorage.capaActiva){

  		let capa = JSON.parse(window.localStorage.capaActiva);
  		this.geojsonEditable.geometry.type = capa.geometria;

	  	tipo = JSON.parse(window.localStorage.capaActiva).geometria;

	  	if(window.localStorage.coordenadas){

	  		coordenadas = JSON.parse(window.localStorage.coordenadas);

			let init = this;

	  		switch(tipo){

	  			case "Point":
				  	
				  	coordenadas = [lng, lat];
			  		window.localStorage.coordenadas = JSON.stringify(coordenadas);
					
			  		this.geojsonEditable.geometry.coordinates = coordenadas;

					if(this.puntosEnEdicion){
						this.activeMap.removeLayer(this.puntosEnEdicion);
					}

					this.puntosEnEdicion = L.geoJSON(this.geojsonEditable, {
			
						pointToLayer: function (feature, latlng) {
				        	return L.circleMarker(latlng, init.estiloEdicion);
				    	}}).addTo(this.activeMap);

	  			break;

	  			case "LineString":

			  		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
			  		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

					coordenadas.push([lng, lat]);

				    if(coordenadas.length>1){
				    	this.levantarCamino(coordenadas);
				    }

				    this.levantarVertices(tipo, coordenadas);

		  			window.localStorage.coordenadas = JSON.stringify(coordenadas);

	  			break;

	  			case "Polygon":

	  				if(!this.caminoCerrado){

				  		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
				  		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);


						coordenadas[0].push([lng, lat]);

					    if(coordenadas[0].length>1){
					    	this.levantarCamino(coordenadas[0]);
					    }

					    this.levantarVertices(tipo, coordenadas);

			  			window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  				}

	  			break;
	  		}


	  	}
	  	else{

	  		console.log("No habia coordenadas");
	  		coordenadas = [lng, lat];
	  		console.log(coordenadas);
	  		window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  	}

  	}
  	else{

  		console.log("No hay capa activa");
  		return false;
  	}

  }

  levantarCamino(coordenadas){

	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);

	this.geojsonCamino.features = [];

	console.log(coordenadas);
  	for(let i = 0, j = coordenadas.length; i<j-1; i++){

		let camino = {
			"type": "Feature",
			"geometry": {
				"type": "LineString",
				"coordinates": [coordenadas[i], coordenadas[i+1]]
			},
			"properties": {}
		}

		this.geojsonCamino.features.push(camino);
  	}

		this.caminoEnEdicion = L.geoJSON(this.geojsonCamino, {style: {
			"color": '#FFFF00',
			"weight": 5,
			"opacity": 0.65
			}
		}).addTo(this.activeMap);

		let init = this;

		this.caminoEnEdicion.eachLayer((layer) =>{ 
								
			
			layer.on("preclick", (ev)=>{
				
				init.insertandoVertice = true;
				init.insertarVertice(ev);
			});

		});



  }

  insertarVertice(evento){

  	console.log("insertandoVertice");

  	let tipo = JSON.parse(window.localStorage.capaActiva).tipo;
  	let origen = evento.target.feature.geometry.coordinates[0];
  	let destino = [evento.latlng.lng, evento.latlng.lat]
  	let coordenadas = JSON.parse(window.localStorage.coordenadas);
  	let coords;
  	let punto;
  	let coordenadasNuevas = [];

  	console.log(coordenadas);
  	console.log(tipo);

  	this.activeMap.removeLayer(this.caminoEnEdicion);
  	this.activeMap.removeLayer(this.verticesEnEdicion);

  	if(tipo == "LineString"){
		
		coords = coordenadas;
		punto = coords.findIndex((element) =>{return (element[0] == origen[0])&&(element[1] == origen[1])});

	  	for(let i = 0, j = coords.length; i<j; i++){

	  		if(i == punto+1){
	  			coordenadasNuevas.push(destino);
	  		}
	  			coordenadasNuevas.push(coords[i]);  			
	  	}

		coordenadas = coordenadasNuevas;
		this.levantarCamino(coordenadas);
		this.levantarVertices(tipo, coordenadas);
  	}

  	if(tipo == "Polygon"){

		coords = coordenadas[0];
		console.log("Poligono");
		console.log(coords);
		punto = coords.findIndex((element) =>{return (element[0] == origen[0])&&(element[1] == origen[1])});

	  	for(let i = 0, j = coords.length; i<j; i++){

	  		if(i == punto+1){
	  			coordenadasNuevas.push(destino);
	  		}
	  			coordenadasNuevas.push(coords[i]);
	  			console.log(coordenadasNuevas);
	  	}

		coordenadas = [coordenadasNuevas];
		this.levantarCamino(coordenadas[0]);
		this.levantarVertices(tipo, coordenadas);
  	}



  	window.localStorage.coordenadas = JSON.stringify(coordenadas);

  	let init = this;
  	setTimeout(()=> {init.insertandoVertice = false;}, 500);
  }

  levantarVertices(tipo, coordenadas){


  	let init = this;
  	let coords;

  	if(tipo == "LineString"){coords = coordenadas}
  	if(tipo == "Polygon"){coords = coordenadas[0]}

	console.log("añadiendo normalito");

	this.geojsonVertices.features = [];
	  		
	console.log(coordenadas);
	console.log(coords);
	
	coords.forEach((element) =>{

		let vertice = {
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": element
			},
			"properties": {}
		}

		this.geojsonVertices.features.push(vertice);
	});
	



	this.verticesEnEdicion = L.geoJSON(this.geojsonVertices, {
			
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 6,
					fillColor: "#FF0000",
					color: "#FFFF00",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.6 });
			}}).addTo(this.activeMap);

	let i = 0;

	this.verticesEnEdicion.eachLayer((layer) =>{ 
							
		i++;

		layer.on("preclick", (ev)=>{
			this.popupOpened = true;
		});

		let div = document.createElement("div");

		let buttonMove = document.createElement("button");
		buttonMove.setAttribute("class","btn btn-outline-warning");
		buttonMove.innerHTML='<i class="fa fa-crosshairs" aria-hidden="true"></i>'
		buttonMove.addEventListener("click", function(){
			window.localStorage.geometria = tipo;
			init.moverVertice(layer._latlng, 1);
		}, false);


		let buttonDelete = document.createElement("button");
		buttonDelete.setAttribute("class","btn btn-outline-danger");
		buttonDelete.innerHTML='<i class="fa fa-close" aria-hidden="true"></i>'
		buttonDelete.addEventListener("click", function(){
			init.quitarVertice(layer._latlng, tipo);
		}, false);


		div.appendChild(buttonMove);
		div.appendChild(buttonDelete);

		if(tipo == "Polygon" && coordenadas[0].length > 2 && !this.caminoCerrado){

			if( (i == 1 ) || (i == coordenadas[0].length)){
				let buttonClose = document.createElement("button");
				buttonClose.setAttribute("class","btn btn-outline-success");
				buttonClose.innerHTML='<i class="fa fa-lock" aria-hidden="true"></i>'
				buttonClose.addEventListener("click", function(){
					init.cerrarCamino(coordenadas);
				}, false);
				div.appendChild(buttonClose);
			}
			else{
				console.log("NO MATCH");
			}

		}
		
		if(i == 1 && !this.caminoCerrado && ( (tipo == "LineString" && coordenadas.length>1) || (tipo == "Polygon" && coordenadas[0].length>1) ) ){
			let buttonSetHead = document.createElement("button");
			buttonSetHead.setAttribute("class","btn btn-outline-primary");
			buttonSetHead.innerHTML='<i class="fa fa-flag" aria-hidden="true"></i>'
			buttonSetHead.addEventListener("click", function(){
				init.cambiarCabeza(tipo, coordenadas);
			}, false);
			div.appendChild(buttonSetHead);			
		}
		
		layer.bindPopup(div);

	});

  }

  cambiarCabeza(tipo, coordenadas){

  	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
  	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

  	let coordenadasNuevas = [];

  	if(tipo == "LineString"){

  		for(let i = 1, j = coordenadas.length; i<=j; i++){
  			coordenadasNuevas.push(coordenadas[j-i]);
  		}

		this.levantarCamino(coordenadasNuevas);
  	}
  	if(tipo == "Polygon"){

  		coordenadasNuevas.push([]);
  		for(let i = coordenadas[0].length-1; i>=0; i--){
  			coordenadasNuevas[0].push(coordenadas[0][i]);
  		}


		for(let i = 0, j = this.geojsonVertices.features.length; i<j; i++){
			
			console.log(this.geojsonVertices.features[i].geometry.coordinates);
			console.log(coordenadasNuevas[0][i]);

			this.geojsonVertices.features[i].geometry.coordinates = coordenadasNuevas[0][i];
		}

		this.levantarCamino(coordenadasNuevas[0]);
  	}
	window.localStorage.coordenadas = JSON.stringify(coordenadasNuevas);

	this.levantarVertices(tipo, coordenadasNuevas);
  }


  moverVertice(punto, stage){

  	if(stage === 1){

	  	this.activeMap.closePopup();

	  	if(this.verticeEnMovimiento){
	  		this.activeMap.removeLayer(this.verticeEnMovimiento);
	  	}

	  	this.moviendoVertice = true;

	  	window.localStorage.verticeNuevo = JSON.stringify(punto);

		this.verticeEnMovimiento = L.circleMarker(punto, {
			radius: 6,
			fillColor: "#819FF7",
			color: "#00FF00",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.4 
		}).addTo(this.activeMap);
	}
  	if(stage === 2){

  		let init = this;

  		this.activeMap.removeLayer(this.verticeEnMovimiento);

		this.verticeEnMovimiento = L.circleMarker(punto, {
			radius: 6,
			fillColor: "#819FF7",
			color: "#00FF00",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.4 
		}).addTo(this.activeMap);

		let boton = document.createElement("button");
		boton.setAttribute("class","btn btn-outline-success")
		boton.innerHTML='<i class="fa fa-crosshairs" aria-hidden="true"></i>'		
		boton.addEventListener("click", function(ev){

			init.moverVertice(punto, 3);
		}, false);

		let boton2 = document.createElement("button");
		boton2.setAttribute("class","btn btn-outline-danger")
		boton2.innerHTML='<i class="fa fa-close" aria-hidden="true"></i>'		
		boton2.addEventListener("click", function(ev){

	  		init.activeMap.removeLayer(init.verticeEnMovimiento);
		  	init.moviendoVertice = false;
		}, false);

		let div = document.createElement("div");
		div.appendChild(boton);
		div.appendChild(boton2);
		this.verticeEnMovimiento.bindPopup(div);

  	}
  	if(stage === 3){

  		let geometria = window.localStorage.geometria;

	  	this.moviendoVertice = false;

  		let origen = JSON.parse(window.localStorage.verticeNuevo);
  		let coordenadas = JSON.parse(window.localStorage.coordenadas);

  		this.activeMap.removeLayer(this.verticeEnMovimiento);

  		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
  		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

	  		this.geojsonVertices.features.forEach((element) =>{

	  			if(element.geometry.coordinates[0] == origen.lng && element.geometry.coordinates[1] == origen.lat){

	  				element.geometry.coordinates[0] = punto.lng;
	  				element.geometry.coordinates[1] = punto.lat;
	  			}
	  		});

  		if(geometria == "LineString"){
			
	  		
	  		coordenadas.forEach((element) =>{

	  			if(element[0] == origen.lng && element[1] == origen.lat){
					element[0] = punto.lng;
					element[1] = punto.lat;
	  			}
	  		});

	  		console.log(coordenadas);
	  		this.levantarCamino(coordenadas);
	  		this.levantarVertices("LineString", coordenadas);
  		}

  		if(geometria == "Polygon"){

	  		
	  		coordenadas[0].forEach((element) =>{

	  			if(element[0] == origen.lng && element[1] == origen.lat){
					element[0] = punto.lng;
					element[1] = punto.lat;
	  			}
	  		});

	  		this.levantarCamino(coordenadas[0]);
	  		this.levantarVertices("Polygon", coordenadas);

	  		if(this.caminoCerrado){

				this.cerrarCamino(coordenadas);
	  		} 
  		}

  		window.localStorage.coordenadas = JSON.stringify(coordenadas);


  	}


  }

  quitarVertice(latlng, tipo){

	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

  	let coordenadas = JSON.parse(window.localStorage.coordenadas);
  	let coordenadasNuevas = [];

  	if(tipo == "LineString"){

	  	coordenadas.forEach((element) =>{
	  		if((element[0] != latlng.lng) && (element[1] != latlng.lat)) coordenadasNuevas.push(element);
	  	});

	  	this.levantarCamino(coordenadasNuevas);
  		this.levantarVertices(tipo, coordenadasNuevas);
  	}

  	if(tipo == "Polygon"){

  		coordenadasNuevas.push([]);

  		let pos = coordenadas[0].findIndex((element) =>{
  			return (element[0] == latlng.lng) && (element[1] == latlng.lat);
  		});

	  	if(this.caminoCerrado){

	  		console.log("EL camino estaba cerrado");
	  		console.log("Posicion: "+pos);

	  		this.activeMap.removeLayer(this.figuraEnEdicion);

	  		if(pos == 0){


		  		for(let i = 1; i < coordenadas[0].length-1; i++){

		  			coordenadasNuevas[0].push(coordenadas[0][i]);
		  		}

	  		}
	  		else{

		  		for(let i = pos-1; i > 0 ; i--){

		  			coordenadasNuevas[0].push(coordenadas[0][i]);
		  		}

		  		for(let i = coordenadas[0].length-1; i>pos; i--){

		  			coordenadasNuevas[0].push(coordenadas[0][i]);
		  		}
	  		}


	  		this.caminoCerrado = false;

	  	}
	  	else{

	  		console.log("EL camino NO estaba cerrado");

	  		coordenadasNuevas[0] = coordenadas[0].filter((element) =>{
	  			return (element[0] != latlng.lng) && (element[1] != latlng.lat);
	  		})
			console.log(coordenadasNuevas[0]);
	  	}

	  	this.levantarCamino(coordenadasNuevas[0]);
	  	this.levantarVertices(tipo, coordenadasNuevas);
  	}

  	window.localStorage.coordenadas = JSON.stringify(coordenadasNuevas);
  }

  cerrarCamino(coordenadas){

	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
	if(this.caminoCerrado) this.activeMap.removeLayer(this.figuraEnEdicion);



	if(coordenadas[0].length>2 && (coordenadas[0][0][0] != coordenadas[0][coordenadas[0].length-1][0]) && (coordenadas[0][0][1] != coordenadas[0][coordenadas[0].length-1][1])){
		
		console.log("acomodando el camino");
		coordenadas[0].push(coordenadas[0][0]);
		this.caminoCerrado = true;
	}

	let oldCoords = [[]];
	let i = 1;
	coordenadas[0].forEach((element) =>{

		if(i<coordenadas[0].length) oldCoords[0].push([element[0], element[1]]);
		i++;
	});

		window.localStorage.coordenadas = JSON.stringify(coordenadas);
	



	this.geojsonFigura.geometry.coordinates = coordenadas;
	
	this.figuraEnEdicion = L.geoJSON(this.geojsonFigura, {style: {
										fillColor: '#bdd7e7',
									    weight: 2,
									    opacity: 1,
									    color: 'white',
									    dashArray: '3',
									    fillOpacity: 0.7} 
									}).addTo(this.activeMap);

	this.caminoCerrado = true;

	if(coordenadas[0].length>1){

		this.levantarCamino(coordenadas[0]);
	}
	console.log(coordenadas);
	console.log(oldCoords);
	this.levantarVertices('Polygon', oldCoords);

  }

  trancarExterno(){

  }

  actualizarGeojsonEditable(ev){

  	let coordenadas = JSON.parse(window.localStorage.coordenadas);
  	let init = this;
	this.geojsonEditable.geometry.type = ev.geom;

  	switch(ev.geom){

  		case "Point":

  			if(ev.tipo == "add"){

				this.geojsonEditable.geometry.coordinates = coordenadas;
				console.log(this.geojsonEditable);
				let init = this;

				this.puntosEnEdicion = L.geoJSON(this.geojsonEditable, {
				
					pointToLayer: function (feature, latlng) {
						return L.circleMarker(latlng, init.estiloEdicion);
					}}).addTo(this.activeMap);
  			}

  			if(ev.tipo == "remove"){

				if(this.puntosEnEdicion){
					this.activeMap.removeLayer(this.puntosEnEdicion);
				}  			
  			}
  		break;

  		case "LineString":


			if(this.verticesEnEdicion || this.moviendoVertice){
				
				console.log("Quitando vertices");
				this.activeMap.removeLayer(this.verticesEnEdicion);				
			} 
			
			if(this.caminoEnEdicion){
				
				console.log("Quitando el camino");
				this.activeMap.removeLayer(this.caminoEnEdicion);				
			} 

			if(coordenadas.length>1){
				this.levantarCamino(coordenadas);
			}


			console.log("añadiendo por update");

			this.levantarVertices(ev.geom, coordenadas);

			window.localStorage.coordenadas = JSON.stringify(coordenadas);
  		break;  		

  		case "Polygon":

			window.localStorage.coordenadas = JSON.stringify(coordenadas);

			if(this.verticesEnEdicion || this.moviendoVertice) this.activeMap.removeLayer(this.verticesEnEdicion);
			
			if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);

			if(this.caminoCerrado) this.activeMap.removeLayer(this.figuraEnEdicion);

			if(coordenadas[0].length>1){
				this.levantarCamino(coordenadas[0]);
			}


			console.log("añadiendo por update");

			if(this.caminoCerrado && (coordenadas[0][0][0] == coordenadas[0][coordenadas.length-1][0]) && (coordenadas[0][0][1] == coordenadas[0][coordenadas.length-1][1])){
	
				console.log("Trancando nuevamente");

				this.caminoCerrado = true;
				this.cerrarCamino(coordenadas);
			}
			else{
				if(ev.cerrada){

					console.log("Ajustar trancado");

					this.cerrarCamino(coordenadas);
				}
				else{
					
					console.log("Liberando");
					this.caminoCerrado = false;
				}
			}
			console.log(coordenadas);
			this.levantarVertices(ev.geom, coordenadas);

  		break;
  	}


  }

  cargarGeojson(capaNueva){


  	try{
  		if(!this.verificarGeojsonExistente(capaNueva)){
			this.addOverlayToControl(capaNueva);
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

  	let capaNueva = JSON.parse(window.localStorage.capaNueva);
  	console.log(capaNueva);

  	try{
  		if(!this.verificarGeojsonExistente(capaNueva)){
			this.addOverlayToControl(capaNueva);
  		}
  		else{
  			console.log("Repetido");
  		}
  	}
  	catch(err){
  		console.log(err);
  	}
  }


  verificarGeojsonExistente(capaNueva){

  	let geoJson;

  	console.log(capaNueva);

  	if(capaNueva.geojson){ 
  		geoJson = capaNueva.geojson;
  	}
  	else{
  		geoJson = capaNueva;
  	}

  	let match = false;

	console.log("Largo: "+geoJson.features.length);
	if (geoJson.features.length == 0){ 
		
		console.log("No hay features");		
	}
	
	this.geoJsons.forEach((element) =>{

  		if(element.nombre == capaNueva.nombre){
  			match = true;
  		}
	});

  	return match;
  }

  addOverlayToControl(capaNueva){

  	let geoJson = capaNueva.geojson;

	switch(geoJson.features[0].geometry.type){

		case 'Polygon':
		case 'MultiPolygon':

			let polygonStyle = function(){
			  return { 
			    fillColor: '#ff0000',
			    weight: 1,
			    opacity: 1,
			    color: 'white',
			    dashArray: '3',
			    fillOpacity: 0.5
			  }
			}

			this.addPolygonLayerToControl(capaNueva, polygonStyle);

		break;

		case 'LineString':
		case 'MultiLineString':

			let lineStyle = function(){
				return {
				    "color": '#08519c',
				    "weight": 5,
				    "opacity": 0.65
				}
			}

			this.addLineLayerToControl(capaNueva, lineStyle);

		break;

		case 'Point':
		case 'MultiPoint':

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

			this.addPointLayerToControl(capaNueva, circleStyle)

		break;

		default:
			
			console.log("Desconocido");

		break;
	} //FIN DEL SWTICH


  }

  addPolygonLayerToControl(capaNueva, estilo){

  	console.log(capaNueva);

  	let atributos = Object.getOwnPropertyNames(capaNueva.geojson.features[0].properties);
	let popup = function(feature, layer){

	  	let popupDiv = document.createElement("div");
	  	let ul = document.createElement("ul");

		atributos.forEach((element) =>{

			if(element != "pk"){

				let li = document.createElement("li");
				li.innerHTML = ""+element+": "+feature.properties[""+element];
				ul.appendChild(li);
			}
		});
		popupDiv.appendChild(ul);
		layer.bindPopup(popupDiv);
	}

	let myLayer = L.geoJSON(capaNueva.geojson, {style: estilo, onEachFeature: popup}).addTo(this.activeMap);

	let nombre = capaNueva.nombre;

	this.overlayMaps[""+capaNueva.nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);

	this.capasActivas = Object.keys(this.overlayMaps);

	if(capaNueva.dontpush){

		console.log("No lo meto");
		return false;
	}
	else{

		console.log("Si lo meto");
		this.geoJsons.push(capaNueva);
	}

  }

  addLineLayerToControl(capaNueva, estilo){

  	let atributos = Object.getOwnPropertyNames(capaNueva.geojson.features[0].properties);
	let popup = function(feature, layer){

	  	let popupDiv = document.createElement("div");
	  	let ul = document.createElement("ul");

		atributos.forEach((element) =>{

			if(element != "pk"){

				let li = document.createElement("li");
				li.innerHTML = ""+element+": "+feature.properties[""+element];
				ul.appendChild(li);
			}
		});
		popupDiv.appendChild(ul);
		layer.bindPopup(popupDiv);
	}

	let myLayer = L.geoJSON(capaNueva.geojson, {style: estilo, onEachFeature: popup}).addTo(this.activeMap);

	let nombre = capaNueva.nombre;

	this.overlayMaps[""+capaNueva.nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);

	this.capasActivas = Object.keys(this.overlayMaps);

	if(capaNueva.dontpush) return false;

	this.geoJsons.push(capaNueva);
  }

  addPointLayerToControl(capaNueva, estilo){

  	let atributos = Object.getOwnPropertyNames(capaNueva.geojson.features[0].properties);
	let popup = function(feature, layer){

	  	let popupDiv = document.createElement("div");
	  	let ul = document.createElement("ul");

		atributos.forEach((element) =>{

			if(element != "pk"){

				let li = document.createElement("li");
				li.innerHTML = ""+element+": "+feature.properties[""+element];
				ul.appendChild(li);
			}
		});
		popupDiv.appendChild(ul);
		layer.bindPopup(popupDiv);
	}

	let myLayer = L.geoJSON(capaNueva.geojson, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, estilo);
	    },
	    onEachFeature: popup}).addTo(this.activeMap);

	let nombre = capaNueva.nombre;

	this.overlayMaps[""+capaNueva.nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = L.control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);

	this.capasActivas = Object.keys(this.overlayMaps);

	if(capaNueva.dontpush) return false;

	this.geoJsons.push(capaNueva);
  }

	montarCapaImportada(){

		let shape = window["archivoConvertidoGeojson"];

		this.addOverlayToControl(shape);


	}

  previsualizarCapa(){

	let shape = window["archivoConvertidoGeojson"];

	let popup = function(feature, layer){

  		let popupdiv = document.createElement("div");

  		let botonConfirmar = document.createElement("button");
		botonConfirmar.setAttribute("class","btn btn-outline-success");
		botonConfirmar.innerHTML = "Aceptar";

		let botonCancelar = document.createElement("button");
		botonCancelar.setAttribute("class","btn btn-outline-danger");
		botonCancelar.innerHTML = "Cancelar";

		layer.bindPopup(popupdiv);
	}

  	this.capaShapefile = L.geoJSON(shape, { onEachFeature: popup }).addTo(this.activeMap);
  }

  filtrarAtributos(){

  	this.atributoFiltrado = "";
  	this.filtroElegido = "";

  	let atributos = this.capas.find((element) =>{return element.nombre == this.layerToFilter}).atributos;
  	this.attributesToFilter = atributos.filter((element) =>{return element.nombre != "geom"});
  	console.log(this.attributesToFilter);
  }

  elegirAtributo(){

  	this.filtroElegido = "";

  	this.atributoElegido = this.attributesToFilter.find((element) =>{return element.nombre == this.atributoFiltrado});
  }

  aplicarFiltro(){

  	if(this.overlayMaps[""+this.layerToFilter]){
  		this.activeMap.removeLayer(this.overlayMaps[""+this.layerToFilter]);
  	}

  	let geojson = this.geoJsons.find((element) =>{return element.nombre == this.layerToFilter}).geojson;

  	let features = [];

  	switch(this.filtroElegido){

  		case "mayor":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] > this.valorBusqueda});
  		break;

  		case "mayorigual":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] >= this.valorBusqueda});
  		break;

  		case "menor":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] < this.valorBusqueda});
  		break;

  		case "menorigual":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] <= this.valorBusqueda});
  		break;

  		case "igual":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] == this.valorBusqueda});
  		break;

  		case "diferente":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] != this.valorBusqueda});
  		break;
  	}

  	let capaNueva = {
  		"nombre": this.layerToFilter,
  		"geojson": {
  			"type": geojson.type,
  			"features": features
  		},
  		"dontpush": true
  	}

  	console.log(capaNueva);
	this.addOverlayToControl(capaNueva);
  }

  refrescarMapa(evento){

  	console.log(evento);

	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
	if(this.figuraEnEdicion) this.activeMap.removeLayer(this.figuraEnEdicion);

  	this.activeMap.removeLayer(this.overlayMaps[""+evento.nombre]);

  	evento.dontpush = true;

	this.addOverlayToControl(evento);
  }

  agregarDatos(){

  	document.getElementById("montar").click();
  	this.agregarDatosActivado = true;
 
  }

  terminarAgregar(ev){

  	console.log(ev)

  	this.agregarDatosActivado = false;
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