import { Component, OnInit } from '@angular/core';
import { MomentService } from '../services/moment.service';
import { Moment } from '../models/moment.model';
import { MomentComponent } from './moment/moment.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [MomentComponent, CommonModule, FormsModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit {
  moments!: Moment[];
  newMoment: Moment = { id: 0, title: '', text: '', image: '' };
  availableImages: string[] = ['assets/timeline-icons/Red_Blue_Blue.webp'];

  constructor(private momentService: MomentService) {}

  ngOnInit() {
    this.moments = this.momentService.getMoments();
  }

  addNewMoment() {
    if(this.newMoment.title && this.newMoment.text && this.newMoment.image) {
      this.momentService.addMoment(this.newMoment);
      this.newMoment = { id: 0, title: '', text: '', image: '' }; // Reset the form
    }
  }

  selectImage(imagePath: string) {
    this.newMoment.image = imagePath;
  }
}
