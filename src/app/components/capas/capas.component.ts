import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../../services/categorias/categorias.service'

@Component({
  selector: 'app-capas',
  templateUrl: './capas.component.html',
  styleUrls: ['./capas.component.css']
})
export class CapasComponent implements OnInit {

	crearActivado: boolean;
	editarActivado: boolean;
	borrarActivado: boolean;

	capa: any;
  categorias: any;

  constructor(private categoriasService: CategoriasService) { }

  ngOnInit() {

    this.categorias = [];

    this.categoriasService.obtener().subscribe(data =>{

      if(data.code == 200){     
        this.categorias = data.data;
      }
      else{
          this.categorias = [];
      }
    },
      error => {
        console.log(error);
      }
    );

    this.categorias = [{
        nombre: "Categoria 1",
        descripcion: "Descripcion 1",
        eliminable: false
      },
      {
        nombre: "Categoria 2",
        descripcion: "Descripcion 2",
        eliminable: true
      },
      {
        nombre: "Categoria 3",
        descripcion: "Descripcion 3",
        eliminable: false
      }
    ] 


  	this.crearActivado = false;
  	this.editarActivado = false;
  	this.borrarActivado = false;
  }

  agregarCapa(obj){
    console.log(obj);
  	this.capa = obj;
  	this.crearActivado = true;
  }  

  actualizarCapa(obj){
  	this.capa = obj;
  	this.editarActivado = true;
  }  

  eliminarCapa(obj){
  	this.capa = obj;
  	this.borrarActivado = true;
  }

  terminarCreacion(){

  	this.reiniciarCapa();

  	this.crearActivado = false;
  }

  terminarEdicion(){

  	this.reiniciarCapa();

  	this.editarActivado = false;
  }  

  terminarBorrado(){

  	this.reiniciarCapa();

  	this.borrarActivado = false;
  }

  reiniciarCapa(){

  	this.capa = {
  		categoria: "",
  		nombre: "",
  		geometria: "",
  		propiedades: []
  	}

  }

}
