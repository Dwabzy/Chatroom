import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { ChatComponent } from './chat/chat.component';



@NgModule({
  declarations: [AgentDashboardComponent, NavbarComponent, ChatComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class AgentModule { }
