import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service'
import { CategoriasService } from '../../../services/categorias/categorias.service'

@Component({
  selector: 'app-agregar-datos',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})

export class AgregarDatosComponent implements OnInit {


	@Input() categorias;
	@Input() capas;
	@Output() agregarTerminado = new EventEmitter<any>();

	categoria: any;
	capa: any;
	capaActiva: any;
	capasFiltradas: any;
  coordenadaNueva: any;
  capaNueva: any;


  constructor(
  			private categoriasService: CategoriasService,
  			private capasService: CapasService) {}

  ngOnInit() {

  	eval("window.yo2 = this");

  	this.categoria = "";
  	this.capa = "";
  	this.capasFiltradas = [];

  	this.capaActiva = {};

    this.coordenadaNueva = {
      longitud: 0,
      latitud: 0
    };

  }

  filtrarCapas(){

  	this.capasFiltradas = this.capas.filter((element) =>{return element.categoria.id == this.categoria});
  }

  elegirCapa(){

    console.log(this.capasFiltradas);
  	this.capaActiva = this.capasFiltradas.find((element) =>{return element.id == this.capa});

    this.capaActiva.cerrada = false;
    this.ambientarCoordenadas();
    
    window.localStorage.capaActiva = JSON.stringify(this.capaActiva);
  }

  ambientarCoordenadas(){

    switch(this.capaActiva.geometria){

      case "Point":

        this.capaActiva.coordenadas = [];
      break;

      case "LineString":

        this.capaActiva.coordenadas = [];
      break;

      case "Polygon":

        this.capaActiva.coordenadas = [
          [
          ]
        ]
      break;

    }

  }

  evaluarCierre(){

    console.log("Evaluando cierre");
    console.log(this.capaActiva.geometria);
    switch(this.capaActiva.geometria){

      case "Point":

        console.log("Entre en Point");
        this.capaActiva.cerrada = true;
      break;      

      case "LineString":

        console.log("Entre en LineString");
        this.capaActiva.cerrada = false;
      break;      

      case "Polygon":

        console.log("Entre en Polygon");
        let largo = this.capaActiva.coordenadas[0].length;

        if(largo == 1) return false;

        let ln1 = this.capaActiva.coordenadas[0][0][0];
        let lt1 = this.capaActiva.coordenadas[0][0][1];
        let ln2 = this.capaActiva.coordenadas[0][largo-1][0];
        let lt2 = this.capaActiva.coordenadas[0][largo-1][1];
        if( (ln1 == ln2) && (lt1 == lt2) ){
          this.capaActiva.cerrada = true;
        }
        else{
          this.capaActiva.cerrada = false;
        }
      break;

    }
  }

  evaluarApertura(){

    switch(this.capaActiva.geometria){

      case "Point":

        console.log("Entre en Point");
        this.capaActiva.cerrada = false;
      break;      

      case "LineString":

        console.log("Entre en LineString");
        this.capaActiva.cerrada = false;
      break;      

      case "Polygon":

        console.log("Entre en Polygon");
        let largo = this.capaActiva.coordenadas[0].length;

        if(largo == 1) return false;

        let ln1 = this.capaActiva.coordenadas[0][0][0];
        let lt1 = this.capaActiva.coordenadas[0][0][1];
        let ln2 = this.capaActiva.coordenadas[0][largo-1][0];
        let lt2 = this.capaActiva.coordenadas[0][largo-1][1];
        if( (ln1 != ln2) || (lt1 != lt2) ){
          this.capaActiva.cerrada = false;
        }
        else{
          this.capaActiva.cerrada = true;
        }
      break;

    }  }

  agregarCoordenada(){


    switch(this.capaActiva.geometria){

      case "Point":
      case "LineString":
        this.capaActiva.coordenadas.push([this.coordenadaNueva.longitud, this.coordenadaNueva.latitud]);

      break;

      case "Polygon":
        this.capaActiva.coordenadas[0].push([this.coordenadaNueva.longitud, this.coordenadaNueva.latitud]);

      break;

    }

    this.evaluarCierre();

  }

  removerCoordenada(pos){

    let coordenadas = [];
    let i = 0;

    switch(this.capaActiva.geometria){

      case "Point":
      case "LineString":
    
        this.capaActiva.coordenadas.forEach((element) =>{

          if(i != pos){
            coordenadas.push(element);
          }

          i++;
        });
        this.capaActiva.coordenadas = coordenadas;

      break;

      case "Polygon":

        this.capaActiva.coordenadas[0].forEach((element) =>{

          if(i != pos){
            coordenadas.push(element);
          }

          i++;
        });
        this.capaActiva.coordenadas[0] = coordenadas;

      break;

    }

    this.evaluarApertura();
  }



  agregarDato(){

/*
    this.capasService.agregar(this.capaActiva).subscribe(data =>{

        if(data.status == 200){

          this.terminarAgregar();
        }
        else{


        }
      },
      error => {
        console.log(error);
      }
    );
*/

  }

  terminarAgregar(){
    this.agregarTerminado.emit(true);
  }


}
