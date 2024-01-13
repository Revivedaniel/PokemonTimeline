import { Component } from '@angular/core';
import { MomentService } from '../services/moment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  selectedFile: File | null = null;
  constructor(private momentService: MomentService) {}

  exportMoments() {
    this.momentService.exportMomentsToCsv();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  clearData() {
    this.momentService.resetDb();
  }

  uploadFile() {
    // Parse the csv file and update expenses
    if (this.selectedFile) {
      this.momentService.uploadFile(this.selectedFile);
    }
  }
}
