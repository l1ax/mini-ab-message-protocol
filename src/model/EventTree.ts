/**
 * @file 事件树
 */

import { makeObservable, observable } from "mobx";
import { ExecutionEvent } from "./ExecutionEvent";

export class EventTree {
    root: EventTreeNode = new EventTreeNode(new ExecutionEvent());
    
    currentParentNode: EventTreeNode;

    idToEventTreeNodeMap: Map<string, EventTreeNode> = new Map();

    constructor() {
        this.currentParentNode = this.root;

        makeObservable(this, {
            root: observable.ref,
            currentParentNode: observable.ref,
            idToEventTreeNodeMap: observable.ref
        })
    }

    update(event: ExecutionEvent<any>) {
        if (this.idToEventTreeNodeMap.has(event.event_id)) {
            return;
        }

        const node: EventTreeNode = new EventTreeNode(event);
        this.idToEventTreeNodeMap.set(event.event_id, node);
        
        // 如果当前是top level event，那么这个event作为新的父节点，聚合后续的子event
        // 直到新的top level event出现
        if (event.isTopLevelEvent) {
            this.currentParentNode = this.root;
            this.currentParentNode.addChild(node);
            this.currentParentNode = node;
        }
        else {
            this.currentParentNode.addChild(node);
        }
    }
}

export class EventTreeNode {
    children: EventTreeNode[] = [];

    constructor(public event: ExecutionEvent<any>) {
        makeObservable(this, {
            event: observable,
            children: observable.shallow
        })
    }

    addChild(child: EventTreeNode) {
        this.children.push(child);
    }
}