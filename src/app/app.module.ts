import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SolveComponent } from './pages/solve/solve.component';
import { PlayComponent } from './pages/play/play.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimerPipe } from './pipes/timer.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SolveComponent,
    PlayComponent,
    TimerPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
