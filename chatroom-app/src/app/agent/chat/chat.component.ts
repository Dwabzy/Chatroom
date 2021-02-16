import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NgForm } from '@angular/forms';
import { WebSocketService } from 'src/app/services/web-socket.service';


@Component({
  selector: 'agent-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [NgForm]
})
export class ChatComponent implements OnInit, AfterViewInit {
  displayDropdownContacts: boolean = false;
  theme: 'dark-theme' | 'light-theme' = 'light-theme';
  visitorList: Array<any> = [];
  selectedVisitor: any;
  username: string = "";
  messages: Array<any> = [];

  @ViewChild('dropDownButton') dropDownButton!: ElementRef;
  @ViewChild('contactList') contactList!: ElementRef;
  @ViewChild('agentMessage') agentMesage!: ElementRef;


  constructor(
    public activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private webSocketService: WebSocketService) {
      this.username = this.activatedRoute.snapshot.params.username;
     }
  
  ngAfterViewInit(): void {
    
  }
 
  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') === "Dark" ? 'dark-theme' : 'light-theme';
    this.breakpointObserver.observe([
      '(max-width: 618px)',
    ]).subscribe( (state: BreakpointState) => {
      this.displayDropdownContacts = state.matches;
    });

    
    this.webSocketService.emit('get-connected-visitors-request', this.username);

    this.webSocketService.listen('receive-connected-visitors-list').subscribe((data: any) => {
      this.visitorList = data;
      console.log(data);

      if (this.visitorList.length === 1)
        this.selectVisitor(this.visitorList[0]);
    })

    this.webSocketService.listen('receive-message').subscribe((data: any) => {
      this.messages.push(data);
      console.log(data);
    })



    this.webSocketService.listen('receive-messages').subscribe((data: any) => {
      console.log("Received Message:", data);
      this.messages = data;
    });
  }

  selectVisitor = (visitor: any): void => {
    this.selectedVisitor = visitor;
    this.webSocketService.emit('get-messages', visitor.visitorId);
    this.webSocketService.emit('agent-join-room', visitor.visitorId);
    console.log(visitor);
  }

  sendMessage = (): void => {

    // Get Message from htmlElement
    let message = this.agentMesage.nativeElement.value;
    let visitor = this.selectedVisitor;
    let sender = "agent";

    this.webSocketService.emit('send-message', { message, sender, visitorId: visitor.visitorId });
    this.webSocketService.emit('get-messages', visitor.visitorId);
  }


  toggleDropDown() {
    // Rotate the drop down button
    this.dropDownButton.nativeElement.classList.toggle("rotate");

    // Toggle Collapse of Contact List
    if (this.contactList.nativeElement.style.maxHeight) {
      this.contactList.nativeElement.style.maxHeight = null;
    } else {
      this.contactList.nativeElement.style.maxHeight = this.contactList.nativeElement.scrollHeight + "px";
    }
  }
}
