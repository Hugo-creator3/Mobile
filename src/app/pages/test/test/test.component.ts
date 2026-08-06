import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone'

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone : true,
  imports: [IonContent]
})
export class TestComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
