import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

	crearActivado: boolean;
	editarActivado: boolean;
	borrarActivado: boolean;

	categoria: any;

  constructor() { }

  ngOnInit() {

  	this.crearActivado = false;
  	this.editarActivado = false;
  	this.borrarActivado = false;
  }

  agregarCategoria(obj){
  	this.categoria = obj;
  	this.crearActivado = true;
  }  

  actualizarCategoria(obj){
  	this.categoria = obj;
  	this.editarActivado = true;
  }  

  eliminarCategoria(obj){
  	this.categoria = obj;
  	this.borrarActivado = true;
  }

  terminarCreacion(){

    this.reiniciarCategoria();

  	this.crearActivado = false;
  }

  terminarEdicion(){

    this.reiniciarCategoria();

  	this.editarActivado = false;
  }  

  terminarBorrado(){

    this.reiniciarCategoria();

  	this.borrarActivado = false;
  }

  reiniciarCategoria(){

    this.categoria = {
      nombre: "",
      descripcion: ""
    }

  }

}
