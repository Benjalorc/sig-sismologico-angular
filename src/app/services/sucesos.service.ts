import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SucesosService {
  public url: string;

  constructor(public http: HttpClient) {
    this.url = 'http://127.0.0.1:8000/sucesos';
  }


  all(): Observable<any>{
        let headers = new HttpHeaders()
                                    .set('Authorization', 'basic YWRtaW46YWRtaW5hZG1pbg==');

        return this.http.get(this.url, {headers: headers,  observe: 'response' });
    }

}
