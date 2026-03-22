import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-checkin-result',
  templateUrl: './checkin-result.page.html',
  styleUrls: ['./checkin-result.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CheckinResultPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
