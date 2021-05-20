import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { SeaBattleComponent } from './components';
import { MainPageComponent } from './pages';

const rootRoute = { path: '', component: MainPageComponent }
const notFoundRoute = { path: '**', redirectTo: '/', pathMatch: 'full' }

const routes: Routes = [
    rootRoute,
    { path: 'sea-battle', component: SeaBattleComponent },
    notFoundRoute,
];

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
