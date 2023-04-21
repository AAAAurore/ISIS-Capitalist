import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient } from '@urql/core';
import GET_WORLD from './GrapqhRequests';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {

  server = "http://localhost:4000/";
  user = "";

  constructor(private http: HttpClient) { }

  createClient() {
    return createClient({ url: this.server + "graphql", fetchOptions: () => {
      return {
        headers: {'x-user': this.user},
      };
    }, });
  }

  getWorld() {
    return this.createClient().query(GET_WORLD, {}).toPromise();
  }
}
