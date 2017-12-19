import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'

@Component({
  selector: 'app-eliminar-categorias',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})

export class EliminarCategoriasComponent implements OnInit {

  @Input() categoria: any;
  @Output() borradoTerminado = new EventEmitter<boolean>();

  constructor(private categoriasService: CategoriasService) { }

  ngOnInit() {
  }

  terminarBorrado(){
    this.borradoTerminado.emit(true);
  }

  eliminarCategoria(){

    if(this.categoria.nombre == ""){
      return false;
    }

    if(this.categoria.descripcion == ""){
      return false;
    }

    this.categoriasService.eliminar(this.categoria).subscribe(data =>{

        if(data.status == 204){

          this.terminarBorrado();
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
