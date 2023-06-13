import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient } from '@urql/core';
import { Palier, Product } from './world';
import { ACHETER_ANGELUPGRADE, ACHETER_CASHUPGRADE, ACHETER_QT_PRODUIT, ENGAGER_MANAGER, GET_WORLD, LANCER_PRODUCTION } from './GrapqhRequests';

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

  setUser(user: string ) {
    this.user = user;
  }

  getWorld() {
    return this.createClient().query(GET_WORLD, {}).toPromise();
  }

  acheterQtProduit(product: Product) {
    return this.createClient().mutation(ACHETER_QT_PRODUIT, { id: product.id, quantite: product.quantite}).toPromise();
  }

  lancerProduction(product: Product) {
    return this.createClient().mutation(LANCER_PRODUCTION, { id: product.id}).toPromise();
  }

  engagerManager(manager: Palier) {
    return this.createClient().mutation(ENGAGER_MANAGER, { name: manager.name}).toPromise();
  }

  acheterCashUpgrade(upgrade: Palier) {
    return this.createClient().mutation(ACHETER_CASHUPGRADE, { name: upgrade.name}).toPromise();
  }

  acheterAngelUpgrade(upgrade: Palier) {
    return this.createClient().mutation(ACHETER_ANGELUPGRADE, { name: upgrade.name}).toPromise();
  }
}
