import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWidgetComponent } from './chat-widget/chat-widget.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ChatWidgetComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [ChatWidgetComponent]
})
export class ChatModule { }
