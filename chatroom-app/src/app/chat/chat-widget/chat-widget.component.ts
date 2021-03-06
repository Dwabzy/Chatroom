import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimeService } from 'src/app/services/time.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss']
})
export class ChatWidgetComponent implements OnInit, AfterViewInit {
  isDark: boolean = false;
  theme: 'dark-theme' | 'light-theme' = 'light-theme';
  visitorsName: string = "";
  toggleChatWindow: boolean = false;
  chatroomName: string = "";

  agentName: string = "Bot";
  visitorId: string = "";

  @Input() messages: Array<any> = [];

  @ViewChild('titleBar') titleBar!: ElementRef;
  @ViewChildren('customerMessage') customerMessages!: QueryList<ElementRef>;
  @ViewChild('chatWindow') chatWindow!: ElementRef;
  @ViewChild('textBox') textBox!: ElementRef;
  @ViewChild('chatBody') chatBody!: ElementRef;
  @ViewChild('visitorMessage') visitorMessage!: ElementRef;

 
  constructor(public activatedRoute: ActivatedRoute, private webSocketService: WebSocketService, private timeService: TimeService) { }
  ngAfterViewInit(): void {
    this.chatWindow.nativeElement.style.maxHeight = "0px";
    this.chatWindow.nativeElement.style.maxWidth = "0px";
  }


  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') === 'Dark' ? 'dark-theme' : 'light-theme';
    this.chatroomName = this.activatedRoute.snapshot.params.chatroomName;
    this.webSocketService.emit('new-visitor', this.chatroomName);


    this.webSocketService.listen('agent-connected').subscribe((data: any) => {
      console.log(data);
      this.agentName = data.username;
    })

    this.webSocketService.listen('visitor-details').subscribe((data: any) => {
      if (data.agentName)
        this.agentName = data.agentName;

      let object = { username: "", agentId: "", visitorId: data.visitorId, visitorName: data.visitorName, chatroomName: data.chatroomName };
    })

    this.webSocketService.listen('receive-message').subscribe((data: any) => {
      this.messages.push(data);

      // Set Display Time for previous messages
      let currentMessageIndex = this.messages.length - 1;
      let previousMessageIndex = currentMessageIndex - 1;
      this.messages[previousMessageIndex].timeMessage = this.timeService.getTimeMessage(this.messages[previousMessageIndex].time);

      let currentMessageSender = this.messages[currentMessageIndex].sender;
      let previousMessageSender = this.messages[previousMessageIndex].sender;

      let timeDifference = 0;
      timeDifference = Math.floor((
        new Date(this.messages[currentMessageIndex].time).getTime() -
        new Date(this.messages[previousMessageIndex].time).getTime()) / 1000 / 60);

      setTimeout(() => {
        if (currentMessageIndex === this.messages.length - 1) {
          this.messages[currentMessageIndex].timeMessage = "1 minute ago";
        }
      }, 60000)
      setTimeout(() => {
        if (currentMessageIndex === this.messages.length - 1) {
          this.messages[currentMessageIndex].timeMessage = this.timeService.getTimeMessage(this.messages[previousMessageIndex].time);
        }
      }, 120000);
      this.messages[previousMessageIndex].displayTime = !(currentMessageSender === previousMessageSender && timeDifference < 5);

      // Scroll down
      setTimeout(() => { this.chatBody.nativeElement.scrollTop = (this.chatBody.nativeElement.scrollHeight); })

    });

    this.webSocketService.listen('receive-messages').subscribe((data: any) => {
      this.messages = data;

      // Scroll down
      setTimeout(() => { this.chatBody.nativeElement.scrollTop = (this.chatBody.nativeElement.scrollHeight); })
    });
  }

  // When the visitor disconnects from the page, emit to backend.
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.webSocketService.emit('disconnect-visitor', this.visitorId);
  }

  sendMessage = (): void => {
    let message = this.visitorMessage.nativeElement.value;
    let chatroomName = this.activatedRoute.snapshot.params.chatroomName;
    if (message.trim() !== '') {
      let sender = "visitor";
      this.webSocketService.emit('send-message', { message, sender, chatroomName });
    }
    // Empty the input field after sending message
    this.visitorMessage.nativeElement.value = "";
  }

  toggleChatWindowHandler = (): void => {
    this.toggleChatWindow = !this.toggleChatWindow;
    if (this.toggleChatWindow) {
      this.chatWindow.nativeElement.style.maxHeight = "600px";
      this.chatWindow.nativeElement.style.maxWidth = "400px";
    }
    else {
      this.chatWindow.nativeElement.style.maxHeight = "0px";
      this.chatWindow.nativeElement.style.maxWidth = "0px";
    }
  }

  toggleTheme = (): void => {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? "Dark" : "Light");
    if (this.isDark)
      document.body.setAttribute('data-theme', 'dark');
    else
      document.body.setAttribute('data-theme', 'light');
  }

}
