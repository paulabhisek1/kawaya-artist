import { AbstractControl, FormGroup } from '@angular/forms';

export function noSpace(control: AbstractControl) {
	if (control.value && control.value.toString().trim() == '') {
		return { noSpace: true };
	}
	return null;
}
