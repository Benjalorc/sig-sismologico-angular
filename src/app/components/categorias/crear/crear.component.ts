import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'

@Component({
  selector: 'app-crear-categorias',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearCategoriasComponent implements OnInit {

  categoriaNueva: any;

  @Input() categoria: any;
  @Output() creacionTerminada = new EventEmitter<boolean>();

  constructor(private categoriasService: CategoriasService) { }

  ngOnInit() {
    this.categoriaNueva = this.categoria;
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

    this.categoriasService.agregar(this.categoriaNueva).subscribe(data =>{

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
