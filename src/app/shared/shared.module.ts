import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { MaterialModule } from './materials.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NumberDirective } from './directives/numbers-only.directive';

@NgModule({
	imports: [
		MaterialModule,
		PerfectScrollbarModule,
	],
	declarations: [
		NumberDirective
	],
	exports: [
		MaterialModule,
		PerfectScrollbarModule,
		NumberDirective
	]
})
export class SharedModule { }
