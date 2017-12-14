import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service'

@Component({
  selector: 'app-eliminar-capas',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarCapasComponent implements OnInit {

  @Input() categorias: any;
  @Input() capa: any;
  @Output() borradoTerminado = new EventEmitter<boolean>();

  constructor(private capasService: CapasService) { }

  ngOnInit() {
  }

  terminarBorrado(){
    this.borradoTerminado.emit(true);
  }

  eliminarCapa(){

    this.capasService.eliminar(this.capa).subscribe(data =>{

        if(data.code == 200){

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
