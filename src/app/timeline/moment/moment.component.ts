import { Component, Input, OnInit } from '@angular/core';
import { Moment } from '../../models/moment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moment.component.html',
  styleUrl: './moment.component.scss',
})
export class MomentComponent implements OnInit {
  @Input() moment!: Moment;

  ngOnInit() {}
}
