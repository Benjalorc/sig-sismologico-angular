import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service'

@Component({
  selector: 'app-actualizar-capas',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarCapasComponent implements OnInit {

  @Input() categorias: any;
  @Input() capa: any;
  @Output() edicionTerminada = new EventEmitter<boolean>();

  propiedadNueva: any;

  constructor(private capasService: CapasService) { }

  ngOnInit() {

  	this.propiedadNueva = {
  		nombre: "",
  		tipo: "",
  	}
  }


  agregarPropiedad(){

  	if(this.propiedadNueva.nombre == ""){
  		return false;
  	}  	

  	if(this.propiedadNueva.tipo == ""){
  		return false;
  	}

  	if( this.capa.propiedades.find((element) =>{return element.nombre == this.propiedadNueva.nombre}) ){
  		return false;
  	}

  	this.capa.propiedades.push({nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo});

  	this.propiedadNueva.nombre = "";
  	this.propiedadNueva.tipo = "";

  }

  removerPropiedad(i){

  	let propiedades = this.capa.propiedades.filter((element) =>{return element.nombre != this.capa.propiedades[i].nombre});
  	this.capa.propiedades = propiedades;
  }


  terminarEdicion(){
    this.edicionTerminada.emit(true);
  }

  actualizarCapa(){

    if(this.capa.nombre == ""){
      return false;
    }

    if(this.capa.categoria == ""){
      return false;
    }

    this.capasService.actualizar(this.capa).subscribe(data =>{

        if(data.code == 200){

          this.terminarEdicion();
        }
        else{


        }
      },
      error => {
        console.log(error);
      }
    );

  }
}
