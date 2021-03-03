import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface LoginModel {
  usernameEmail: string;
  password: string;
}

interface SignupModel {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  loginModel: LoginModel = {
    usernameEmail: "",
    password: ""
  }

  signupModel: SignupModel = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    username: "",
    password: "",
  }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };


  constructor(private http: HttpClient) { }

  signup(signupForm: SignupModel) {
    return this.http.post(environment.apiBaseUrl + '/signup', signupForm, this.noAuthHeader);
  }

  login(loginForm: LoginModel) {
    return this.http.post(environment.apiBaseUrl + '/login', loginForm, this.noAuthHeader);
  }
}
