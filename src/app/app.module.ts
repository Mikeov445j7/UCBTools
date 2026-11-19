import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SelectorSedeComponent } from '../../libraries/selector-sede';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { TestsModule } from './tests/tests.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SelectorSedeComponent,
    TestsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
