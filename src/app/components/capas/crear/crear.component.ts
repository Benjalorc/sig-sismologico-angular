import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service'
import { CategoriasService } from '../../../services/categorias/categorias.service'

@Component({
  selector: 'app-crear-capas',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearCapasComponent implements OnInit {

  capaNueva: any;

  propiedadNueva: any;

  categorias: any;

  @Input() capa: any;
  @Output() creacionTerminada = new EventEmitter<boolean>();

  constructor(
  			private capasService: CapasService,
  			private categoriasService: CategoriasService){}

  ngOnInit() {

  	this.propiedadNueva = {
  		nombre: "",
  		tipo: ""
  	}

    this.capaNueva = this.capa;


  	this.categoriasService.obtener().subscribe(data =>{

  		if(data.status == 200){			

        console.log(data);
  			this.categorias = data.body;
  		}
  		else{
  		  	this.categorias = [];
  		}
  	},
  		error => {
  			console.log(error);
  		}
  	);

    eval("window.yo = this");
  }

  agregarPropiedad(){

  	if(this.propiedadNueva.nombre == ""){
  		return false;
  	}  	

  	if(this.propiedadNueva.tipo == ""){
  		return false;
  	}

  	if( this.capaNueva.atributos.find((element) =>{return element.nombre == this.propiedadNueva.nombre}) ){
  		return false;
  	}

  	this.capaNueva.atributos.push({nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo});

  	this.propiedadNueva.nombre = "";
  	this.propiedadNueva.tipo = "";

  }

  removerPropiedad(i){

  	let propiedades = this.capaNueva.atributos.filter((element) =>{return element.nombre != this.capaNueva.atributos[i].nombre});
  	this.capaNueva.atributos = propiedades;
  }

  terminarCreacion(){

    this.creacionTerminada.emit(true);
  }

  crearCapa(){

    this.capaNueva.atributos.push({"nombre": "geom", "tipo":this.capaNueva.geometria});

    console.log(this.capaNueva);

    this.capasService.agregar(this.capaNueva).subscribe(data =>{

        if(data.status == 201){

          this.terminarCreacion();
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