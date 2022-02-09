import { AboutComponent } from './about/about.component';
import { AppComponent  } from './app.component';
import { ExploreComponent } from './explore/explore.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', component: AppComponent},
  {path: 'about', component: AboutComponent},
  {path: 'explore', component: ExploreComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
