import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongDetailsComponent } from './song-details/song-details.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongEditComponent } from './song-edit/song-edit.component';
import { SongAddComponent } from './song-add/song-add.component';

const routes: Routes = [{
    path: '',
    data: {
      title: 'Song'
    },
    children: [
      {
        path: '',
        component: SongListComponent,
        data: {
          title: 'Song List'
        },
      },
      {
        path: 'add',
        component: SongAddComponent,
        data: {
          title: 'Song Add'
        },
      },
      {
        path: 'details/:id',
        component: SongDetailsComponent,
        data: {
          title: 'Song Details'
        },
      },
      {
        path: 'edit/:id',
        component: SongEditComponent,
        data: {
          title: 'Song Edit'
        },
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongsRoutingModule { }
