import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { IndexComponent } from './index/index.component';
import { SearchComponent } from './search/search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs';
import { PlacesTableComponent } from './places-table/places-table.component'
import { MatPaginatorModule } from '@angular/material/paginator';
import { FacetsComponent } from './facets/facets.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HazardsTableComponent } from './hazards-table/hazards-table.component';
import { HttpClientModule } from '@angular/common/http';
import { PeopleTableComponent } from './people-table/people-table.component';
import { MapComponent } from './map/map.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { FormsModule } from '@angular/forms';
import { TreeModule } from '@circlon/angular-tree-component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    FooterComponent,
    IndexComponent,
    SearchComponent,
    PlacesTableComponent,
    FacetsComponent,
    HazardsTableComponent,
    PeopleTableComponent,
    MapComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FormsModule,
    TreeModule,
    RouterModule.forRoot([
    {path: '', component: IndexComponent},
    {path: 'search', component: SearchComponent},

  ]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }