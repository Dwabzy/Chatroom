import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';


@Component({
  selector: 'agent-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  displayDropdownContacts: boolean = false;
  theme: 'dark-theme' | 'light-theme' = 'light-theme';
  visitorsList: Array<any> = [];
  messages: Array<any> = [
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

  @ViewChild('dropDownButton') dropDownButton!: ElementRef;
  @ViewChild('contactList') contactList!: ElementRef;


  constructor(
    public activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver) { }
  
  ngAfterViewInit(): void {
    
  }
 
  ngOnInit(): void {
    this.theme = localStorage.getItem('theme') === "Dark" ? 'dark-theme' : 'light-theme';
    this.breakpointObserver.observe([
      '(max-width: 618px)',
    ]).subscribe( (state: BreakpointState) => {
      this.displayDropdownContacts = state.matches;
    });

   
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
