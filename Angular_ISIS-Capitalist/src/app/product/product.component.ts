import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Palier, Product, World } from '../world';
import { RestserviceService } from '../restservice.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  //Barre de progression
  auto: boolean = false;
  progressBarValue: number = 0;
  run: boolean = false;

  // Côté serveur
  server: string;

  // Inputs
  _product: Product;
  @Input()
  set product(value: Product) {
    this._product = value;
    if (this._product && this._product.timeleft > 0) {
      this._world.lastupdate = Date.now().toString();
      this._product.lastupdate = Date.now().toString();
      this.progressBarValue = ((this._product.vitesse - this._product.timeleft) / this._product.vitesse) * 100;
      this.run = true;
      this.auto = this._product.managerUnlocked;
    }
  }

  _world: World;
  @Input()
  set world(value: World) {
    this._world = value;
    if(this._world && this._product) {
      this.calcMaxCanBuy();
    }
  }

  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
    if(this._money && this._product) {
      this.calcMaxCanBuy();
    }
  }

  _qtmulti: string;
  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if(this._qtmulti && this._product) {
      this.calcMaxCanBuy();
    }
  }

  // Outputs
  @Output()
  notifyProduction: EventEmitter<{product: Product, nbProduction: number}> = new EventEmitter<{product: Product, nbProduction: number}>();

  @Output()
  onBuy: EventEmitter<{product: Product, coutProduct: number}> = new EventEmitter<{product: Product, coutProduct: number}>();

  // Constructeur
  constructor(private restService: RestserviceService) {
    this.server = restService.server;
  }

  // Méthodes
  ngOnInit() {
    setInterval(() => {
      this.calcScore();
    }, 100);
  }

  // Calculer le coût total du produit
  calcTotalCost() {
    return this._product.cout * Math.pow(this._product.croissance, this._product.quantite - 1) * this.calcMaxCanBuy();
  }

  // Calculer la quantité maximale
  calcMaxCanBuy() {
    let quantite: number = 0;
    
    if(Number(this._qtmulti)) {
      quantite = Number(this._qtmulti);
    }
    else{
      quantite = Math.floor(Math.log(-((this._money * (1 - this._product.croissance)) / this._product.cout) + 1) / Math.log(this._product.croissance));
      if(quantite <= 0){
        quantite = 1;
      }
    }
    return quantite;
  }

  // Lancer la production
  clickIcon() {
    if(this._product.timeleft == 0) {
      this.restService.lancerProduction(this._product).catch(reason =>
        console.log("Erreur: " + reason)
      );

      this._product.timeleft = this._product.vitesse;
      this.run = true;
      this._world.lastupdate = Date.now().toString();
    }
  }

  // Mettre à jour les Unlocks / Upgrades / Angels Upgrades
  calcUpgrade(palier: Palier) {
    palier.unlocked = true;
    if (palier.typeratio == "VITESSE") {
      this._product.vitesse = this._product.vitesse / palier.ratio;
    }
    else if (palier.typeratio == "GAIN") {
      this._product.revenu = this._product.revenu * palier.ratio;
    }
    else{
      this._world.angelbonus += palier.ratio;
    }
  }

  // Calculer le score
  calcScore() {
    let elapseTime: number = 0;
    let nbProduction: number = 0;

    this.auto = this._product.managerUnlocked;

    if (this._product.timeleft != 0 || this.auto) {
      elapseTime = Date.now() - Number(this._product.lastupdate);
      this._product.lastupdate = Date.now().toString();

      if (!this._product.managerUnlocked) {
        if (elapseTime > this._product.timeleft) {          
          nbProduction = 1;
          this._product.timeleft = 0;
          this.progressBarValue = 0;
          this.run = false;
        }
        else {
          nbProduction = 0;
          this._product.timeleft -= elapseTime;
        }
      }
      else {
        this.run = true;
        if (elapseTime > this._product.timeleft) {
          nbProduction = 1 + (elapseTime - this._product.timeleft) / this._product.vitesse;
          this._product.timeleft  = this._product.vitesse - (elapseTime - this._product.timeleft) % this._product.vitesse;
        }
        else {
          nbProduction = 0;
          this._product.timeleft -= elapseTime;
        }
      }

      this.notifyProduction.emit({product: this._product, nbProduction : nbProduction});
    }
  }

  // Acheter le produit
  buyProduct() {
    this.restService.acheterQtProduit(this._product).catch(reason =>
      console.log("Erreur: " + reason)
    );
    
    this._product.quantite += this.calcMaxCanBuy();
    this.onBuy.emit({product: this._product, coutProduct : this.calcTotalCost()});
    this.calcTotalCost();
  }
}
