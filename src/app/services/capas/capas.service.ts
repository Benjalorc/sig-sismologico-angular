import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CapasService {

    public url: string;
 
    constructor(
        public http: HttpClient
    ){
        this.url = 'http://127.0.0.1:8000/capas';
    }

    obtener(): Observable<any>{
        return this.http.get(this.url, { observe: 'response' });
    }

    traer(nombre): Observable<any>{

        return this.http.get(this.url+"/nombre/"+nombre, { observe: 'response' });
    }

    importar(file): Observable<any>{

        let input = new FormData();
        input.append('file', file, file.name);
        let headers = new HttpHeaders().set('Content-Type','multipart/form-data');         
        return this.http.post('http://127.0.0.1:8000/importar', input, {headers: headers, observe: 'response'});
    }

    agregar(capa): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(this.url, capa, {headers: headers,  observe: 'response'});
    }   

    crearAtributos(atributos): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this.http.post('http://127.0.0.1:8000/atributos', atributos, {headers: headers,  observe: 'response'});
    }   

    eliminarAtributos(id): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this.http.delete('http://127.0.0.1:8000/atributos/'+id, {headers: headers,  observe: 'response'});
    }   


    actualizar(capa): Observable<any>{

        capa.categoria = capa.categoria.id;

        let headers = new HttpHeaders().set('Content-Type','application/json');         
        return this.http.put(this.url+'/'+capa.id, capa, {headers: headers, observe: 'response'});
    }

    eliminar(capa): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');         
        return this.http.delete(this.url+'/'+capa.id, {headers: headers, observe: 'response'});
    }

}
