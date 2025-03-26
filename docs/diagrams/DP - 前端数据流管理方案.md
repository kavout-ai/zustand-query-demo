# DP - **使用 Zustand 简化前端数据流管理**

### 概述

本设计方案结合使用 Zustand 和 React Query 来管理前端数据流。它旨在最小化样板代码，提升整体开发体验，并解决使用 React Context 管理状态时可能出现的以下问题：

1. **属性穿透**：Context 的设计初衷是避免手动传递属性的不便，但过度使用可能导致组件树的每一层都需要订阅 Context，重新创造属性穿透问题。
2. **状态变更难以追踪**：当 Context 中的数据被用作全局状态时，可以在任何地方被修改，这使得数据变更的来源难以追踪，调试问题变得困难。
3. **性能问题**：当 Context 的值发生变化时，会触发所有消费该 Context 的组件重新渲染。如果 Context 数据量大且频繁变化，可能导致不必要的重渲染和性能下降。
4. **Context 嵌套地狱**：如果一个组件需要访问多个 Context，就需要嵌套多个 Provider，使代码冗长且难以维护。
5. **代码分割困难**：过度使用 Context 会使状态管理变得集中且紧耦合，不利于团队协作和代码分割。
6. **可维护性问题**：随着应用程序的增长，过度使用 Context 会使状态管理变得混乱，数据流不清晰，难以维护和扩展代码库。

---

### 前提条件和限制

#### 前提条件

- 具备 React 和状态管理的基本概念
- 有 React Context API 的使用经验
- 安装了 Node.js 和 pnpm/yarn
- React 项目版本 16.8+ (支持 Hooks)
- 安装 Zustand：`pnpm add zustand @tanstack/react-query`

#### 限制

- 需要重构现有的基于 Context 的代码
- 过渡期间可能需要同时维护 Context 和 Zustand
- 部分遗留代码可能需要更新以适配 Zustand

---

### 架构设计

以下架构图展示了该方案的工作流程：

![React 状态管理架构](./react-state-management.png)

该架构由三个主要层次组成，它们协同工作以管理 React 应用中的数据流：

1. **UI 组件层**：
   React 组件通过 Zustand hooks 订阅和更新本地状态，通过 React Query hooks 处理服务器数据。当状态发生变化时，相关组件会自动重新渲染。用户交互触发的状态更新通过 Zustand actions 或 React Query mutations 进行处理，确保 UI 始终反映最新状态。
2. **状态管理层**：
   Zustand 负责管理本地应用状态，包括 UI 状态、状态持久化和订阅机制。React Query 处理服务器状态，负责数据获取、缓存和同步。两者协同工作，确保本地状态和服务器状态保持同步，并通过缓存机制优化性能。
3. **API 服务层**：
   处理与后端服务的通信，接收来自状态管理层的请求并返回数据。React Query 负责管理请求的生命周期，包括缓存、重试和错误处理，同时支持实时数据更新，确保数据的一致性和及时性。

**数据流**：

1. **UI 层到状态管理层的集成**：
   组件使用 Zustand hooks 获取和更新本地状态，使用 React Query hooks 处理服务器数据。状态发生变化时，相关组件自然地更新显示。当用户进行操作时，本地状态通过 Zustand actions 直接更新，服务器相关的操作通过 React Query mutations 流畅处理，变更会平滑地反映到界面上。
2. **状态管理层内部集成**：
   React Query 从服务器获取数据后，会触发 Zustand store 进行相应的状态更新，保持本地数据与服务器数据的同步。二者协同配合：React Query 负责服务器数据的交互，Zustand 进行本地状态的维护。
3. **状态管理层到 API 层的集成**：
   当需要获取服务器数据时，React Query 会处理与 API 的通信。在数据更新场景中，组件触发更新操作后，React Query 会进行数据请求的发送和响应处理，通过 API 与服务器交互，将数据更新同步到界面。

**技术栈**

- [React](https://react.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Query](https://tanstack.com/query/v5/docs/framework/react/overview)

---

##### 工具

- [Node.js](https://nodejs.org/en)
- [Vite](https://v3.vitejs.dev/)
- [Axios](https://axios-http.com/)

##### 代码

本方案的示例应用代码可在 [GitHub](https://github.com/Shurong-Wang_JLLT/zustand-query-demo) 仓库中获取。

---

### 最佳实践

- **渐进式迁移**

  - 从最有问题的 Context 实现开始
  - 一次迁移一个功能
  - 每次迁移后进行充分测试
- **状态组织**

  - 相关状态保持在同一个 store 中
  - 将大型 store 拆分为更小的、聚焦的 store
  - 使用选择性订阅防止不必要的重渲染
- **乐观更新（按需）**

  - 为提升用户体验，可以在等待服务器响应时立即更新 Zustand 中的本地状态
  - 这可以提高应用程序的感知性能

---

### 使用指南

- React Context 的问题

  ```react
  // 有问题的 React Context 实现示例
  import create from 'zustand';
  const AppContext = React.createContext();

  const AppProvider = ({ children }) => {
    const [state, setState] = useState({
      user: null,
      theme: 'light',
      data: []
    });

    return (
      <AppContext.Provider value={{ state, setState }}>
        {children}
      </AppContext.Provider>
    );
  };

  // 这个组件会在任何状态变化时重新渲染
  const UserProfile = () => {
    const { state } = useContext(AppContext);
    return <div>{state.user?.name}</div>;
  };
  ```
- 实现 Zustand Store

  ```react
  // 创建 Zustand store
  import create from 'zustand';

  const useStore = create((set) => ({
    user: null,
    theme: 'light',
    data: [],
    setUser: (user) => set({ user }),
    setTheme: (theme) => set({ theme }),
    setData: (data) => set({ data }),
  }));

  // 组件只在其依赖的特定状态变化时重新渲染
  const UserProfile = () => {
    const user = useStore((state) => state.user);
    return <div>{user?.name}</div>;
  };
  ```
