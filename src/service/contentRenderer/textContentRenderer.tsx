/**
 * @file 文本内容渲染器
 */

import React from "react";
import { EventContentRenderService } from "../eventContentRenderService";
import {observer} from 'mobx-react-lite';

interface IProps {
    outputs: EventContentRenderService.ITextContentOutputs;
}

export const textContentRenderer: React.FC<IProps> = observer((props) => {
    return <div>{props.outputs.text}</div>;
});
