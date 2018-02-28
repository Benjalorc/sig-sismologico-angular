import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Routes, Router, RouterModule } from '@angular/router';
import { CapasService } from '../../services/capas/capas.service'
import { CategoriasService } from '../../services/categorias/categorias.service'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    public router: Router,
    private modalService: NgbModal) {}
        

  ngOnInit() {

    eval("window.yo3 = this");

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
    //document.getElementById("geojsonfile").click();
    this.open();
  }

  open() {
//    const modalRef = this.modalService.open();
  }

  cargarGeojson(evento){

    let nav = this;

    let fr = new FileReader();
    
    fr.addEventListener("load", (e)=>{

      let geoJson = JSON.parse(e.target["result"]);
      window.localStorage.geojsonToLoad = JSON.stringify(geoJson);
    }, false);

    fr.readAsText(evento.target.files[0]);

  }

  importGeojson(geojson){

    this.loading = true;
    this.capasService.importar(geojson).subscribe(data =>{
    this.loading = false;
    window.localStorage.removeItem("geojsonToLoad");

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

    window.localStorage.categoriaActiva = JSON.stringify(catId);
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
    this.loading = false;

        if(data.status == 200){     

          let capaNueva = {
            geojson: data.body,
            nombre: nombre
          }

          window.localStorage.capaNueva = JSON.stringify(capaNueva);
          document.getElementById("mostrarCapaNueva").click();
          console.log(data.body);
          console.log(data);
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
/*
  shout(mensaje, estilo, tiempo){
    this.flashMessage.show(mensaje, { cssClass: estilo, timeout: tiempo });
  }

  verificarElementos(el){

    let ready = false;
    let mensaje = "";

      this.shout(mensaje, "alert-warning", 2000);
    this.flashMessage.show(mensaje, { cssClass: "alert-danger", timeout: 5000 });
    alert("Auxilio");
    
    if(el == 'cap'){
      if(this.capasFiltradas.length > 0){ready = true;}
      else{ mensaje = "Elija una categoria primero" }
    }

    if(el == 'cat'){
      if(this.categorias.length > 0){ ready = true; }
      else{ mensaje = "Aun no hay elementos de esta lista, espere un momento" }
    }

    if(!ready){
      this.shout(mensaje, "alert-warning", 2000);
    }

  }
*/
}