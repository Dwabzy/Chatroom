import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatroomService } from 'src/app/services/chatroom.service';

@Component({
  selector: 'create-chatroom',
  templateUrl: './create-chatroom.component.html',
  styleUrls: ['./create-chatroom.component.scss'],
  providers: [NgForm]
})
export class CreateChatroomComponent implements OnInit {
  theme: string = "default";
  entityList: Array<string> = [];
  chatroomCreationStatus!: boolean;
  @ViewChild('entity') entityElement!: ElementRef;

  constructor(public ngForm: NgForm, public chatroomService: ChatroomService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

  }

  createEntity = (): void => {
    let entityName = this.entityElement.nativeElement.value;
    if (entityName)
      this.entityList.push(entityName);
  }

  removeEntity = (entity: string): void => {
    let index = this.entityList.indexOf(entity);
    this.entityList.splice(index, 1);
  }

  selectTheme = (event: any): void => {
    this.theme = event.target.value;
    console.log(this.theme);
  }

  onSubmit = (form: NgForm): void => {
    this.chatroomService.chatroom.username = this.activatedRoute.snapshot.params.username;
    this.chatroomService.chatroom.chatboxTheme = this.chatroomService.theme;
    this.chatroomService.chatroom.entityList.list = this.entityList;
    this.chatroomService.createChatroom(this.chatroomService.chatroom).subscribe(
      (res: any) => {
        this.chatroomCreationStatus = res;

      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
