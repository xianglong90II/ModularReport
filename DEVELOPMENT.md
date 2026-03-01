# 开发指南

## 目录
1. [代码规范](#代码规范)
2. [文件组织](#文件组织)
3. [添加新功能](#添加新功能)
4. [调试技巧](#调试技巧)
5. [常见问题](#常见问题)
6. [性能优化](#性能优化)

## 代码规范

### JavaScript/React 规范

#### 命名约定

```javascript
// 常量：大写下划线分隔
const MAX_ZOOM_LEVEL = 3;
const DEFAULT_NODE_WIDTH = 280;

// 函数：驼峰命名
function handleNodeMove(nodeId, position) {}
const createNewNode = (module) => {}

// 组件：首字母大写（PascalCase）
function NodeCanvas({ nodes, connections }) {}

// 私有函数：_前缀（可选）
const _getNodeWidth = (nodeId) => {}

// 布尔变量：is/has/should 前缀
const [isDragging, setIsDragging] = useState(false);
const [hasConnections, setHasConnections] = useState(false);
```

#### 注释规范

```javascript
// 单行注释：短描述
const zoom = 1.2;

/**
 * 多行函数注释模板
 * @param {String} nodeId - 节点的唯一标识
 * @param {Object} position - 新的位置 {x, y}
 * @returns {void}
 */
function handleNodeMove(nodeId, position) {
  // 实现细节注释
  setNodes(nodes.map(n => 
    n.nodeInstanceId === nodeId ? { ...n, position } : n
  ));
}

// TODO: 待实现的功能
// FIXME: 已知问题和修复点
// HACK: 临时解决方案
// NOTE: 重要说明
```

#### 代码组织

```javascript
// 1. imports
import React, { useState, useRef } from 'react';
import './Component.css';

// 2. 常量定义
const DEFAULT_ZOOM = 1;
const MAX_NODES = 1000;

// 3. 组件定义
function MyComponent({ prop1, prop2 }) {
  // 3.1 状态声明
  const [state1, setState1] = useState(null);
  const [state2, setState2] = useState(false);
  
  // 3.2 Ref 声明
  const canvasRef = useRef(null);
  
  // 3.3 Effect 钩子
  useEffect(() => {
    // 初始化逻辑
    return () => {
      // 清理逻辑
    };
  }, [dependencies]);
  
  // 3.4 事件处理函数
  const handleClick = () => {};
  const handleDrag = () => {};
  
  // 3.5 计算函数
  const getNodeWidth = (nodeId) => {};
  
  // 3.6 渲染
  return (
    <div>
      {/* 渲染代码 */}
    </div>
  );
}

export default MyComponent;
```

### CSS 规范

```css
/* 使用 BEM 命名法 */
.NodeCanvas {}
.NodeCanvas__overlay {}
.NodeCanvas--dragging {}

/* 按逻辑分组 */
.SingleModule {
  /* Layout 布局 */
  position: absolute;
  display: flex;
  flex-direction: column;
  
  /* Box Model */
  width: 280px;
  padding: 10px;
  margin: 0;
  
  /* Typography 排版 */
  font-size: 14px;
  line-height: 1.5;
  
  /* Visual 视觉 */
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  /* Effects 效果 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.SingleModule:hover {
  transform: scale(1.05);
}
```

## 文件组织

### 推荐的项目结构

```
src/
├── components/
│   ├── Toolbar.js           # 工具栏组件
│   ├── Toolbar.css
│   ├── ModuleLibrary.js     # 模块库组件
│   ├── ModuleLibrary.css
│   ├── NodeCanvas.js        # 画布组件
│   ├── NodeCanvas.css
│   ├── SingleModule.js      # 单个节点组件
│   ├── SingleModule.css
│   ├── PromptPreview.js     # 预览面板组件
│   ├── PromptPreview.css
│   └── ZoomPercentageDisplay.js
├── hooks/                   # 自定义 Hooks
│   ├── useCanvasState.js    # 画布状态管理
│   ├── useNodeManagement.js # 节点管理
│   └── useConnectionManagement.js # 连接管理
├── utils/                   # 工具函数
│   ├── contentExtraction.js # 内容提取逻辑
│   ├── nodeHelpers.js       # 节点操作辅助函数
│   ├── constants.js         # 常量定义
│   └── validators.js        # 验证函数
├── modulenodes/             # 模块定义（JSON）
│   ├── basic.json
│   ├── marketing.json
│   └── ...
├── App.js                   # 主应用容器（待重构）
├── App.css
├── index.js
└── index.css
```

### 各模块职责说明

#### `components/` - React 组件

每个组件应该：
- 单一职责原则（只做一件事）
- 具有清晰的 props 接口
- 包含详细的 JSDoc 注释
- 与样式文件同目录

#### `hooks/` - 自定义 Hooks

用于提取可复用的逻辑，例如：
```javascript
// hooks/useNodeManagement.js
function useNodeManagement() {
  const [nodes, setNodes] = useState([]);
  
  const addNode = (module) => { /* ... */ };
  const removeNode = (nodeId) => { /* ... */ };
  const moveNode = (nodeId, position) => { /* ... */ };
  
  return { nodes, addNode, removeNode, moveNode };
}
```

#### `utils/` - 工具函数

独立的、纯函数或帮助函数：
```javascript
// utils/contentExtraction.js
export function extractPlaceholderContent(prompt, selector, placeholders) {
  // 实现提取逻辑
}

export function getNodeFullContent(nodeId, nodes, connections, values) {
  // 递归获取完整内容
}
```

## 添加新功能

### 1. 添加新的模块类型

**步骤**：

1. 创建或编辑 JSON 文件（`src/modulenodes/`）

```json
{
  "moduleNodes": [
    {
      "id": "NEW_MODULE",
      "name": "New Module",
      "type": "newtype",
      "description": "新的模块类型",
      "defaultPrompt": "...",
      "input": ["input1"],
      "output": ["output1"],
      "placeholders": ["A", "B"],
      "category": "NewCategory"
    }
  ]
}
```

2. 在 `App.js` 中 `loadModules` 函数的 `moduleFiles` 数组中添加文件名

```javascript
const moduleFiles = ['basic', 'marketing', 'routine', 'technology', 
                      'finance', 'hr', 'memes', 'mynewcategory'];
```

3. 如需特殊处理（如自定义输入框），在 `SingleModule` 中扩展 `type` 检查

```javascript
if (node.type === 'mynewtype') {
  // 自定义渲染逻辑
}
```

### 2. 添加新的交互功能

**示例**：实现模块搜索功能

1. **创建 Hook**（`hooks/useModuleSearch.js`）

```javascript
export function useModuleSearch(modules, searchTerm) {
  return modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
}
```

2. **更新组件**（`components/ModuleLibrary.js`）

```javascript
function ModuleLibrary({ modules, onSelectionChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredModules = useModuleSearch(modules, searchTerm);
  
  return (
    <div className="ModuleLibrary">
      <input 
        type="text"
        placeholder="搜索模块..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* 显示 filteredModules */}
    </div>
  );
}
```

### 3. 添加新的 CSS 样式

```css
/* 遵循 BEM 命名法 */
.ModuleLibrary__search {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.ModuleLibrary__search:focus {
  outline: none;
  border-color: #ffa500;
  box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
}
```

## 调试技巧

### 1. React DevTools

- 安装浏览器扩展：React Developer Tools
- 快速检查组件树和状态变化

### 2. 控制台日志

```javascript
// 在关键位置添加日志
console.log('节点创建:', newNode);
console.log('连接建立:', connections);
console.log('预览内容:', selectedForPreview);

// 使用分组和样式
console.group('节点操作');
console.log('ID:', nodeId);
console.log('位置:', position);
console.groupEnd();

// 性能测试
console.time('内容提取耗时');
getNodeFullContent(nodeId);
console.timeEnd('内容提取耗时');
```

### 3. 断点调试

在 Chrome DevTools 中：
1. F12 打开开发工具
2. Sources 选项卡
3. 点击代码行号设置断点
4. 刷新页面触发断点

### 4. 状态检查器

```javascript
// 在 App 组件中添加状态显示（仅开发环境）
{process.env.NODE_ENV === 'development' && (
  <div style={{ 
    position: 'fixed', 
    bottom: 10, 
    right: 10, 
    background: 'rgba(0,0,0,0.8)', 
    color: 'white',
    padding: '10px',
    fontSize: '12px',
    maxWidth: '300px',
    overflow: 'auto',
    maxHeight: '200px'
  }}>
    <pre>{JSON.stringify({
      nodeCount: nodes.length,
      connectionCount: connections.length,
      selectedId: selectedId
    }, null, 2)}</pre>
  </div>
)}
```

## 常见问题

### Q1: 节点拖拽不流畅

**原因**：频繁重渲染或坐标计算错误

**解决**：
- 检查坐标系转换（canvas 坐标 vs 屏幕坐标 vs 缩放后坐标）
- 使用 React.memo 避免不必要的重渲染
- 检查事件监听器是否正确移除

### Q2: 连接线不显示

**原因**：
1. SVG 坐标计算错误
2. SVG 的 overflow 属性
3. z-index 问题

**解决**：
```javascript
// 确保 SVG 包含足够的空间
<svg style={{ 
  overflow: 'visible',  // 关键！
  width: '100%', 
  height: '100%',
  position: 'absolute'
}} />
```

### Q3: 内容提取结果不对

**原因**：占位符匹配或递归逻辑错误

**调试**：
```javascript
// 在 extractPlaceholderContent 中添加日志
console.log('提取占位符:', selector);
console.log('原始内容:', prompt);
console.log('占位符列表:', placeholders);
console.log('结果:', result);
```

### Q4: 模块加载失败

**原因**：
1. JSON 文件路径错误
2. JSON 格式无效
3. 模块文件未导入

**解决**：
```javascript
// 添加详细的错误日志
try {
  const module = await import(`./modulenodes/${file}.json`);
  console.log(`成功加载 ${file}.json`, module);
} catch (error) {
  console.error(`加载失败 ${file}.json:`, error.message);
}
```

## 性能优化

### 1. 使用 React.memo 优化组件重渲染

```javascript
// 需要传入稳定的 props（避免每次都创建新对象）
const SingleModule = React.memo(function({ node, position, onRemove }) {
  return (
    <div style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      {/* ... */}
    </div>
  );
});
```

### 2. 使用 useMemo 缓存计算结果

```javascript
const nodeWidth = useMemo(() => getNodeWidth(nodeInstanceId), [nodeInstanceId]);

const filteredModules = useMemo(
  () => modules.filter(m => m.category === selectedCategory),
  [modules, selectedCategory]
);
```

### 3. 使用 useCallback 缓存函数

```javascript
const handleNodeMove = useCallback((nodeId, position) => {
  setNodes(nodes => nodes.map(n =>
    n.nodeInstanceId === nodeId ? { ...n, position } : n
  ));
}, []);
```

### 4. 虚拟化长列表

```javascript
// 如果模块库太大，使用虚拟滚动
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={modules.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      {/* 渲染单个模块 */}
    </div>
  )}
</FixedSizeList>
```

### 5. 防抖事件处理器

```javascript
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
}

// 使用
const debouncedSearch = useDebounce((term) => {
  setSearchTerm(term);
}, 300);
```

### 6. 代码分割和懒加载

```javascript
// 延迟加载重的组件
const NodeCanvas = React.lazy(() => import('./components/NodeCanvas'));

<Suspense fallback={<div>加载中...</div>}>
  <NodeCanvas {...props} />
</Suspense>
```

---

**文档版本**：1.0  
**最后更新**：2026年2月11日
