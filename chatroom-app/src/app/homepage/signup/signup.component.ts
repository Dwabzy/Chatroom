import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserAuthService } from 'src/app/services/user-auth.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'homepage-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [UserAuthService]
})
export class SignupComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();
  constructor(public userAuthService: UserAuthService) { }

  ngOnInit(): void {
  }

  

  onSubmit(form: NgForm) {
    this.userAuthService.signup(form.value).subscribe(
      res => {
       console.log(res)
      },
      err => {
        console.log(err);
      }
    );
  }

}
