import { Component, OnInit, Input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { IonContent, IonAvatar, IonIcon, IonButton } from '@ionic/angular/standalone'
import { ReactiveFormsModule, InternalFormsSharedModule } from "@angular/forms";

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
  imports: [HeaderComponent, CustomInputComponent, IonContent,
    IonAvatar, IonIcon, IonButton, ReactiveFormsModule]
})
export class AddUpdateComponent implements OnInit {
  @Input() product: any;

  constructor() { }

  ngOnInit() { }

}