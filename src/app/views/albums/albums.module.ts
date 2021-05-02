import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AlbumsRoutingModule } from './albums-routing.module';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { AlbumEditComponent } from './album-edit/album-edit.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AlbumAddComponent } from './album-add/album-add.component';

@NgModule({
  declarations: [AlbumListComponent, AlbumDetailsComponent, AlbumEditComponent, AlbumAddComponent],
  imports: [
    CommonModule,
    AlbumsRoutingModule,
    NgbCarouselModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class AlbumsModule { }
