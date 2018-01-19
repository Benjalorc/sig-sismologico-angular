import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CasosService {
  public url: string;
  
  constructor(public http: HttpClient) {
    this.url = 'http://127.0.0.1:8000/casos';
   }

   registrar(caso): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', 'basic YWRtaW46YWRtaW5hZG1pbg==');
        return this.http.post(this.url, caso, {headers: headers,  observe: 'response'});
    }   

}
