import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {Message} from 'primeng/components/common/api';
import { CasosService } from '../../services/casos.service'
import { SucesosService } from '../../services/sucesos.service'
import { SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-casos',
  templateUrl: './casos.component.html',
  styleUrls: ['./casos.component.css']
})
export class CasosComponent implements OnInit {

  display: boolean = false;
  mapa: any;
  suceso: any;
  lat: any;
  lng: any;
  fecha: Date;
  msgs: Message[] = [];
  uploadedFiles: any[] = [];
  hora: Date;
  descripcion: string;
  sucesos: SelectItem[];

  constructor(private casosService: CasosService, private sucesosService: SucesosService) { }

  ngOnInit() {
        this.iniciar_mapa();
        this.msgs.push({severity:'success', summary:'Haga click en el lugar donde ourrio el hecho'});
        this.sucesosService.all().subscribe(data =>{
          if (data.status == 200){
           var result = [];
            result.push({label:"Seleccione una suceso de la lista", value: null})
            for (var i=0; i<data.body.length; i++)
            {
              result.push({label:data.body[i].nombre, value: data.body[i].id});
            }
            console.log(result);
            this.sucesos = result;
          }else
          {
            this.msgs.push({severity:'warning', summary:'Ocurrio un problema', detail:'No se cargaron la lista de sucesos'});
          }
        });

        console.log(this.sucesos);
  }

  iniciar_mapa()
  {
      let osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
       const osm = L.tileLayer(osmUrl, {
          attribution: 'Open Street Maps | CSUDO'
      });

      this.mapa = L.map('mapa', {
        center: [10.456389, -64.1675],
        zoom: 13,
        layers: [osm]
        });
      this.mapa.on('click', (e) => this.onMapClick(e));
  }

  onMapClick(e) {
  this.lat = e.latlng.lat;
  this.lng = e.latlng.lng;
  this.showDialog();
  }

  registrar()
  {
  this.msgs = [];
    if (this.validar())
    {
    let caso = {
      "fecha": this.fecha,
      "hora": this.hora,
      "descripcion": this.descripcion,
      "lat": this.lat,
      "suceso": this.suceso,
      "lng": this.lng,
      "imagenes": []
    };
    this.casosService.registrar(caso).subscribe(data =>{
      if (data.status == 201)
      {
         this.display = false;
         this.msgs.push({severity:'success', summary:'Operacion exitosa', detail:'Su caso fue registrado con exito'});
         this.descripcion = "";
         this.suceso = "";
      }
    }, error => {
      this.msgs.push({severity:'error', summary:'Operacion fallida', detail:'Ocurrio un problema mientras se registraba su caso'});
    });}
  }

  validar()
  {
    let res = true;
    if (this.fecha == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Fecha', detail:'es requerida'});
    }
    if (this.hora == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Hora', detail:'es requerida'});
    }
    if (this.lat == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Latitud', detail:'es requerida'});
    }
    if (this.lng == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Longitud', detail:'es requerida'});
    }
    if (this.descripcion == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Descripcion', detail:'es requerida'});
    }
    if (this.suceso == null){
      res = false;
      this.msgs.push({severity:'error', summary:'Suceso', detail:'es requerida'});
    }
    return res;
  }

  onUpload(event) {
       for(let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }

  showDialog() {
      this.display = true;
    }



}
