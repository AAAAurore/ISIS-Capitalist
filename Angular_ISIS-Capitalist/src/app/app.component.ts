import { Component, QueryList, ViewChildren } from '@angular/core';
import { Palier, Product, World } from './world';
import { RestserviceService } from './restservice.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpManagersComponent } from './pop-up-managers/pop-up-managers.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { PopUpUnlocksComponent } from './pop-up-unlocks/pop-up-unlocks.component';
import { ProductComponent } from './product/product.component';
import { PopUpUpgradesComponent } from './pop-up-upgrades/pop-up-upgrades.component';

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

  username: string = "";

  // Badges des boutons
  badgeUpgrades: number = 0;
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

    let userStocke = localStorage.getItem("username");

    if (!userStocke) {
      userStocke = "Doctor" + Math.floor(Math.random() * 10000);
    }

    this.username = userStocke;
    localStorage.setItem("username", this.username);
    this.restService.setUser(this.username);
  }

  // Calculer le temps écoulé du chargement de serveur afin d'afficher le message d'erreur si nécessaire
  calcTempsEcoule() {
    for(var i = 1; i <= 5; i++) {
      setTimeout("", 1000);
      if(i == 5){
        this.tempsEcoule = true;
      }
    }
  }

  // Changer le multiplicateur
  changeMultiplicateur() {
    let quantite: string = this.quantites[this.quantites.indexOf(this.qtmulti) + 1];
    
    this.qtmulti = quantite == undefined ? this.quantites[0] : quantite;
  }

  // Acheter + Contrôler les Unlocks + Upgrades + Angels Upgrades
  onBuy(parametres: any) {
    this.world.money -= parametres.coutProduct;
    this.updateBadges();

    let allUnlocks: Palier[] = this.world.allunlocks.filter(a => a.idcible == 0);
    let unlocksProduct: Palier[] = this.world.allunlocks.filter(a => a.idcible == parametres.product.id);

    allUnlocks.forEach(a => {
      let quantiteMin: number = 0;
      this.world.products.forEach((p, index) => {
        if(index == 0 || p.quantite < quantiteMin){
          quantiteMin = p.quantite;
        }
      })

      if (quantiteMin >= a.seuil) {
        this.productsComponent.forEach(p => p.calcUpgrade(a));
        this.openSnackBar("AllUnlock (x" + a.ratio + " " + a.typeratio + ") pour tous les produits a été débloqué !", 'Success');
      }
    })

    unlocksProduct.forEach(u => {
      if (parametres.product.quantite >= u.seuil) {
        this.productsComponent.toArray()[u.idcible - 1].calcUpgrade(u);
        this.openSnackBar("Unlock (x" + u.ratio + " " + u.typeratio + ") du produit \"" + parametres.product.name + "\" a été débloqué !", 'Success');
      }
    });
  }

  // Produire
  onProductionDone(parametres: any) {
    for(var i = 0; i < parametres.nbProduction; i++) {
      this.world.money += parametres.product.revenu * parametres.product.quantite;
      this.world.score += parametres.product.revenu * parametres.product.quantite;
      this.updateBadges();
    }
  }

  // Changer de nom d'utilisateur
  onUsernameChanged() {
   localStorage.setItem("username", this.username);
   this.restService.setUser(this.username);
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

  // Afficher le pop-up des Unlocks
  popUpUnlocks() {
    this.dialog.open(PopUpUnlocksComponent, {
      data: {
        server: this.server,
        world: this.world
      }
    });
  }

  // Afficher le pop-up des Upgrades
  popUpUpgrades(type: string) {
    let typeUpgrades: Palier[] = [];
    let titre: string = '';
    let message: string = '';

    if(type != 'ANGE'){
      typeUpgrades = this.world.upgrades;
      titre = 'Cash Upgrades';
      message = 'Il faut dépenser de l\'argent pour gagner de l\'argent ! Achetez ces mises à niveau de qualité supérieure pour donner un coup de pouce à vos entreprises.';
    }
    else{
      typeUpgrades = this.world.angelupgrades;
      titre = 'Angel Upgrades';
      message = 'Il ne peut y avoir de progrès sans sacrifice. Ces mises à niveau coûtent aux investisseurs providentiels !';
    }

    const dialogRef = this.dialog.open(PopUpUpgradesComponent, {
        data: {
          server: this.server,
          world: this.world,
          upgrades: typeUpgrades,
          type: type,
          titre: titre,
          message: message
        }
      });

    dialogRef.componentInstance.update.subscribe((upgrade) => {
      this.updateBadges();

      let message: string = "";

      if(upgrade.idcible == 0) {
        this.productsComponent.forEach(p => p.calcUpgrade(upgrade));
        message = "AllUpgrade " + upgrade.name + "\" pour tous les produits a été acheté avec succès !";
      }
      else {
        this.productsComponent.toArray()[upgrade.idcible - 1].calcUpgrade(upgrade);
        message = "Upgrade " + upgrade.name + "\" du produit \"" + this.world.products[upgrade.idcible - 1].name + "\" a été acheté avec succès !";
      }
      this.openSnackBar(message, 'Success');
    });
  }

  // Afficher le pop-up des managers
  popUpManagers() {
    const dialogRef = this.dialog.open(PopUpManagersComponent, {
      data: {
        server: this.server,
        world: this.world
      }
    });

    dialogRef.componentInstance.update.subscribe((manager) => {
      this.updateBadges()
      this.openSnackBar("Le manager " + manager.name + " du produit \"" + this.world.products[manager.idcible - 1].name + "\" a été embauché avec succès !", 'Success');
    });
  }

  // Afficher le pop-up des investisseurs
  popUpInvestigors() {

  }

  // Actualiser les badges
  updateBadges() {
    var upgrades: Palier[] = this.world.upgrades.filter(u => u.seuil <= this.world.money);
    var angelUpgrades: Palier[] = this.world.angelupgrades.filter(a => a.seuil <= this.world.activeangels);
    var managers: Palier[] = this.world.managers.filter(m => m.seuil <= this.world.money);

    this.badgeUpgrades = upgrades.filter(u => !u.unlocked).length;
    this.badgeAngelUpgrades = angelUpgrades.filter(a => !a.unlocked).length;
    this.badgeManagers = managers.filter(m => !m.unlocked).length;
  }
}
