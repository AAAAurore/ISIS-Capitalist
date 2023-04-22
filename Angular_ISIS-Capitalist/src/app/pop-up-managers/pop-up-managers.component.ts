import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Palier, Product, World } from '../world';

@Component({
  selector: 'app-pop-up-managers',
  templateUrl: './pop-up-managers.component.html',
  styleUrls: ['./pop-up-managers.component.css']
})
export class PopUpManagersComponent {

  server: string = this.data.server;

  world: World = this.data.world;

  msgNoManager: string = "";
  
  // Outputs
  @Output()
  update: EventEmitter<Palier> = new EventEmitter<Palier>();

  // Constructeur
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {};

  // Méthodes
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
  }
}
