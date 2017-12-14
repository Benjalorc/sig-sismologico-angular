import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CategoriasService {

    public url: string;
 
    constructor(
        public http: HttpClient
    ){
        this.url = '';
    }

	obtener(): Observable<any>{
	    return this.http.get(this.url+'obtener');
	}

	agregar(categoria): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');         
        return this.http.post(this.url+'agregar', categoria, {headers: headers});
    }

	actualizar(categoria): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');         
        return this.http.put(this.url+'actualizar', categoria, {headers: headers});
    }

	eliminar(categoria): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');         
        return this.http.delete(this.url+'eliminar/'+categoria.codigo, {headers: headers});
    }
 
}