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

  @Input() messages: Array<any> = [
    { message: "Hello!", time: "2021-02-14 22:10:20", user_type: "employee" },
    { message: "How may I help you?", time: "2021-02-14 22:10:24", user_type: "employee" },
    { message: "Uh, Hi! I am looking to buy a sweatshirt", time: "2021-02-14 22:10:56", user_type: "customer" },
    { message: "Where can I find them?", time: "2021-02-14 22:11:15", user_type: "customer" },
    { message: "LOL, What a moron, you don't even know where to find sweatshirts", time: "2021-02-14 22:12:20", user_type: "employee" },
    { message: "Waow, that was rude... You were the one who asked me what you can do for me.", time: "2021-02-14 22:12:51", user_type: "customer" },
    { message: "Yeah, I did ask, doesnt mean I am going to do it though. LOL", time: "2021-02-14 22:13:14", user_type: "employee" },
    { message: "I demand to speak with your manager!", time: "2021-02-14 22:13:42", user_type: "customer" },
    { message: "What is she gonna do? Fire me?", time: "2021-02-14 22:13:27", user_type: "employee" },
    { message: "Yes, I will make sure you get fired.", time: "2021-02-14 22:14:07", user_type: "customer" },
    { message: "How can I contact her?", time: "2021-02-14 22:14:43", user_type: "customer" },
    { message: "LOL, You think I am going to give you her contact info just so you can get me fired?", time: "2021-02-14 22:14:59", user_type: "employee" },
    { message: "How dumb can you be?", time: "2021-02-14 22:15:16", user_type: "employee" },
    { message: "This is extremely impolite and I will find a way to contact her.", time: "2021-02-14 22:15:33", user_type: "customer" },
    { message: "Fricking douchebag, just you wait!", time: "2021-02-14 22:15:54", user_type: "customer" },
    { message: "LMAO okay, Have a great time!", time: "2021-02-14 22:16:28", user_type: "employee" }
  ];

  @ViewChild('titleBar')titleBar!: ElementRef;
  @ViewChildren('customerMessage') customerMessages!: QueryList<ElementRef>;
  @ViewChild('chatWindow') chatWindow!: ElementRef;
  @ViewChild('textBox') textBox!: ElementRef;
  @ViewChild('chatBody') chatBody!: ElementRef;


  constructor(public activatedRoute: ActivatedRoute, private webSocketService: WebSocketService) { }
  ngAfterViewInit(): void {
    this.chatWindow.nativeElement.style.maxHeight = "0px";
    this.chatWindow.nativeElement.style.maxWidth = "0px";
  }

  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') === 'Dark' ? 'dark-theme' : 'light-theme';
    this.time();
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

  getTimeMessage = (date: Date, time: any): string => {
    
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

  time = (): void => {
    this.messages.map((message, index) => {
      // Get the string to be displayed under the message as time sent.
      let date: Date = new Date(message.time);
      let time = (new Date().getTime() - date.getTime())/1000;
      message.time = this.getTimeMessage(date, time);
      message.displayTime = true;
      let currentSender = message.user_type;
      let timeDifference = 0;
      if (this.messages[index + 1]) {
        timeDifference = Math.floor((new Date(this.messages[index + 1].time).getTime() - date.getTime()) / 60 / 1000);
      }

      /* Display Time only if the time difference between consecutive messages is greater than 5 minutes or if the sender of 2 consecutive
      messages is different */
      if (this.messages[index + 1] && currentSender === this.messages[index + 1].user_type && timeDifference < 5) {
        message.displayTime = false;
      }
   })
  }
}
