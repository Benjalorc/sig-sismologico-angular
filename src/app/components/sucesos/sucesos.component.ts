import { Component, OnInit } from '@angular/core';
import { SucesosService } from '../../services/sucesos.service'

@Component({
  selector: 'app-sucesos',
  templateUrl: './sucesos.component.html',
  styleUrls: ['./sucesos.component.css']
})
export class SucesosComponent implements OnInit {
  sucesos: any;
  constructor(private sucesosService: SucesosService) { }

  ngOnInit() {

   this.sucesosService.all().subscribe(data =>{
          if (data.status == 200){
           var result = [];
            for (var i=0; i<data.body.length; i++)
            {
              result.push(data.body[i]);
            }
            this.sucesos = result;
          }else
          {
            console.log("error no cargo la lista de sucesos");
          }
        });
  }

}
