import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BombComponent,
  IncreaseTimeComponent, 
  SeaBattleComponent, 
  UnitContainerComponent } from './components';
import { MainPageComponent } from './pages';

@NgModule({
  declarations: [
    AppComponent,
    SeaBattleComponent,
    BombComponent,
    IncreaseTimeComponent,
    MainPageComponent,
    UnitContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
