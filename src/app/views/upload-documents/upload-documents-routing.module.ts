import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Upload Document'
    },
    component: UploadDocumentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadDocumentsRoutingModule { }
