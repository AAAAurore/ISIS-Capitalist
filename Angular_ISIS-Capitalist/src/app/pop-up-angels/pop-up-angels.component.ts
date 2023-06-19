import { Component, Inject } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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

  //Message de confirmation
  confirmationTitle : string = "Attention";
  confirmationMessage : string = "Êtes-vous certain de vouloir réinitialiser le monde ?";

  // Constructeur
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restService: RestserviceService,
    public dialog: MatDialog) {};
  
  //Méthode
  // Initialiser le monde
  reset() {
    this.restService.resetWorld().catch(reason =>
      console.log("Erreur : " + reason)
    );
    this.confirmationTitle = "Réinitialisation en cours";
    this.confirmationMessage = "Veuillez patienter quelques instants.";

    let ouiButton = <HTMLInputElement> document.getElementById("oui");
    let nonButton = <HTMLInputElement> document.getElementById("non");
    ouiButton.style.visibility= 'hidden';
    nonButton.style.visibility= 'hidden';

    setTimeout(() => {
      location.reload();
    }, 3000);
  }
}
