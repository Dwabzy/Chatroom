import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { CreateChatroomComponent } from './create-chatroom/create-chatroom.component';
import { ChatModule } from '../chat/chat.module';
import { FormsModule } from '@angular/forms';
import { DisplayChatroomsComponent } from './display-chatrooms/display-chatrooms.component';
import { ChatroomStatsComponent } from './chatroom-stats/chatroom-stats.component';



@NgModule({
  declarations: [AdminDashboardComponent, NavbarComponent, CreateChatroomComponent, DisplayChatroomsComponent, ChatroomStatsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ChatModule,
    FormsModule
  ],
  
})
export class AdminModule { }
