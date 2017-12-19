import { Component, OnInit } from '@angular/core';
import { Routes, Router, RouterModule } from '@angular/router';
import { CapasService } from '../../services/capas/capas.service'
import { CategoriasService } from '../../services/categorias/categorias.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isCollapsed = true;


  loading: boolean;

  categorias: any;
  capas: any;

  capasFiltradas: any;

  constructor(
    private capasService: CapasService, 
    private categoriasService: CategoriasService, 
    private router: Router) {}
        

  ngOnInit() {

    window.localStorage.categorias = JSON.stringify([]);
    window.localStorage.capas = JSON.stringify([]);

    this.categorias = [];
    this.capas = [];
    this.capasFiltradas = [];

    var nav;
    eval("nav = this")

    function cargar(yo){
      nav.montarDatos();
    }

    function cargarFunction(){
      let cargarVar = setInterval(cargar, 1000);
    }

    cargarFunction();

  }

  collapse(){
  	this.isCollapsed = !this.isCollapsed;
  	return this.isCollapsed;
  }

  abrirSelectorArchivo(){
    document.getElementById("geojsonfile").click();
  }

  cargarGeojson(evento){
    
    let file = evento.target.files[0];
    console.log(file);

    this.loading = true;
    this.capasService.importar(file).subscribe(data =>{
    this.loading = false;

        if(data.status == 200){     

        }
        else{

          console.log(data);
        }
      },
      error => {
        console.log(error);
      }
    );

  }

  filtrarCapas(catId){

    console.log(catId);
    this.capasFiltradas = this.capas.filter((element) =>{return element.categoria.id == catId});
  }

  montarDatos(){

    this.categorias = JSON.parse(window.localStorage.categorias);
    this.capas = JSON.parse(window.localStorage.capas);

  }

  traerCapa(nombre){

    console.log(nombre);

    this.loading = true;
    this.capasService.traer(nombre).subscribe(data =>{
    this.loading = true;

        if(data.status == 200){     

          window.localStorage.capaNueva = JSON.stringify(data.body);
          document.getElementById("mostrarCapaNueva").click();
          console.log(data.body);
        }
        else{

          console.log(data);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}