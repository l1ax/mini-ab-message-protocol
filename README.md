# ab对话demo

分成part-one, part-two, part-three三个分支

- part-one: 基于ab assistant api渲染简单对话和event(thought, function_call, 组件调用等) ✅
- part-two: 基于新的消息架构重构part-one
- part-three: 基于langgraph实现agent，仿造ab返回消息内容，标记模型原始输出


## part-one
---
需求： 将function_call event和组件调用event放到一个div里渲染

目前是遍历qa.events，顺序渲染，想要实现这个需求需要组织event的结构
- 第一种方法，function_call event上维护一个calledEvents数组，保存被call的event，渲染function_call event的时候遍历calledEvents渲染
- 第二种方法
见eventTree.drawio
如图, event tree会是一个深度为2的多叉树，在这个event tree当中，需要聚合渲染的（比如function_call 和 tool_call event要一起渲染）要作为树的一个parent节点
被聚合的作为他们的子节点（通常这些节点也是树的叶子节点）

✅
---