import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BombComponent,
  ChooseUnitDialog,
  IncreaseTimeComponent, 
  ReduceTimeComponent, 
  SeaBattleComponent, 
  SeaBattleSettingsComponent, 
  TextComponent, 
  UnitContainerComponent } from './components';
import { MainPageComponent } from './pages';
import { MessageBoxDialog } from './helpers/message-box/message-box.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FileUploadComponent } from './helpers/file-upload/file-upload';
import { DndDirective } from './helpers/file-upload/dnd.directive';
import { SanitizeUrlPipe } from './helpers/sanitize-url/sanitize-url.pipe';
import { CustomHttpInterceptor } from './services/custom.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SeaBattleComponent,
    SeaBattleSettingsComponent,
    BombComponent,
    IncreaseTimeComponent,
    MainPageComponent,
    UnitContainerComponent,
    ReduceTimeComponent,
    TextComponent,

    SanitizeUrlPipe,
    DndDirective,
    FileUploadComponent,

    MessageBoxDialog,
    ChooseUnitDialog,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  entryComponents: [
    MessageBoxDialog,
    ChooseUnitDialog,
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: CustomHttpInterceptor,
        multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
