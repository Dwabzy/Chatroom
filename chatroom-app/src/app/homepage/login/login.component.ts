import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'homepage-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgForm]
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  messageStatus: string = "";
  displayLabel: boolean = false;


  @ViewChild('messageLabel') messageLabel!: ElementRef;


  constructor(public ngForm: NgForm, public userAuthService: UserAuthService, private router: Router) { }


  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    // Check if the username field has been entered.
    if (form.value.usernameEmail === "" || form.value.password === "") {
      this.messageLabel.nativeElement.className = "info-label warn";
      this.messageStatus = "Please check if you have entered the credentials";
      return;
    }
    this.userAuthService.login(form.value).subscribe(
      res => {
        let { responseMessage, responseStatus, responseType, isAdmin, username } = JSON.parse(JSON.stringify(res))
        this.messageStatus = responseMessage;
        if (responseStatus) {
          // Display Success Message
          this.messageLabel.nativeElement.className = "info-label success";

          setTimeout(() => {
            // Redirect to admin Dashboard if user is an admin else to Employee Dashboard.
            if (isAdmin === 0)
              this.router.navigateByUrl(`/agent-dashboard/${username}`);
            else this.router.navigateByUrl(`/admin-dashboard/${username}`);
          }, 2000);
        } else {
          // Display Warning or Error Messages.
          this.messageLabel.nativeElement.className = "info-label " + responseType;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  removeLabel = (): void => {
    this.messageLabel.nativeElement.className = "info-label invis";
    this.messageStatus = "";
  }

}
