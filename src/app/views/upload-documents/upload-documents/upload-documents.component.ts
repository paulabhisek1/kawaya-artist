import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent implements OnInit {
  isEditable = true;
  isStepOneComplete: boolean = false;

  firstStepForm: FormGroup

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

}
