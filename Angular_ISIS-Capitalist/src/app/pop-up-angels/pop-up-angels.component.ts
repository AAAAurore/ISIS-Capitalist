import { Component, Inject } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { World } from '../world';

@Component({
  selector: 'app-pop-up-angels',
  templateUrl: './pop-up-angels.component.html',
  styleUrls: ['./pop-up-angels.component.css']
})
export class PopUpAngelsComponent {

  // Côté serveur
  server: string = this.data.server;

  // Monde
  world: World = this.data.world;

  // Anges supplémentaires
  angelSupplements: number = 150 * Math.sqrt(this.world.score / Math.pow(10, 15)) - this.world.totalangels;

  // Constructeur
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restService: RestserviceService) {};
  
  //Méthode
  // Initialiser le monde
  reset() {
    this.restService.resetWorld().catch(reason =>
      console.log("Erreur: " + reason)
    );
    location.reload();
  }
}
