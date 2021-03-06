import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { IconComponent } from './icon/icon.component';



@NgModule({
  declarations: [ChatWidgetComponent, IconComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [ChatWidgetComponent, IconComponent]
})
export class ChatModule { }
