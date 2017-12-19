import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'

@Component({
  selector: 'app-actualizar-categorias',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarCategoriasComponent implements OnInit {

  loading: boolean;

  @Input() categoria: any;
  @Output() edicionTerminada = new EventEmitter<boolean>();

  constructor(private categoriasService: CategoriasService) { }

  ngOnInit() {

    this.loading = false;
  }

  terminarEdicion(){
    this.edicionTerminada.emit(true);
  }

  actualizarCategoria(){

    if(this.categoria.nombre == ""){
      return false;
    }

    if(this.categoria.descripcion == ""){
      return false;
    }

    this.loading = true;
    this.categoriasService.actualizar(this.categoria).subscribe(data =>{
    this.loading = false;

        if(data.status == 200){

          this.terminarEdicion();
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
