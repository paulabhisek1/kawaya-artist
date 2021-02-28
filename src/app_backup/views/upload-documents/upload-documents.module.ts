import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadDocumentsRoutingModule } from './upload-documents-routing.module';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [UploadDocumentsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UploadDocumentsRoutingModule
  ]
})
export class UploadDocumentsModule { }
