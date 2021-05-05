import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PodcastRoutingModule } from './podcast-routing.module';
import { PodcastListComponent } from './podcast-list/podcast-list.component';
import { PodcastAddComponent } from './podcast-add/podcast-add.component';
import { PodcastDetailsComponent } from './podcast-details/podcast-details.component';
import { PodcastEditComponent } from './podcast-edit/podcast-edit.component';


@NgModule({
  declarations: [PodcastListComponent, PodcastAddComponent, PodcastDetailsComponent, PodcastEditComponent],
  imports: [
    CommonModule,
    PodcastRoutingModule,
    NgbCarouselModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class PodcastModule { }
