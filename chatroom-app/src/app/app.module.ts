import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { UserAuthService } from './services/user-auth.service';
import {  HttpClientModule } from '@angular/common/http';
import { AdminModule } from './admin/admin.module';
import { AgentModule } from './agent/agent.module';
import { HomepageModule } from './homepage/homepage.module';
import { MaterialModule } from './material/material.module';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AdminModule,
    AgentModule,
    HomepageModule,
    MaterialModule
  ],
  exports: [],
  providers: [UserAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
