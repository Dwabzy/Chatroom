import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {
  visitorList: Array<any> = [];
  constructor(public activatedRoute: ActivatedRoute, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.webSocketService.emit('get-unconnected-visitors-request', "");    
  }

}
