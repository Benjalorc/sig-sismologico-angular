import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {Message} from 'primeng/components/common/api';
import { CasosService } from '../../services/casos.service'

@Component({
  selector: 'app-casos',
  templateUrl: './casos.component.html',
  styleUrls: ['./casos.component.css']
})
export class CasosComponent implements OnInit {

  display: boolean = false;
  mapa: any;
  lat: any;
  lng: any;
  fecha: Date;
  msgs: Message[] = [];
  uploadedFiles: any[] = [];
  hora: Date;
  descripcion: string;

  constructor(private casosService: CasosService) { }

  ngOnInit() {
        this.iniciar_mapa();
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
    let caso = {
      "fecha": this.fecha,
      "hora": this.hora,
      "descripcion": this.descripcion,
      "lat": this.lat,
      "lng": this.lng,
      "imagenes": []
    }
    this.casosService.registrar(caso).subscribe(data =>{
      if (data.status == 201)
      {
         this.display = false;
         this.msgs.push({severity:'success', summary:'Operacion exitosa', detail:'Su caso fue registrado con exito'});
      }else
      {
        this.msgs.push({severity:'Error', summary:'Operacion fallida', detail:'Ocurrio un problema mientras se registraba su caso'});
      }
    }
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
