import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { MaterialModule } from './materials.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
	imports: [
		MaterialModule,
		PerfectScrollbarModule,
	],
	declarations: [
	],
	exports: [
		MaterialModule,
		PerfectScrollbarModule,
	]
})
export class SharedModule { }
