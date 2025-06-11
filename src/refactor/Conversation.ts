/**
 * 对话类, 抽象了user和assistant的对话
 */

import {flow, makeObservable, observable} from 'mobx';
import {Session} from './Session';
import {abKyInstance} from '../api';

export class Conversation {

    /** 独立对话的集合 */
    sessions: Session[] = [];

    /** 当前活跃的对话 */
    activeSession: Session | null = null;

    constructor() {
        makeObservable(this, {
            sessions: observable.ref,
            activeSession: observable.ref,
            createSession: flow.bound
        })
    }

    * createSession() {
        const app_id: string = import.meta.env.VITE_APP_ID;
        let conversationId: string = '';

        if (window.localStorage.getItem('conversationId')) {
            conversationId = window.localStorage.getItem('conversationId') || '';
        }
        else {
            const response: Conversation.ICreateSessionResponse = yield abKyInstance.post('api/app/conversation', {
                json: {
                    app_id,
                },
            }).json()

            conversationId = response.conversation_id;
        }

        const newSession: Session = new Session();

        newSession.conversationId = conversationId;

        this.sessions.push(newSession);
        this.activeSession = newSession;
    }
}

export namespace Conversation {
    export interface ICreateSessionResponse {
        conversation_id: string;
        request_id: string;
    }
}