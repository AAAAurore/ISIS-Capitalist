import { Component, QueryList, ViewChildren } from '@angular/core';
import { Palier, Product, World } from './world';
import { RestserviceService } from './restservice.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpManagersComponent } from './pop-up-managers/pop-up-managers.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { PopUpUnlocksComponent } from './pop-up-unlocks/pop-up-unlocks.component';
import { ProductComponent } from './product/product.component';

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

  username: string | null;

  // Badges des boutons
  badgeCashUpgrades: number = 0;
  badgeAngelUpgrades: number = 0;
  badgeManagers: number = 0;

  // Temps écoulé
  tempsEcoule: boolean = false;

  // ViewChildren
  @ViewChildren(ProductComponent)
  productsComponent: QueryList<ProductComponent>;

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
  ngOnInit() {
    this.qtmulti = this.quantites[0];

    this.onUsernameChanged();
  }

  calcTempsEcoule() {
    for(var i = 1; i <= 5; i++) {
      setTimeout("", 1000);
      if(i == 5){
        this.tempsEcoule = true;
      }
    }
  }

  // non c'est le multiplicateur d'achat
  // ok j'ai comrpis
  changeMultiplicateur() {
    let quantite: string = this.quantites[this.quantites.indexOf(this.qtmulti) + 1];
    
    this.qtmulti = quantite == undefined ? this.quantites[0] : quantite;
  }


  onBuy(parametres: any) {
    this.world.money -= parametres.coutProduct;
    this.updateImages();

    let allUnlocks: Palier[] = this.world.allunlocks.filter(a => a.idcible == 0);
    let unlocksProduct: Palier[] = this.world.allunlocks.filter(a => a.idcible == parametres.product.id);

    allUnlocks.forEach(a => {
      let quantiteMin: number = 0;
      this.world.products.forEach(p => {
        if(p.quantite > quantiteMin){
          quantiteMin = p.quantite;
        }
      })

      if (quantiteMin >= a.seuil) {
        this.productsComponent.forEach(p => p.calcUpgrade(a));
        this.openSnackBar("AllUnlock (x" + a.ratio + " " + a.typeratio + ") de tous les produits a été débloqué !", 'Success');
      }
    })

    unlocksProduct.forEach(u => {
      if (parametres.product.quantite >= u.seuil) {
        this.productsComponent.toArray()[u.idcible - 1].calcUpgrade(u);
        this.openSnackBar("Unlock (x" + u.ratio + " " + u.typeratio + ") du produit \"" + parametres.product.name + "\" a été débloqué !", 'Success');
      }
    });
  }

  onProductionDone(parametres: any) {
    for(var i = 0; i < parametres.nbProduction; i++) {
      this.world.money += parametres.product.revenu * parametres.product.quantite;
      this.world.score += parametres.product.revenu * parametres.product.quantite;
      this.updateImages();
    }
  }

  onUsernameChanged() {
    this.username = localStorage.getItem("username") != null ? localStorage.getItem("username") : "Doctor" + Math.floor(Math.random() * 10000)!;
    localStorage.setItem("username", this.username!);
  }

  //Afficher un SnackBar
  openSnackBar(message: string, type: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      data: { message: message, snackType: type }
    });
  }

  popUpUnlocks() {
    this.dialog.open(PopUpUnlocksComponent, {
      data: {
        server: this.server,
        world: this.world
      }
    });
  }

  popUpCashUpgrades() {

  }
  
  popUpAngelUpgrades() {

  }

  popUpManagers() {
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

  popUpInvestigors() {

  }

  updateImages() {
    var cashUpgrades: Palier[] = this.world.upgrades.filter(u => u.seuil <= this.world.money);
    var angelUpgrades: Palier[] = this.world.angelupgrades.filter(a => a.seuil <= this.world.money);
    var managers: Palier[] = this.world.managers.filter(m => m.seuil <= this.world.money);

    this.badgeCashUpgrades = cashUpgrades.filter(u => !u.unlocked).length;
    this.badgeAngelUpgrades = angelUpgrades.filter(a => !a.unlocked).length;
    this.badgeManagers = managers.filter(m => !m.unlocked).length;
  }
}
