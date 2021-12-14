import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    TranslateModule
  ],
  declarations: [TabsPage],
  providers:[TranslateService] //hay que meterlo en cada pagina que vaya a usar el translate service (traductor)
})
export class TabsPageModule {}
