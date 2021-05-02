import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SongsRoutingModule } from './songs-routing.module';
import { SongEditComponent } from './song-edit/song-edit.component';
import { SongDetailsComponent } from './song-details/song-details.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongAddComponent } from './song-add/song-add.component';


@NgModule({
  declarations: [SongEditComponent, SongDetailsComponent, SongListComponent, SongAddComponent],
  imports: [
    CommonModule,
    SongsRoutingModule,
    NgbCarouselModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class SongsModule { }
