import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BigvaluePipe } from './bigvalue.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MyProgressBarComponent } from './my-progress-bar/my-progress-bar.component';
import { PopUpManagersComponent } from './pop-up-managers/pop-up-managers.component';
import { PopUpUnlocksComponent } from './pop-up-unlocks/pop-up-unlocks.component';
import { ProductComponent } from './product/product.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { PopUpUpgradesComponent } from './pop-up-upgrades/pop-up-upgrades.component';
import { PopUpAngelsComponent } from './pop-up-angels/pop-up-angels.component';
import { PopUpAboutComponent } from './pop-up-about/pop-up-about.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    BigvaluePipe,
    MyProgressBarComponent,
    PopUpManagersComponent,
    PopUpUnlocksComponent,
    ProductComponent,
    SnackBarComponent,
    PopUpUpgradesComponent,
    PopUpAngelsComponent,
    PopUpAboutComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'fr'
  }],
  bootstrap: [AppComponent],
  entryComponents: [SnackBarComponent]
})
export class AppModule { }
