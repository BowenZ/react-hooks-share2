# React Hooks 进阶 - 原理及优化

## 前言

Hook 是 React 16.8 的新增特性，第一版16.8.0是2019年2月6日发布的，进过两年的使用，大家已经在用法上很熟悉了，但是日常使用中还是会有一些不规范和有疑问的地方，而且对于Hooks性能优化接触的不多，本文将会由浅入深帮大家走向进阶。

## 1. 从类组件走向函数式组件

刚开始大家写的还都是类组件，类组件很强大，但是当项目变的越来越复杂时，类组件中充斥着状态逻辑和各种副作用，生命周期中也经常包含很多逻辑，比如事件监听等，很难再进行拆分复用，还有class中的this指向问题和迟迟没有稳定的语法规则，都有些让人头大。Hook的出现让函数式组件也能处理状态和生命周期，并且能更细粒度的处理各种状态变化带来的副作用。

前两个demo例举了类组件和函数组件的一些区别。

## 2. Hooks源码解读

将React库下载到本地后，可以发现，React库是一个monorepo，从其中找到react部分：`packages/react/src/ReactHooks.js`，可以发现`useState`代码只有如下部分：
```ts
export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
```
再找到`resolveDispatcher`的代码：
```ts
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  if (__DEV__) {
    if (dispatcher === null) {
      console.error(
        'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
          ' one of the following reasons:\n' +
          '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
          '2. You might be breaking the Rules of Hooks\n' +
          '3. You might have more than one copy of React in the same app\n' +
          'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.',
      );
    }
  }
  // Will result in a null access error if accessed outside render phase. We
  // intentionally don't throw our own error because this is in a hot path.
  // Also helps ensure this is inlined.
  return ((dispatcher: any): Dispatcher);
}
```

所以`useState(xxx)`代码约等于`ReactCurrentDispatcher.current().useState(xxx)`