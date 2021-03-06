import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  incrementTime = (): void => {

  }

  getTimeMessage = (date: Date): string => {
    date = new Date(date);
    let time = (new Date().getTime() - date.getTime()) / 1000;
    // Algorithm to display time
    let localDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear().toLocaleString().slice(3);
    let localTime: string;

    let minute = date.getMinutes();
    let hour = date.getHours()

    let minuteS: string = "" + minute;

    if (minute < 10) minuteS = '0' + minute;

    if (hour < 12)
      localTime = hour + ":" + minuteS + " am";
    else if (hour === 12)
      localTime = hour + ':' + minuteS + " pm";
    else
      localTime = (hour % 12) + ":" + minuteS + " pm";
    // let seconds = Math.floor(time % 60);

    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600) % 24;
    let days = Math.floor(time / (24 * 3600)) % 30;
    if (days > 0) {
      return localDate + " " + localTime;
    }
    else if (hours > 0 || minutes > 1) {
      return localTime;
    }
    else if (minutes === 1) {
      return minutes + " minute ago"
    }
    else {
      return "Just now";
    }
  }

}
