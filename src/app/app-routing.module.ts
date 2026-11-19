import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { TestsLeonardoComponent } from './tests/tests-leonardo/tests-leonardo.component';
import { TestMikeComponent } from './testMike/testMike.component';
import { PruebasComponent } from './tests/tests-leonardo/pruebas/pruebas.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tests-leonardo', component: TestsLeonardoComponent },
  { path: 'tests-mike', component: TestMikeComponent },
  { path: 'pruebas', component: PruebasComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
