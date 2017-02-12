import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'contact',
    templateUrl: 'modules/pages/contact/contact.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
    text: string = 'Contact Page';
}
