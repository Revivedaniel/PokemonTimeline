import { Injectable } from '@angular/core';
import { Moment } from '../models/moment.model';

@Injectable({
  providedIn: 'root',
})
export class MomentService {
  private moments: Moment[] = [
    { id: 1, title: 'First moment', text: "asdfasfdasdfasdffdvcvfa", image: "assets/timeline-icons/Red_Blue_Blue.webp" },
    { id: 2, title: 'Second moment', text: "asdfasfdasdfasdffdvcvfa", image: "assets/timeline-icons/Red_Blue_Blue.webp" },
    { id: 3, title: 'Third moment', text: "asdfasfdasdfasdffdvcvfa", image: "assets/timeline-icons/Red_Blue_Blue.webp" },
    { id: 4, title: 'Fourth moment', text: "asdfasfdasdfasdffdvcvfa", image: "assets/timeline-icons/Red_Blue_Blue.webp" },
    // ... more moments
  ];

  constructor() {}

  getMoments(): Moment[] {
    return this.moments;
  }

  addMoment(moment: Moment) {
    this.moments.push(moment);
  }
}
