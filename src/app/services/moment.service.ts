import { Injectable } from '@angular/core';
import { Moment } from '../models/moment.model';
import { Subject } from 'rxjs';
import { openDB } from 'idb';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class MomentService {
  private dbPromise: any;
  private moments: Moment[] = [];
  momentsUpdated: Subject<Moment[]> = new Subject<Moment[]>();

  constructor() {
    this.dbPromise = openDB('momentsDB', 1, {
      upgrade(db) {
        db.createObjectStore('moments', { keyPath: 'id', autoIncrement: true });
      },
    });
    this.initializeMoments().then((moments) => {
      this.moments = moments;
      this.handleMomentUpdate();
    });
  }

  async initializeMoments() {
    const db = await this.dbPromise;
    return db.getAll('moments');
  }

  getMoments(): Moment[] {
    return this.moments;
  }

  async addMoment(moment: Moment, delayUpdate?: boolean) {
    const db = await this.dbPromise;
    const tx = db.transaction('moments', 'readwrite');
    await tx.store.add(moment);
    await tx.done;
    this.moments.push(moment);
    if (!delayUpdate) {
      console.log('handleMomentUpdate from addMoment');
      this.handleMomentUpdate();
    }
  }

  async deleteMoment(momentId: number) {
    const db = await this.dbPromise;
    const tx = db.transaction('moments', 'readwrite');
    await tx.store.delete(momentId);
    await tx.done;
    this.moments = this.moments.filter((moment) => moment.id !== momentId);
    this.handleMomentUpdate();
  }

  async updateMoment(moment: Moment) {
    const db = await this.dbPromise;
    const tx = db.transaction('moments', 'readwrite');
    await tx.store.put(moment);
    await tx.done;
    const index = this.moments.findIndex((m) => m.id === moment.id);
    this.moments[index] = moment;
    this.handleMomentUpdate();
  }

  moveMomentUp(moment: Moment) {
    const index = this.moments.findIndex((m) => m.id === moment.id);
    if (index > 0) {
      const previousMoment = this.moments[index - 1];
      this.moments[index - 1] = moment;
      this.moments[index] = previousMoment;
    }
    this.resetDb(this.moments);
  }

  moveMomentDown(moment: Moment) {
    const index = this.moments.findIndex((m) => m.id === moment.id);
    if (index < this.moments.length - 1) {
      const nextMoment = this.moments[index + 1];
      this.moments[index + 1] = moment;
      this.moments[index] = nextMoment;
    }
    this.resetDb(this.moments);
  }

  resetDb(moments?: Moment[]) {
    this.dbPromise.then(async (db: any) => {
      const tx = db.transaction('moments', 'readwrite');
      await tx.store.clear();
      await tx.done;
      this.moments = [];
      if (moments) {
        moments.forEach((moment) => {
          this.addMoment(moment, true);
        });
        console.log('handleMomentUpdate from resetDb');
      }
      this.handleMomentUpdate();
    });
  }

  handleMomentUpdate() {
    this.momentsUpdated.next(this.moments);
  }

  async exportMomentsToCsv() {
    const filename = 'moments.csv';
    const moments = this.getMoments();
    let csvContent = '';
    csvContent += 'id,title,text,image\n'; // Assuming these are your fields

    moments.forEach((moment) => {
      let row = `${moment.id},${moment.title},${moment.text},${moment.image}`;
      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  uploadFile(file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {
        const moments: Moment[] = result.data;
        this.resetDb(moments);
      },
    });
  }
}
