# App.js 重构指南

## 当前状态

App.js 现在包含了太多的功能，包括：
- UI 组件（Toolbar, ModuleLibrary, NodeCanvas, SingleModule, PromptPreview 等）
- 状态管理逻辑
- 事件处理逻辑
- 内容提取算法

**文件大小**：1167 行
**圈复杂度**：过高

## 重构目标

将 App.js 拆分为：
1. ✅ 独立的 React 组件文件
2. ✅ 自定义 Hooks（用于状态管理）
3. ✅ 工具函数（纯函数，无副作用）
4. ✅ 常量定义
5. ✅ 详细的代码注释和文档

## 已完成的工作

### 1. 创建工具函数模块

#### [utils/constants.js](../src/utils/constants.js)
集中管理应用常量：
- 画布参数（缩放、平移）
- 节点参数（宽度、间距）
- 连接线样式
- 支持的模块类别
- 节点类型定义

**使用示例**：
```javascript
import { CANVAS_DEFAULTS, NODE_DEFAULTS } from '../utils/constants';

const minZoom = CANVAS_DEFAULTS.MIN_ZOOM;  // 0.2
const nodeWidth = NODE_DEFAULTS.WIDTH;      // 280
```

#### [utils/contentExtraction.js](../src/utils/contentExtraction.js)
核心算法函数：
- `extractPlaceholderContent()` - 从文本提取指定占位符的内容
- `getNodeFullContent()` - 递归获取节点的完整内容（含上游节点）
- `getOutputNodeContent()` - 获取输出节点的最终内容

**使用示例**：
```javascript
import { 
  extractPlaceholderContent,
  getNodeFullContent,
  getOutputNodeContent 
} from '../utils/contentExtraction';

// 提取占位符
const content = extractPlaceholderContent(
  "[S] Strengths [W] Weaknesses [O] Opportunities",
  "SO",
  ["S", "W", "O", "T"]
);
// 返回: "Strengths\n\nOpportunities"

// 获取节点完整内容
const fullContent = getNodeFullContent(
  nodeInstanceId,
  nodes,
  connections,
  nodeInputValues
);
```

#### [utils/nodeHelpers.js](../src/utils/nodeHelpers.js)
节点操作辅助函数：
- `generateNodeInstanceId()` - 生成节点 ID
- `createNodeFromModule()` - 从模块创建节点
- `updateNodePosition()` - 更新节点位置
- `deleteNodeWithConnections()` - 删除节点及相关连接
- `getInputConnections()` - 获取输入连接
- `getOutputConnections()` - 获取输出连接
- `isPortConnected()` - 检查端口是否已连接
- `computePlaceholderSelector()` - 计算占位符选择器

**使用示例**：
```javascript
import { 
  createNodeFromModule,
  updateNodePosition,
  deleteNodeWithConnections 
} from '../utils/nodeHelpers';

// 创建新节点
const newNode = createNodeFromModule(module, 0, { x: 100, y: 100 });

// 更新节点位置
const updatedNodes = updateNodePosition(nodes, nodeId, { x: 200, y: 150 });

// 删除节点及其连接
const { nodes: newNodes, connections: newConnections } 
  = deleteNodeWithConnections(nodes, connections, nodeId);
```

### 2. 创建自定义 Hooks

#### [hooks/useCanvasState.js](../src/hooks/useCanvasState.js)
管理画布的所有交互状态：
```javascript
const {
  // 画布变换状态
  canvasPan, canvasZoom, isCanvasPanning, showZoomPercentage,
  
  // 节点拖拽状态
  isDragging, draggedNode,
  
  // 连接状态
  connectionStart, temporaryLine, hoveredConnectionIdx,
  
  // 操作方法
  handleZoom, resetCanvas, startPan, stopPan, doPan,
  startDragging, stopDragging, startConnection, cancelConnection,
  
  // Refs（用于事件处理器）
  canvasPanRef, canvasZoomRef
} = useCanvasState();
```

#### [hooks/useNodeManagement.js](../src/hooks/useNodeManagement.js)
管理节点、连接和输入值：
```javascript
// 节点管理
const { nodes, nodeCounter, addNode, removeNode, moveNode } 
  = useNodeManagement();

// 连接管理
const { connections, addConnection, removeConnection } 
  = useConnectionManagement();

// 输入值管理
const { nodeInputValues, updateInputValue, clearInputValue } 
  = useNodeInputValues();

// 选中状态
const { selectedId, setSelectedId, clearSelection } 
  = useSelection();
```

### 3. 添加代码注释

已为以下部分添加详细的 JSDoc 注释：
- `Toolbar` 组件
- 所有工具函数
- 所有自定义 Hooks

## 待完成的工作

### 第一阶段：组件拆分

需要将 App.js 中的组件提取到独立文件：

```
src/components/
├── Toolbar.js              # ✅ 已有注释
├── ModuleLibrary.js        # 待拆分
├── NodeCanvas.js           # 待拆分
├── SingleModule.js         # 待拆分
├── PromptPreview.js        # 待拆分
└── ZoomPercentageDisplay.js # 待拆分
```

**建议顺序**：
1. 最小化组件（ZoomPercentageDisplay, PromptPreview）
2. 中等复杂度（Toolbar, SingleModule）
3. 复杂组件（ModuleLibrary, NodeCanvas）

### 第二阶段：App.js 重构

简化主应用组件：
```javascript
function App() {
  // 使用自定义 Hooks
  const canvas = useCanvasState();
  const nodes = useNodeManagement();
  const { connections, addConnection, removeConnection } 
    = useConnectionManagement();
  const { selectedId, setSelectedId } = useSelection();

  // 状态管理
  const [modules, setModules] = useState([]);
  const [libraryExpanded, setLibraryExpanded] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(true);

  // 加载模块
  useEffect(() => {
    loadModules();
  }, []);

  // 处理函数
  const handleAddNode = (module, removeId) => { /* ... */ };
  const handleNodeMove = (nodeId, position) => { /* ... */ };
  // ...

  // 返回简化的 JSX
  return (
    <div className="App">
      <Toolbar onLibraryToggle={...} onPreviewToggle={...} />
      <div className="App-body">
        <ModuleLibrary {...libraryProps} />
        <NodeCanvas {...canvasProps} />
        <PromptPreview {...previewProps} />
      </div>
    </div>
  );
}
```

### 第三阶段：样式和文档完善

- 为每个组件添加 CSS 模块
- 编写单元测试
- 完善错误处理
- 性能优化

## 迁移指南

如果你想立即使用已创建的工具函数和 Hooks：

### 第 1 步：引入工具函数
```javascript
import { 
  extractPlaceholderContent,
  getNodeFullContent
} from './utils/contentExtraction';

import {
  createNodeFromModule,
  deleteNodeWithConnections
} from './utils/nodeHelpers';

import {
  NODE_DEFAULTS,
  CANVAS_DEFAULTS
} from './utils/constants';
```

### 第 2 步：替换原有逻辑
将 App.js 中的相应逻辑替换为导入的函数和常量。

### 第 3 步：使用自定义 Hooks
```javascript
import { useCanvasState } from './hooks/useCanvasState';
import { useNodeManagement, useConnectionManagement } 
  from './hooks/useNodeManagement';

function App() {
  const canvas = useCanvasState();
  const { nodes, addNode, removeNode, moveNode } = useNodeManagement();
  const { connections, addConnection, removeConnection } 
    = useConnectionManagement();
  
  // 现在可以使用这些状态和方法
}
```

## 文件清单

### 已创建文件
- ✅ [README.md](../README.md) - 项目概述
- ✅ [ARCHITECTURE.md](../ARCHITECTURE.md) - 架构文档
- ✅ [DEVELOPMENT.md](../DEVELOPMENT.md) - 开发指南
- ✅ [REFACTORING.md](./REFACTORING.md) - 本文件
- ✅ [utils/constants.js](../src/utils/constants.js)
- ✅ [utils/contentExtraction.js](../src/utils/contentExtraction.js)
- ✅ [utils/nodeHelpers.js](../src/utils/nodeHelpers.js)
- ✅ [hooks/useCanvasState.js](../src/hooks/useCanvasState.js)
- ✅ [hooks/useNodeManagement.js](../src/hooks/useNodeManagement.js)

### 待创建文件
- ⬜ [components/Toolbar.js](../src/components/Toolbar.js)
- ⬜ [components/ModuleLibrary.js](../src/components/ModuleLibrary.js)
- ⬜ [components/NodeCanvas.js](../src/components/NodeCanvas.js)
- ⬜ [components/SingleModule.js](../src/components/SingleModule.js)
- ⬜ [components/PromptPreview.js](../src/components/PromptPreview.js)
- ⬜ [components/ZoomPercentageDisplay.js](../src/components/ZoomPercentageDisplay.js)
- ⬜ [hooks/useModuleLoading.js](../src/hooks/useModuleLoading.js)
- ⬜ [utils/validators.js](../src/utils/validators.js)
- ⬜ [utils/__tests__](../src/utils/__tests__/) - 单元测试

## 代码质量指标

### 当前状态
- App.js 行数：1167
- 平均函数长度：~50 行
- 圈复杂度：高

### 重构后目标
- App.js 行数：<200
- 平均函数长度：<30 行
- 圈复杂度：低到中等
- 测试覆盖率：>80%

## 下一步行动

1. **验证现有功能** - 确保应用仍能正常运行
2. **逐步迁移** - 使用新的工具函数和 Hooks 替换旧逻辑
3. **拆分组件** - 将组件提取到独立文件
4. **添加测试** - 为工具函数和 Hooks 编写单元测试
5. **性能优化** - 使用 React.memo、useMemo 等优化

## 参考资源

- [React Hooks 官方文档](https://react.dev/reference/react)
- [代码拆分最佳实践](https://kentcdodds.com/blog/modular-forms-and-layouts-in-react)
- [测试 React 应用](https://testing-library.com/docs/react-testing-library/intro/)

---

**创建日期**：2026年2月11日  
**最后更新**：2026年2月11日  
**维护者**：ModularReport Team
