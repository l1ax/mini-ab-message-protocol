/**
 * @file function call 内容渲染器
 */

import React from "react";
import ReactJson from 'react-json-view';
import {observer} from 'mobx-react-lite';

interface IProps {
    outputs: Record<string, any>;
}

export const functionCallContentRenderer: React.FC<IProps> = observer((props) => {
    return <ReactJson src={props.outputs} />;
});