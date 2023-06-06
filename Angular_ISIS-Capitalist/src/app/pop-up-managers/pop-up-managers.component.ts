import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Palier, World } from '../world';
import { RestserviceService } from '../restservice.service';

@Component({
  selector: 'app-pop-up-managers',
  templateUrl: './pop-up-managers.component.html',
  styleUrls: ['./pop-up-managers.component.css']
})
export class PopUpManagersComponent {

  // Côté serveur
  server: string = this.data.server;

  // Monde
  world: World = this.data.world;

  // Si pas de manager
  msgNoManager: string = "";
  
  // Output
  @Output()
  update: EventEmitter<Palier> = new EventEmitter<Palier>();

  // Constructeur
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restService: RestserviceService) {};

  // Méthodes
  // Embaucher un manager
  hireManager(manager: Palier){
    if(this.world.money >= manager.seuil){
      this.world.money-= manager.seuil;
      manager.unlocked = true;
      this.world.products[manager.idcible - 1].managerUnlocked = true;
      this.update.emit(manager);
    }
    if(this.world.managers.filter(m => !m.unlocked).length == 0){
      this.msgNoManager = "Oh non, il n'y plus de managers à embaucher !";
    }
    
    this.restService.engagerManager(manager).catch(reason =>
      console.log("Erreur: " + reason)
    );
  }
}
