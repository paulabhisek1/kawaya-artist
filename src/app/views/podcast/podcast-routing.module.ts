import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PodcastDetailsComponent } from './podcast-details/podcast-details.component';
import { PodcastListComponent } from './podcast-list/podcast-list.component';
import { PodcastEditComponent } from './podcast-edit/podcast-edit.component';
import { PodcastAddComponent } from './podcast-add/podcast-add.component';

const routes: Routes = [{
    path: '',
    data: {
      title: 'Podcast'
    },
    children: [
      {
        path: '',
        component: PodcastListComponent,
        data: {
          title: 'Podcast List'
        },
      },
      {
        path: 'add',
        component: PodcastAddComponent,
        data: {
          title: 'Podcast Add'
        },
      },
      {
        path: 'details/:id',
        component: PodcastDetailsComponent,
        data: {
          title: 'Podcast Details'
        },
      },
      {
        path: 'edit/:id',
        component: PodcastEditComponent,
        data: {
          title: 'Podcast Edit'
        },
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PodcastRoutingModule { }
