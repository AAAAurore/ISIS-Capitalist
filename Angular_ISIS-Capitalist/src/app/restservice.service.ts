import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient } from '@urql/core';
import GET_WORLD from './GrapqhRequests';
import ACHETER_QT_PRODUIT from './GrapqhRequests';
import LANCER_PRODUCTION from './GrapqhRequests';
import ENGAGER_MANAGER from './GrapqhRequests';
import { Palier, Product } from './world';

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

  acheterQtProduit(product: Product) {
    return this.createClient().query(ACHETER_QT_PRODUIT, { id: product.id, quantite: product.quantite}).toPromise();
  }

  lancerProduction(product: Product) {
    return this.createClient().query(LANCER_PRODUCTION, { id: product.id}).toPromise();
  }

  engagerManager(manager: Palier) {
    return this.createClient().query(ENGAGER_MANAGER, { name: manager.name}).toPromise();
  }
}
