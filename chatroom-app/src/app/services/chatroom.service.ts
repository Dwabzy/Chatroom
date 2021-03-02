import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface Chatroom {
  username: string;
  chatroomName: string;
  firstMessage: string;
  onlineMessage: string;
  offlineMessage: string;
  idleMessage: string;
  entityList: {
    list: Array<string>
  };
  chatboxTheme: object;
}

interface Theme {
  titlebarColor: string;
  customerMessageBackgroundColor: string;
  agentMessageBackgroundColor: string;
  agentMessageTextColor: string;
  customerMessageTextcolor: string;
  agentMessageFont: string;
  customerMessageFont: string;
  widgetColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  chatroom: Chatroom = {
    username: "",
    chatroomName: "",
    firstMessage: "",
    onlineMessage: "",
    offlineMessage: "",
    idleMessage: "",
    entityList: {
      list: []
    },
    chatboxTheme: {},
  }

  theme: Theme = {
    titlebarColor: "",
    customerMessageBackgroundColor: "",
    agentMessageBackgroundColor: "",
    agentMessageTextColor: "",
    customerMessageTextcolor: "",
    agentMessageFont: "",
    customerMessageFont: "",
    widgetColor: "",
  }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  createChatroom = (chatroom: Chatroom) => {
    return this.http.post(environment.apiBaseUrl + '/createChatroom', chatroom, this.noAuthHeader);
  }

  displayChatrooms = () => {
    return this.http.get(environment.apiBaseUrl + '/myChatrooms', this.noAuthHeader);
  }

  getVisitorDetails = () => {
    return this.http.get(environment.apiBaseUrl + '/getVisitorDetails', this.noAuthHeader);
  }
}