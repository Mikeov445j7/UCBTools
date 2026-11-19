import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SelectorSedeComponent } from '../../libraries/selector-sede';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { TestsModule } from './tests/tests.module';
import { TestMikeComponent } from './testMike/testMike.component';
import { PruebasComponent } from './tests/tests-leonardo/pruebas/pruebas.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestMikeComponent,
      PruebasComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SelectorSedeComponent,
    TestsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
