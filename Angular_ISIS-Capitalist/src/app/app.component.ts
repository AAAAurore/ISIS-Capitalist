import { Component } from '@angular/core';
import { Product, World } from './world';
import { RestserviceService } from './restservice.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular_ISIS-Capitalist';
  
  world: World = new World();

  qtmulti: string;

  quantites: string[] =  ["1", "10", "100", "MAX"];
  
  server: string;

  // Constructeur
  constructor(
    private restService: RestserviceService,
    public dialog: MatDialog
    ) {
    restService.getWorld().then( world => {
      this.world = world.data.getWorld;
      this.server = restService.server;
    });
  }

  // Méthodes
  ngOnInit(){
    this.qtmulti = this.quantites[0];
  }

  changeQuantite(){
    let quantite: string = this.quantites[this.quantites.indexOf(this.qtmulti) + 1];
    
    this.qtmulti = quantite == undefined ? this.quantites[0] : quantite;
  }

  onBuy(coutProduit: number){
    this.world.money -= coutProduit;
  }

  onProductionDone(p: Product){
    this.world.money += p.revenu * p.quantite;
    this.world.score += p.revenu * p.quantite;
  }
}
