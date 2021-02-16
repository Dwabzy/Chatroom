import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  @Input() messages: Array<any> = [];

  @ViewChild('titleBar') titleBar!: ElementRef;
  @ViewChildren('customerMessage') customerMessages!: QueryList<ElementRef>;
  @ViewChild('chatWindow') chatWindow!: ElementRef;
  @ViewChild('textBox') textBox!: ElementRef;
  @ViewChild('chatBody') chatBody!: ElementRef;
  @ViewChild('visitorMessage') visitorMessage!: ElementRef;


  constructor(public activatedRoute: ActivatedRoute, private webSocketService: WebSocketService) { }
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
      localStorage.setItem('agent-details', JSON.stringify(data));
    })

    this.webSocketService.listen('receive-message').subscribe((data: any) => {
      this.messages.push(data);
      console.log(this.messages);
    });

    this.webSocketService.listen('receive-messages').subscribe((data: any) => {
      this.messages = data;
      console.log(this.messages);
    });

    
  }

  sendMessage = (): void => {
    let message = this.visitorMessage.nativeElement.value;
    let sender = "visitor";
    let { visitorId } = JSON.parse(<string>localStorage.getItem('agent-details'));
    this.webSocketService.emit('send-message', { message, sender, visitorId: visitorId });
    this.webSocketService.emit('get-messages', visitorId);
  }

  toggleChatWindowHandler = (): void => {
    this.toggleChatWindow = !this.toggleChatWindow;
    if (this.toggleChatWindow){
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
