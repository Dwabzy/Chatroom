import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {

  constructor(public activatedRoute: ActivatedRoute, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.webSocketService.listen('new-user').subscribe((data) => {
      console.log(data);
    })
  }

}
