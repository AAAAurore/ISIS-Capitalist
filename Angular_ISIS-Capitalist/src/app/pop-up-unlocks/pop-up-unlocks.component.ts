import { Component, Inject } from '@angular/core';
import { World } from '../world';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-unlocks',
  templateUrl: './pop-up-unlocks.component.html',
  styleUrls: ['./pop-up-unlocks.component.css']
})
export class PopUpUnlocksComponent {
  
  // Côté serveur
  server: string = this.data.server;

  // Monde
  world: World = this.data.world;

  // Unlocks
  unlocks = {};

  // Bouton "Galerie"
  gallery: boolean = false;
  
  // Constructeur
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {};

  //Méthodes
  ngOnInit(){
    this.groupByName();
  }
  
  // Filter les Unlocks par produit
  groupByName(){
    this.unlocks = this.world.allunlocks.filter(u => !u.unlocked).reduce((idCible, seuil) => {
      idCible[seuil.idcible] = idCible[seuil.idcible] || [];
      idCible[seuil.idcible].push(seuil);
      return idCible;
    }, Object.create(null));
  }
}
