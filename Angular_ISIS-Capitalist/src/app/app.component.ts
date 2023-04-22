import { Component } from '@angular/core';
import { Palier, Product, World } from './world';
import { RestserviceService } from './restservice.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpManagersComponent } from './pop-up-managers/pop-up-managers.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar/snack-bar.component';

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

  // Badges des boutons
  badgeUnlocks: number = 0;
  badgeCashUpgrades: number = 0;
  badgeAngelUpgrades: number = 0;
  badgeManagers: number = 0;

  // Constructeur
  constructor(
    private restService: RestserviceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
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
    this.updateImages();
  }

  onProductionDone(p: Product){
    this.world.money += p.revenu * p.quantite;
    this.world.score += p.revenu * p.quantite;
    this.updateImages();
  }

  openSnackBar(message: string, type: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: { message: message, snackType: type }
    });
  }

  popUpUnlocks(){

  }

  popUpCashUpgrades(){

  }
  
  popUpAngelUpgrades(){

  }

  popUpManagers(){
    const dialogRef = this.dialog.open(PopUpManagersComponent, {
      data: {
        server: this.server,
        world: this.world
      }
    });

    dialogRef.componentInstance.update.subscribe((manager) => {
      this.updateImages()
      this.openSnackBar("Le manager " + manager.name + " du produit \"" + this.world.products[manager.idcible - 1].name + "\" a été embauché !", 'Success');
    });
  }

  popUpInvestigors(){

  }

  updateImages(){
    var unlocks: Palier[] = this.world.allunlocks.filter(u => u.seuil <= this.world.money);
    var cashUpgrades: Palier[] = this.world.upgrades.filter(u => u.seuil <= this.world.money);
    var angelUpgrades: Palier[] = this.world.angelupgrades.filter(a => a.seuil <= this.world.money);
    var managers: Palier[] = this.world.managers.filter(m => m.seuil <= this.world.money);

    this.badgeUnlocks = unlocks.filter(u => !u.unlocked).length;
    this.badgeCashUpgrades = cashUpgrades.filter(u => !u.unlocked).length;
    this.badgeAngelUpgrades = angelUpgrades.filter(a => !a.unlocked).length;
    this.badgeManagers = managers.filter(m => !m.unlocked).length;
  }
}
