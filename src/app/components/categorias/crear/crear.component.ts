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

  @Input() categoria: any;
  @Output() creacionTerminada = new EventEmitter<boolean>();

  constructor(private categoriasService: CategoriasService) { }

  ngOnInit() {
    this.loading = false;
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
