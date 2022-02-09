import { AboutComponent } from './about/about.component';
import { AppComponent  } from './app.component';
import { ExploreComponent } from './explore/explore.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultSearchComponent } from './result-search/result-search.component';

const routes: Routes = [
  {path:'', component: AppComponent},
  {path: 'about', component: AboutComponent},
  {path: 'explore', component: ExploreComponent},
  {path: 'result_search', component: ResultSearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
