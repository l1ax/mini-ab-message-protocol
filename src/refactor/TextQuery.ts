/**
 * @file 文字query
 */

import {uniqueId} from 'lodash-es';

import {Session} from './Session';
import {makeObservable, observable} from 'mobx';

export class TextQuery implements Session.IElement {
    role: Session.IElement['role'] = 'user';

    type: Session.IElement['type'] = 'textQuery';

    textContent: string = '';

    uiId: string = uniqueId();

    constructor(textContent: string) {
        this.textContent = textContent;

        makeObservable(this, {
            role: observable,
            type: observable,
            textContent: observable,
            uiId: observable
        })
    }
}
