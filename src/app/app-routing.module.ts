import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { TestsLeonardoComponent } from './tests/tests-leonardo/tests-leonardo.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tests-leonardo', component: TestsLeonardoComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
