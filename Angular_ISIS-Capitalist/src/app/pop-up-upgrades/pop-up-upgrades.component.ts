import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Palier, World } from '../world';

@Component({
  selector: 'app-pop-up-upgrades',
  templateUrl: './pop-up-upgrades.component.html',
  styleUrls: ['./pop-up-upgrades.component.css']
})
export class PopUpUpgradesComponent {

  // Côté serveur
  server: string = this.data.server;

  // Monde
  world: World = this.data.world;

  // Upgrades
  upgrades: Palier[] = this.data.upgrades;

  // Type d'Upgrade
  type: string = this.data.type;

  // Titre du pop-up
  titre: string = this.data.titre;

  // Message du pop-up
  message: string = this.data.message;

  //Si pas d'Upgrade
  msgNoUpgrade: string = "";

  // Output
  @Output()
  update: EventEmitter<Palier> = new EventEmitter<Palier>();

  // Constructeur
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restService: RestserviceService) {};

    buyUpgrade(upgrade: Palier) {
      if(this.type == 'ANGE'){
        if(this.world.activeangels >= upgrade.seuil){
          this.world.activeangels -= upgrade.seuil;
          this.update.emit(upgrade);
        }
        if(this.world.upgrades.filter(u => !u.unlocked).length == 0){
          this.msgNoUpgrade = "Oh non, il n'y plus d'upgrades à acheter !";
        }
  
        this.restService.acheterAngelUpgrade(upgrade).catch(reason =>
          console.log("Erreur: " + reason)
        );
      }
      else{
        if(this.world.money >= upgrade.seuil){
          this.world.money -= upgrade.seuil;
          this.update.emit(upgrade);
        }
        if(this.world.upgrades.filter(u => !u.unlocked).length == 0){
          this.msgNoUpgrade = "Oh non, il n'y plus d'upgrades à acheter !";
        }
  
        this.restService.acheterCashUpgrade(upgrade).catch(reason =>
          console.log("Erreur: " + reason)
        );
      }
    }
}
