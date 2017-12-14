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

  constructor(
  			private categoriasService: CategoriasService,
  			private capasService: CapasService) {}

  ngOnInit() {

  	eval("window.yo2 = this");

  	this.categoria = "";
  	this.capa = "";
  	this.capasFiltradas = [];

  	this.capaActiva = {};
  }

  filtrarCapas(){

  	this.capasFiltradas = this.capas.filter((element) =>{return element.categoria == this.categoria});

  }

  elegirCapa(){
  	this.capaActiva = this.capasFiltradas.find((element) =>{return element.nombre = this.capa})
  }

  agregarDato(){

    this.capasService.agregar(this.capaNueva).subscribe(data =>{

        if(data.code == 200){

          this.terminarAgregar();
        }
        else{


        }
      },
      error => {
        console.log(error);
      }
    );

  }

  terminarAgregar(){
  	this.agregarTerminado.emit(true);
  }

}
