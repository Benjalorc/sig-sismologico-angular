import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'

@Component({
  selector: 'app-crear-categorias',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearCategoriasComponent implements OnInit {

  loading: boolean;
  categoriaNueva: any;
  propiedadNueva: any;

  @Input() categoria: any;
  @Output() creacionTerminada = new EventEmitter<boolean>();

  constructor(private categoriasService: CategoriasService) { }

  ngOnInit() {
    this.loading = false;
    this.categoriaNueva = this.categoria;
    this.categoriaNueva.atributos = [];

    this.propiedadNueva = {
      nombre: "",
      tipo: ""
    }
  }

  agregarPropiedad(){

    if(this.propiedadNueva.nombre == ""){
      return false;
    }   

    if(this.propiedadNueva.tipo == ""){
      return false;
    }

    if( this.categoriaNueva.atributos.find((element) =>{return element.nombre == this.propiedadNueva.nombre}) ){
      return false;
    }

    this.categoriaNueva.atributos.push({nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo});

    this.propiedadNueva.nombre = "";
    this.propiedadNueva.tipo = "";
  }

  removerPropiedad(i){

    let propiedades = this.categoriaNueva.atributos.filter((element) =>{return element.nombre != this.categoriaNueva.atributos[i].nombre});
    this.categoriaNueva.atributos = propiedades;
  }

  terminarCreacion(){
    this.creacionTerminada.emit(true);
  }

  crearCategoria(){

    if(this.categoriaNueva.nombre == ""){
      return false;
    }

    if(this.categoriaNueva.descripcion == ""){
      return false;
    }

    this.loading = true;
    this.categoriasService.agregar(this.categoriaNueva).subscribe(data =>{
    this.loading = false;

        if(data.status == 201){

          console.log(data);
          this.terminarCreacion();
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
