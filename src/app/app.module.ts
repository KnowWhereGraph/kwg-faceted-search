import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { IndexComponent } from './index/index.component';
import { ExploreComponent } from './explore/explore.component';
import { SearchComponent } from './search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table'
import {MatTabsModule} from '@angular/material/tabs';
import { PlacesTableComponent } from './places-table/places-table.component'
import {MatPaginatorModule} from '@angular/material/paginator';
import { FacetsComponent } from './facets/facets.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HazardsTableComponent } from './hazards-table/hazards-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    NavComponent,
    FooterComponent,
    IndexComponent,
    ExploreComponent,
    SearchComponent,
    PlacesTableComponent,
    FacetsComponent,
    HazardsTableComponent
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule.forRoot([
    {path: '', component: IndexComponent},
    {path: 'about', component: AboutComponent},
    {path: 'explore', component: ExploreComponent},
    {path: 'search', component: SearchComponent},

  ]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
