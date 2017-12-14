import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CapasService {

    public url: string;
 
    constructor(
        public http: HttpClient
    ){
        this.url = '';
    }

    obtener(): Observable<any>{
        return this.http.get(this.url+'obtener');
    }

	agregar(capa): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');         
        return this.http.post(this.url+'agregar', capa, {headers: headers});
    }

    actualizar(capa): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');         
        return this.http.put(this.url+'actualizar', capa, {headers: headers});
    }

    eliminar(capa): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');         
        return this.http.delete(this.url+'eliminar/'+capa.codigo, {headers: headers});
    }

}
