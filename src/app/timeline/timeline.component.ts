import { Component, OnInit } from '@angular/core';
import { MomentService } from '../services/moment.service';
import { Moment } from '../models/moment.model';
import { MomentComponent } from './moment/moment.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

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
  editMomentId: number | null = null;
  editingMoment: Moment = { id: 0, title: '', text: '', image: '' };
  momentSubscription!: Subscription;

  constructor(private momentService: MomentService) {}

  ngOnInit() {
    this.moments = this.momentService.getMoments();
    this.momentSubscription = this.momentService.momentsUpdated.subscribe(
      (moments: Moment[]) => {
        this.moments = moments;
      }
    );
  }

  addNewMoment() {
    if(this.newMoment.title && this.newMoment.text && this.newMoment.image) {
      this.newMoment.id = this.moments.length;
      this.momentService.addMoment(this.newMoment);
      this.newMoment = { id: 0, title: '', text: '', image: '' }; // Reset the form
    }
  }

  selectImage(imagePath: string) {
    this.newMoment.image = imagePath;
  }

  startEdit(moment: Moment) {
    this.editingMoment = { ...moment };
    this.editMomentId = moment.id;
  }
  
  deleteMoment(momentId: number) {
    this.momentService.deleteMoment(momentId);
  }
  
  cancelEdit() {
    this.editMomentId = null;
    this.newMoment = { id: 0, title: '', text: '', image: '' };
  }
  
  saveMoment() {
    if (this.editMomentId) {
      this.momentService.updateMoment(this.editingMoment);
    } else {
      this.momentService.addMoment(this.editingMoment);
    }
    this.cancelEdit();
    // Code to refresh the moments list
  }

  moveMomentUp(moment: Moment) {
    this.momentService.moveMomentUp(moment);
  }

  moveMomentDown(moment: Moment) {
    this.momentService.moveMomentDown(moment);
  }
}
