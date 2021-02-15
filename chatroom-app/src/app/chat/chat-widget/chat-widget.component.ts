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

  @Input() messages: Array<any> = [];

  @ViewChild('titleBar')titleBar!: ElementRef;
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

    this.webSocketService.listen('connected-message').subscribe(data => {
      console.log(data);
      localStorage.setItem('chatDetails', JSON.stringify(data));
    })

    this.webSocketService.listen('receive-agent-message').subscribe((data: any) => {
      let { message, sender, time } = data;
      console.log(data);
      this.messages.push(
        {
          message,
          sender,
          time: this.getTimeMessage(time),
        }
      )

    })
  }

  sendMessage = (): void => {
    let message = this.visitorMessage.nativeElement.value;
    let chatDetails = JSON.parse(<string>localStorage.getItem('chatDetails'));
    this.messages.push(
      {message: message, sender: "visitor", time: ""}
    )
    this.webSocketService.emit('visitor-message', { chatDetails, message });
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

  getTimeMessage = (dateTime: string): string => {
    let date: Date = new Date(dateTime);
      let time = (new Date().getTime() - date.getTime())/1000;
    // Algorithm to display time
    let localDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear().toLocaleString().slice(3);
    let localTime;
    if (date.getHours() < 12)
      localTime = date.getHours() + ":" + date.getMinutes() + " am";
    else
      localTime = (date.getHours() % 12) + ":" + date.getMinutes() + " pm";

    // let seconds = Math.floor(time % 60);
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600) % 24;
    let days = Math.floor(time / (24 * 3600)) % 30;
    if (days > 0) {
      return localDate + " " + localTime;
    }
    else if (hours > 0 || minutes > 1) {
      return localTime;
    }
    else if (minutes === 1) {
      return minutes + " minute ago"
    }
    else{
      return "Just now";
    }
  }
}
