import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NgForm } from '@angular/forms';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { TimeService } from 'src/app/services/time.service';


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
  selectedMessages: Array<any> = [];

  @ViewChild('dropDownButton') dropDownButton!: ElementRef;
  @ViewChild('contactList') contactList!: ElementRef;
  @ViewChild('agentMessage') agentMessage!: ElementRef;
  @ViewChild('messageContainer') messageContainer!: ElementRef;


  constructor(
    public activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private webSocketService: WebSocketService,
    private timeService: TimeService) {
    this.username = this.activatedRoute.snapshot.params.username;
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') === "Dark" ? 'dark-theme' : 'light-theme';
    this.breakpointObserver.observe([
      '(max-width: 618px)',
    ]).subscribe((state: BreakpointState) => {
      this.displayDropdownContacts = state.matches;
    });


    this.webSocketService.emit('get-connected-visitors-request', this.username);

    this.webSocketService.listen('receive-connected-visitors-list').subscribe((data: any) => {
      this.visitorList = data;
    })

    this.webSocketService.listen('receive-message').subscribe((data: any) => {
      this.messages.push(data);
      let visitorChat = this.messages.find(visitorChat => { return visitorChat.visitorId === data.visitorId });

      let index = this.messages.indexOf(visitorChat);
      this.messages[index].messages.push(data);

      let currentMessageIndex = this.messages.length - 1;
      let previousMessageIndex = currentMessageIndex - 1;
      this.messages[previousMessageIndex].timeMessage = this.timeService.getTimeMessage(this.messages[previousMessageIndex].time);

      let currentMessageSender = this.messages[currentMessageIndex].sender;
      let previousMessageSender = this.messages[previousMessageIndex].sender;

      let timeDifference = 0;
      timeDifference = Math.floor((
        new Date(this.messages[currentMessageIndex].time).getTime() -
        new Date(this.messages[previousMessageIndex].time).getTime()) / 1000 / 60);

      this.messages[previousMessageIndex].displayTime = !(currentMessageSender === previousMessageSender && timeDifference < 5);

      setTimeout(() => {
        if (currentMessageIndex === this.messages.length - 1) {
          this.messages[currentMessageIndex].timeMessage = "1 minute ago";
        }
      }, 60000)
      setTimeout(() => {
        if (currentMessageIndex === this.messages.length - 1) {
          this.messages[currentMessageIndex].timeMessage = this.timeService.getTimeMessage(this.messages[previousMessageIndex].time);
        }
      }, 120000)

      setTimeout(() => { this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight; });
    })

    // Get messages of all users who are online.
    this.webSocketService.emit('get-all-messages', this.username);
    this.webSocketService.listen('receive-all-messages').subscribe((data: any) => {
      this.messages = data;
      console.log(data);
      // Scroll to the bottom of the container when new messages are received.
      setTimeout(() => { this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight; });
    });



    this.webSocketService.listen('receive-messages').subscribe((data: any) => {
      this.selectedMessages = data;
      // Scroll to the bottom of the container when new messages are received.
      setTimeout(() => { this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight; });
    });
  }



  selectVisitor = (visitor: any): void => {
    this.selectedVisitor = visitor;
    this.selectedMessages = this.messages.find(visitorChat => { return visitorChat.visitorId === visitor.visitorId }).messages;

    this.webSocketService.emit('agent-join-room', visitor.visitorId);
  }

  sendMessage = (): void => {

    // Get Message from htmlElement
    let message = this.agentMessage.nativeElement.value;
    if (message.trim() != '') {
      let visitor = this.selectedVisitor;
      let sender = "agent";

      this.webSocketService.emit('send-message', { message, sender, chatroomName: "", visitorId: visitor.visitorId });
    }

    // Empty input field after sending message.
    this.agentMessage.nativeElement.value = "";
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
