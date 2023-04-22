import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product, World } from '../world';
import { RestserviceService } from '../restservice.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  //Barre de progression
  auto: boolean = false;
  lastUpdate: number = 0;
  progressBarValue: number = 0;
  run: boolean = false;

  // Côté serveur
  server: string;

  // Label
  LabelDisabled : boolean = true;
  labelLien : string = "labelGray";
  labelVisible: boolean = true;

  // Inputs
  _product: Product;
  @Input()
  set product(value: Product) {
    this._product = value;
  }

  _qtmulti: string;
  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if(this._qtmulti && this._product) {
      this.calcMaxCanBuy();
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

  // Outputs
  @Output()
  notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  @Output()
  onBuy: EventEmitter<number> = new EventEmitter<number>();

  // Constructeur
  constructor(private restService: RestserviceService) {
    this.server = restService.server;
  }

  // Méthodes
  ngOnInit(){
    setInterval(() => {
      this.calcScore();
      this.updateLabel();
    }, 100);
  }

  calculCoutTotal(){
    return this._product.cout * Math.pow(this._product.croissance, this._product.quantite - 1) * this.calcMaxCanBuy();
  }

  calcMaxCanBuy(){
    let quantite: number = 0;
    
    if(Number(this._qtmulti)){
      quantite = Number(this._qtmulti);
    }
    else{
      quantite = Math.floor(Math.log(-((this._world.money * (1 - this._product.croissance)) / this._product.cout) + 1) / Math.log(this._product.croissance));
    }
    return quantite;
  }

  clickIcon(){
    this._product.timeleft = this._product.vitesse;
    this.lastUpdate = Date.now();
  }

  updateLabel(){
    this.labelLien = this._world.money < this._product.revenu ? "labelGray" : "label";
    this.LabelDisabled = this._world.money < this._product.revenu ? true : false;
  }

  calcScore(){
    this.auto = !this.labelVisible && this._product.managerUnlocked;
    
    if(this._product.timeleft != 0 || this.auto){
      this.run = true;

      this._product.timeleft -= Date.now() - this.lastUpdate;

      if(this._product.timeleft <= 0){
        this.run = this._product.managerUnlocked ? true : false;

        this._product.timeleft = 0;
        this.progressBarValue = 0;

        this.notifyProduction.emit(this._product);
        this.calcMaxCanBuy();
      }
      else{
        this.progressBarValue = ((this._product.vitesse - this._product.timeleft) / this._product.vitesse) * 100;
      }
    }
  }

  acheterProduit(){
    this.onBuy.emit(this.calculCoutTotal());
    this._product.quantite += this.calcMaxCanBuy();
    this.calculCoutTotal();
  }
}
