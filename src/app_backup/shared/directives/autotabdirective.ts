import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[libAutoTab]'
})
export class AutoTabDirective {
  @Input() libAutoTab;
  constructor() {}
  @HostListener('input', ['$event.target']) onInput(input) {
    const length = input.value.length;
    const maxLength = input.attributes.maxlength.value;
    if (length >= maxLength && this.libAutoTab) {
      const field = document.getElementById(this.libAutoTab);
      if (field) {
        field.focus();
      }
    }
  }
}

@Directive({
    selector: '[libAutoTabPrev]'
  })
export class AutoTabDirectivePrev {
    @Input() libAutoTabPrev;
    constructor() {}
    @HostListener('input', ['$event.target']) onInput(input) {
      const length = input.value.length;
      const maxLength = input.attributes.maxlength.value;
      if (length === 0 && this.libAutoTabPrev) {
        const field = document.getElementById(this.libAutoTabPrev);
        if (field) {
          field.focus();
        }
      }
    }
  }