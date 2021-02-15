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
  messages: Array<any> = [];

  @ViewChild('dropDownButton') dropDownButton!: ElementRef;
  @ViewChild('contactList') contactList!: ElementRef;
  @ViewChild('agentMessage') agentMesage!: ElementRef;


  constructor(
    public activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private webSocketService: WebSocketService) { }
  
  ngAfterViewInit(): void {
    
  }
 
  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') === "Dark" ? 'dark-theme' : 'light-theme';
    this.breakpointObserver.observe([
      '(max-width: 618px)',
    ]).subscribe( (state: BreakpointState) => {
      this.displayDropdownContacts = state.matches;
    });

    let username = this.activatedRoute.snapshot.params.username;
    this.webSocketService.emit('get-connected-visitors-request', username);

    this.webSocketService.listen('send-connnected-visitors').subscribe((data: any) => {
      this.visitorList = data;
      console.log(this.visitorList);
    })

    this.webSocketService.listen('new-visitor-socket-id').subscribe((data: any) => {
      let { visitorName, visitorSocketId } = data;

      let visitorId = visitorName.slice(-4);
      let visitor = this.visitorList.find(visitorChat => visitorChat.visitorId === visitorId);
      let index = this.visitorList.indexOf(visitor);

      // Update new VistorSocketID  in LocalStore and Visitors List.
      let chatDetails = JSON.parse(<string>localStorage.getItem('chatDetails'));
      chatDetails.visitorSocketId = visitorSocketId;
      chatDetails.visitorId = visitorId;
      localStorage.setItem('chatDetails', JSON.stringify(chatDetails));
      if(index !== -1)
        this.visitorList[index].visitorSocketId = visitorSocketId;
    })

    this.webSocketService.listen('receive-visitor-message').subscribe((data: any) => {
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


  sendMessage = (): void => {
    let message = this.agentMesage.nativeElement.value;
    let chatDetails = JSON.parse(<string>localStorage.getItem('chatDetails'));
    chatDetails.agentSocketId = this.webSocketService.socket.id;
    this.messages.push(
      {message: message, sender: "agent", time: ""}
    )
    this.webSocketService.emit('agent-message', { chatDetails, message });
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
