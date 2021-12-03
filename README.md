# React Hooks 进阶 - 原理及优化

## 前言

Hook 是 React 16.8 的新增特性，第一版16.8.0是2019年2月6日发布的，进过两年的使用，大家已经在用法上很熟悉了，但是日常使用中还是会有一些不规范和有疑问的地方，而且对于Hooks性能优化接触的不多，本文将会由浅入深帮大家走向进阶。

## 1. 从类组件走向函数式组件

刚开始大家写的还都是类组件，类组件很强大，但是当项目变的越来越复杂时，类组件中充斥着状态逻辑和各种副作用，生命周期中也经常包含很多逻辑，比如事件监听等，很难再进行拆分复用，还有class中的this指向问题和迟迟没有稳定的语法规则，都有些让人头大。Hook的出现让函数式组件也能处理状态和生命周期，并且能更细粒度的处理各种状态变化带来的副作用。

前两个demo例举了类组件和函数组件的一些区别。

还有一个从类组件转向函数式组件的原因，是React在v16版本的一个重大更新——**Fiber**。

React 框架内部的运作可以分为 3 层：

- Virtual DOM 层，描述页面长什么样。
- Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
- Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

Fiber就在调度层。

js的执行和页面Dom的布局渲染是互斥的，例如js做大数据运算的时候，input输入一堆字就会卡顿，等运算结束之后会突然全出现。

Fiber之前的React使用的是`Stack Reconciler`，就和js的函数调用栈，一条道走到黑，所有逻辑全部执行完才会结束，执行过程中的页面渲染就会被打断，执行完之后继续渲染。

经过Facebook两年的重构，从`Stack Reconciler`升级到`Fiber Reconciler`，没执行一段时间，就会把控制权交还给浏览器进行渲染（16ms的渲染中断人眼是无法感受到的）。

[例子](https://claudiopro.github.io/react-fiber-vs-stack-demo/)

为了达到这种效果，就需要有一个调度器 (Scheduler) 来进行任务分配。任务的优先级有六种：

- synchronous，与之前的Stack Reconciler操作一样，同步执行
- task，在next tick之前执行
- animation，下一帧之前执行
- high，在不久的将来立即执行
- low，稍微延迟执行也没关系
- offscreen，下一次render时或scroll时才执行

优先级高的任务（如键盘输入）可以打断优先级低的任务（如Diff）的执行，从而更快的生效。

Fiber Reconciler 在执行过程中，会分为 2 个阶段。

- 阶段一，生成 Fiber 树，得出需要更新的节点信息。这一步是一个渐进的过程，可以被打断。
- 阶段二，将需要更新的节点一次过批量更新，这个过程不能被打断。

阶段一可被打断的特性，让优先级更高的任务先执行，从框架层面大大降低了页面掉帧的概率。

其中阶段一的生命周期包含：
- componentWillMount
- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate

阶段二的生命周期包含：
- componentDidMount
- componentDidUpdate
- componentWillUnmount

需要注意的是，如果低优先级的任务分片时间用完的时候还没执行完，这时候来了一个高级任务，这时候就会优先处理高级任务，低优先级的任务完全作废，等待机会重头再来，这就意味着，在更新到Fiber之后，第一阶段的生命周期，是可能在一次加载和更新过程中被多次调用的。这无疑会增大使用类组件生命周期的难度，拥抱Hook成了更好的选择。

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

我们再寻找`ReactCurrentDispatcher.current`

## 3. 常见问题及优化

1. 不要误认为函数组件只会执行一次，在组件内部定义很多和组件状态无关的值
2. 使用`useMemo`避免过多的性能浪费
3. 使用`useEffect`时要添加所有依赖
4. 如果函数不在useEffect中使用，不建议频繁使用useCallback - useCallback 其实在函数组件中是作为函数进行调用，那么第一个参数就是我们传递的回调函数，无论是否使用 useCallback，这个回调函数都会被创建，所以起不到降低函数创建成本的作用。不仅无法降低创建成本，使用 useCallback后，第二个参数依赖项在每次 render 的时候还需要进行一次浅比较，无形中增加了数据对比的成本。需要使用useCallback的场景：需要对子组件进行性能优化
5. 