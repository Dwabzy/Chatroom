import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AgentDashboardComponent } from './agent/agent-dashboard/agent-dashboard.component';
import { ChatWidgetComponent } from './chat/chat-widget/chat-widget.component';
import { HomepageModule } from './homepage/homepage.module';
import { HomepageComponent } from './homepage/homepage/homepage.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: HomepageComponent },
  { path: 'signup', component: HomepageComponent },
  { path: 'agent-dashboard/:username', component: AgentDashboardComponent },
  { path: 'agent-dashboard/:username/chat', component: AgentDashboardComponent },
  { path: 'admin-dashboard/:username', component: AdminDashboardComponent },
  { path: 'admin-dashboard/:username/create-chatroom', component: AdminDashboardComponent },
  { path: 'admin-dashboard/:username/chatrooms', component: AdminDashboardComponent },
  { path: 'chat/:chatroomName', component: ChatWidgetComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomepageModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
