import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { ChatComponent } from './chat/chat.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { FormsModule } from '@angular/forms';
import { ChatModule } from '../chat/chat.module';



@NgModule({
  declarations: [AgentDashboardComponent, NavbarComponent, ChatComponent, VisitorsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ChatModule
  ]
})
export class AgentModule { }
