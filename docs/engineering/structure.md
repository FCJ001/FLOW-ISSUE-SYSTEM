# 前端目录结构规范

## 分层原则

- pages：页面级组件，可调用 api / store
- components：纯 UI 组件，不允许请求接口
- api：接口封装，只返回数据
- hooks：可复用逻辑
- utils：纯函数工具

## 禁止事项

- components 中禁止使用 fetch / axios
- api 中禁止操作 DOM
