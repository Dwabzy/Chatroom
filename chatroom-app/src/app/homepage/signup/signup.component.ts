import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, NgModel, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';



@Component({
  selector: 'homepage-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [UserAuthService, NgModel]
})
export class SignupComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  messageStatus: string = "";
  submitted: boolean = false;

  @ViewChild('messageLabel') messageLabel!: ElementRef;

  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(public userAuthService: UserAuthService, private router: Router) { }

  ngOnInit(): void {
  }


  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      this.messageLabel.nativeElement.className = "info-label warn";
      this.messageStatus = "Pleace check your credentials"
    }
    this.userAuthService.signup(form.value).subscribe(
      res => {
        let { responseStatus, existenceData } = JSON.parse(JSON.stringify(res))

        // Shows success label if sign up was successful else shows the error message.
        if (responseStatus) {
          this.messageLabel.nativeElement.className = "info-label success";
          this.messageStatus = "Signup Successful"
          setTimeout(() => {
            this.router.navigateByUrl(`/`);
          }, 2000);
        } else {
          this.messageLabel.nativeElement.className = "info-label error";
          if (existenceData.usernameExists && existenceData.emailExists) {
            this.messageStatus = "Username and Email already exist";
          }
          else if (existenceData.emailExists) {
            this.messageStatus = "Email already exists";
          }
          else if (existenceData.usernameExists) {
            this.messageStatus = "Username already exists";
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }


  removeLabel = (): void => {
    this.submitted = false;
    this.messageLabel.nativeElement.className = "info-label invis";
    this.messageStatus = "";
  }

}
