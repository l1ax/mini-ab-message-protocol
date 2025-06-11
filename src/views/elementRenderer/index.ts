/**
 * @file element内容和渲染器映射表
 */

import {Session} from '../../refactor/Session';
import {TextQueryRenderer} from './textQuery';
import {AgentResponseRenderer} from './agentResponse';

export const elementRendererMap: Record<Session.IElement['type'], React.FC<{element: Session.IElement}> | null> = {
    textQuery: TextQueryRenderer,
    response: AgentResponseRenderer
}