import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './pages/play/play.component';
import { SolveComponent } from './pages/solve/solve.component';

const routes: Routes = [
  {path: 'solve', component: SolveComponent},
  {path: 'play', component: PlayComponent},
  {path: '**', redirectTo: 'play'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
