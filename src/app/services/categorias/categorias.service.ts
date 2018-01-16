import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CategoriasService {

    public url: string;
 
    constructor(
        public http: HttpClient
    ){
        this.url = 'http://127.0.0.1:8000';
    }

	obtener(): Observable<any>{

	    return this.http.get(this.url, { observe: 'response' });
	}

	agregar(categoria): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        let hola = this.http.post(this.url, categoria, {headers: headers, observe: 'response'});
        console.log(hola);
        return hola;
    }

	actualizar(categoria): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');         
        return this.http.put(this.url+'/'+categoria.id, categoria, {headers: headers, observe: 'response'});
    }

	eliminar(categoria): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this.http.delete(this.url+'/'+categoria.id, {headers: headers,  observe: 'response'});
    }
 
}