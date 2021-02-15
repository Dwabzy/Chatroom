import { Component, OnInit } from '@angular/core';
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

  constructor(public ngForm: NgForm, public userAuthService: UserAuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.userAuthService.login(form.value).subscribe(
      res => {
        console.log(res);
        let { responseStatus, isAdmin, username } = JSON.parse(JSON.stringify(res))
        if (responseStatus) {
          if (isAdmin === 0)
            this.router.navigateByUrl(`/agent-dashboard/${username}`);
          else this.router.navigateByUrl(`/admin-dashboard/${username}`);
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
