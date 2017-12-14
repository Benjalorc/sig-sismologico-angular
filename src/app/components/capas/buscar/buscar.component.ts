import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'
import { CapasService } from '../../../services/capas/capas.service'

@Component({
  selector: 'app-buscar-capas',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarCapasComponent implements OnInit {

	
	capas: any;
	capaNueva: any;


	@Input() categorias;
	@Output() capaCambiada = new EventEmitter<any>();
	@Output() capaActualizada = new EventEmitter<any>();
	@Output() capaEliminada = new EventEmitter<any>();

  constructor(
  			private categoriasService: CategoriasService,
  			private capasService: CapasService) {}

  ngOnInit() {

  	this.capaNueva = {
  		categoria: "",
  		nombre: "",
  		geometria: "",
  		propiedades: []
  	}


  	this.capas = [];



	this.capasService.obtener().subscribe(data =>{

		if(data.code == 200){			
			this.capas = data.data;
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
			eliminable: false,
			propiedades: []
		},
		{
			categoria: "Categoria 1",
			nombre: "Capa 2",
			geometria: "POLIGONO",
			eliminable: false,
			propiedades: []
		},
		{
			categoria: "Categoria 2",
			nombre: "Capa 3",
			geometria: "LINEA",
			eliminable: false,
			propiedades: []
		},
		{
			categoria: "Categoria 2",
			nombre: "Capa 4",
			geometria: "POLIGONO",
			eliminable: true,
			propiedades: []
		},
		{
			categoria: "Categoria 3",
			nombre: "Capa 5",
			geometria: "PUNTO",
			eliminable: false,
			propiedades: []
		},
		{
			categoria: "Categoria 3",
			nombre: "Capa 6",
			geometria: "LINEA",
			eliminable: true,
			propiedades: []
		}
	]

  }//Cierre ngOnInit


  agregarCapa(){
	this.capaCambiada.emit(this.capaNueva);
  }

  editarCapa(capa){
  	this.capaActualizada.emit(capa);
  }

  eliminarCapa(capa){
  	this.capaEliminada.emit(capa);
  }
}
