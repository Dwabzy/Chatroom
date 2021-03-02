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
    this.webSocketService.listen('receive-unconnected-visitors-list').subscribe((data: any) => {
      this.visitorList = data;
    })
    this.webSocketService.listen('visitor-details').subscribe((data: any) => {
      let visitor = this.visitorList.find(visitorChat => visitorChat.visitorId === data.visitorId);

      // If visitor is not part of the existing visitor list and has not already been assigned an agent, push it into the list.
      if (!this.visitorList.includes(visitor) && !data.agentName) {
        this.visitorList.push(data);
        let notificaiton = new Audio('../../../assets/sounds/KnockKnock.mp3')
        notificaiton.play();
      }
    })
  }

}
