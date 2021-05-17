import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumEditComponent } from './album-edit/album-edit.component';
import { AlbumAddComponent } from './album-add/album-add.component';

const routes: Routes = [{
    path: '',
    data: {
      title: 'Album'
    },
    children: [
      {
        path: '',
        component: AlbumListComponent,
        data: {
          title: 'Album List'
        },
      },
      {
        path: 'add',
        component: AlbumAddComponent,
        data: {
          title: 'Album Add'
        },
      },
      {
        path: 'details/:id',
        component: AlbumDetailsComponent,
        data: {
          title: 'Album Details'
        },
      },
      {
        path: 'edit/:id',
        component: AlbumEditComponent,
        data: {
          title: 'Album Edit'
        },
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumsRoutingModule { }
