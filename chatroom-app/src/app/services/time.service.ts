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

    // Algorithm to display time
    let localDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear().toLocaleString().slice(3);
    let localTime;

    let minute = date.getMinutes();
    let hour = date.getHours()

    if (hour < 12)
      localTime = hour + ":" + (minute < 10 ? '0' + minute : minute) + " am";
    else
      localTime = (hour % 12) + ":" + minute + " pm";
    // let seconds = Math.floor(time % 60);

    let time = (new Date().getTime() - date.getTime()) / 1000;
    let days = Math.floor(time / (24 * 3600)) % 30;

    if (days > 0) {
      return localDate + " " + localTime;
    }
    else {
      return localTime;
    }
  }
}
