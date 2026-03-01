# 快速参考指南

快速查阅常用的函数、Hooks 和常量

## 工具函数快速查询

### contentExtraction.js

#### extractPlaceholderContent(prompt, selector, placeholdersList)
从文本提取指定占位符的内容

```javascript
const result = extractPlaceholderContent(
  "[S] Strengths [W] Weaknesses",
  "S",
  ["S", "W"]
);
// → "Strengths"
```

#### getNodeFullContent(nodeInstanceId, nodes, connections, nodeInputValues)
递归获取节点的完整内容（含上游）

```javascript
const fullContent = getNodeFullContent(
  "SWOT-0",
  nodes,
  connections,
  nodeInputValues
);
```

### nodeHelpers.js

#### generateNodeInstanceId(moduleId, counter)
生成唯一节点 ID：`${moduleId}-${counter}`

```javascript
const id = generateNodeInstanceId("TEXT_INPUT", 0);
// → "TEXT_INPUT-0"
```

#### createNodeFromModule(module, counter, position)
从模块创建新节点

```javascript
const node = createNodeFromModule(
  swotModule,
  0,
  { x: 100, y: 100 }
);
```

#### updateNodePosition(nodes, nodeInstanceId, position)
更新单个节点的位置

```javascript
const updated = updateNodePosition(
  nodes,
  "TEXT_INPUT-0",
  { x: 200, y: 150 }
);
```

#### deleteNodeWithConnections(nodes, connections, nodeInstanceId)
删除节点及其所有连接

```javascript
const { nodes: newNodes, connections: newConnections } = 
  deleteNodeWithConnections(nodes, connections, "SWOT-0");
```

#### getInputConnections(connections, nodeInstanceId)
获取指向某节点的所有输入连接

```javascript
const inputs = getInputConnections(connections, "OUTPUT-0");
```

#### getOutputConnections(connections, nodeInstanceId)
获取从某节点出发的所有输出连接

```javascript
const outputs = getOutputConnections(connections, "SWOT-0");
```

#### isPortConnected(connections, fromNodeId, outputIdx, toNodeId, inputIdx)
检查两个端口是否已连接

```javascript
const connected = isPortConnected(
  connections,
  "SWOT-0", 0,
  "OUTPUT-0", 0
);
```

#### computePlaceholderSelector(outputIndices, placeholders)
计算占位符选择器

```javascript
const selector = computePlaceholderSelector(
  [0, 2],
  ["S", "W", "O", "T"]
);
// → "SO"
```

## 自定义 Hooks 快速查询

### useCanvasState()
管理画布的所有交互状态

```javascript
const {
  canvasPan,           // { x, y } 平移
  canvasZoom,          // 缩放倍数
  isDragging,          // 是否拖拽中
  draggedNode,         // 被拖拽的节点 ID
  connectionStart,     // 连接起点信息
  temporaryLine,       // 等待中的临时线
  handleZoom,          // 缩放函数
  startDragging,       // 开始拖拽
  stopDragging,        // 停止拖拽
  startConnection,     // 开始连接
  cancelConnection     // 取消连接
} = useCanvasState();
```

### useNodeManagement()
管理节点的创建、删除、移动

```javascript
const {
  nodes,       // 节点数组
  nodeCounter, // 节点计数器
  addNode,     // 添加节点：(module, position?) → newNode
  removeNode,  // 删除节点：(nodeInstanceId) → void
  moveNode     // 移动节点：(nodeInstanceId, position) → void
} = useNodeManagement();
```

### useConnectionManagement()
管理连接的创建和删除

```javascript
const {
  connections,      // 连接数组
  addConnection,    // (fromId, outIdx, toId, inIdx) → newConnection
  removeConnection, // (connectionIndex) → void
  clearConnections  // () → void
} = useConnectionManagement();
```

### useNodeInputValues()
管理节点的输入值（如文本框内容）

```javascript
const {
  nodeInputValues,       // { nodeInstanceId: value }
  updateInputValue,      // (nodeInstanceId, value) → void
  clearInputValue,       // (nodeInstanceId) → void
  clearAllInputValues    // () → void
} = useNodeInputValues();
```

### useSelection()
管理选中状态

```javascript
const {
  selectedId,      // 当前选中的 ID 或 null
  setSelectedId,   // (id) → void
  clearSelection   // () → void
} = useSelection();
```

## 常量快速查询

### CANVAS_DEFAULTS
```javascript
import { CANVAS_DEFAULTS } from './utils/constants';

CANVAS_DEFAULTS.DEFAULT_ZOOM    // 1
CANVAS_DEFAULTS.MIN_ZOOM        // 0.2
CANVAS_DEFAULTS.MAX_ZOOM        // 3
CANVAS_DEFAULTS.ZOOM_STEP       // 1.2
CANVAS_DEFAULTS.DEFAULT_PAN     // { x: 0, y: 0 }
```

### NODE_DEFAULTS
```javascript
import { NODE_DEFAULTS } from './utils/constants';

NODE_DEFAULTS.WIDTH             // 280
NODE_DEFAULTS.CONTENT_START_Y   // 55
NODE_DEFAULTS.PORT_SPACING      // 35
NODE_DEFAULTS.DEFAULT_POSITION  // { x: 100, y: 100 }
```

### CONNECTION_DEFAULTS
```javascript
import { CONNECTION_DEFAULTS } from './utils/constants';

CONNECTION_DEFAULTS.COLOR                  // '#ffa500'
CONNECTION_DEFAULTS.STROKE_WIDTH           // 2
CONNECTION_DEFAULTS.DASH_ARRAY             // '5,5'
CONNECTION_DEFAULTS.DELETE_BUTTON_RADIUS   // 12
```

### NODE_TYPES
```javascript
import { NODE_TYPES } from './utils/constants';

NODE_TYPES.TEXT_INPUT      // 'textinput'
NODE_TYPES.IMAGE_INPUT     // 'imageinput'
NODE_TYPES.DATA_INPUT      // 'datainput'
NODE_TYPES.OUTPUT          // 'output'
NODE_TYPES.ANALYSIS        // 'analysis'
NODE_TYPES.TEMPLATE        // 'template'
```

### MODULE_CATEGORIES
```javascript
import { MODULE_CATEGORIES } from './utils/constants';

MODULE_CATEGORIES
// → ['basic', 'marketing', 'routine', 'technology', 'finance', 'hr', 'memes']
```

## 常见使用场景

### 场景 1：用户拖拽添加新节点

```javascript
function App() {
  const canvas = useCanvasState();
  const { addNode } = useNodeManagement();
  const { nodeInputValues } = useNodeInputValues();

  // canvas.drop 事件中
  const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
  const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
  
  // 考虑缩放和平移
  const realX = (x - canvas.canvasPan.x) / canvas.canvasZoom;
  const realY = (y - canvas.canvasPan.y) / canvas.canvasZoom;
  
  addNode(module, { x: realX, y: realY });
}
```

### 场景 2：获取选中节点的完整输出内容

```javascript
import { getNodeFullContent } from './utils/contentExtraction';

function PromptPreview({ selectedId }) {
  const nodeId = selectedId.replace('node-', '');
  
  const content = getNodeFullContent(
    nodeId,
    nodes,
    connections,
    nodeInputValues
  );
  
  return <div>{content}</div>;
}
```

### 场景 3：删除节点时清理连接

```javascript
import { deleteNodeWithConnections } from './utils/nodeHelpers';

function handleDeleteNode(nodeId) {
  const { nodes: newNodes, connections: newConnections } = 
    deleteNodeWithConnections(nodes, connections, nodeId);
  
  setNodes(newNodes);
  setConnections(newConnections);
}
```

### 场景 4：建立节点连接

```javascript
const { canvasZoom, canvasPan } = useCanvasState();
const { addConnection } = useConnectionManagement();

function handleOutputPortClick(nodeId, outputIdx) {
  const node = nodes.find(n => n.nodeInstanceId === nodeId);
  
  // 获取端口的屏幕坐标
  const portElement = document.querySelector(
    `[data-port="${nodeId}-out-${outputIdx}"]`
  );
  const rect = portElement.getBoundingClientRect();
  
  canvas.startConnection(nodeId, outputIdx, rect.x, rect.y);
}

function handleInputPortClick(nodeId, inputIdx) {
  if (canvas.connectionStart) {
    // 建立连接
    addConnection(
      canvas.connectionStart.nodeId,
      canvas.connectionStart.outputIdx,
      nodeId,
      inputIdx
    );
    
    canvas.cancelConnection();
  }
}
```

### 场景 5：占位符选择器的应用

```javascript
import { 
  computePlaceholderSelector,
  extractPlaceholderContent 
} from './utils/contentExtraction';

// 假设 SWOT 节点连接了输出 0(S) 和 2(O)
const swotNode = nodes.find(n => n.nodeInstanceId === 'SWOT-0');
const swotConnections = getOutputConnections(connections, 'SWOT-0');

const outputIndices = swotConnections.map(c => c.from.outputIdx);
const selector = computePlaceholderSelector(
  outputIndices,
  swotNode.placeholders
);
// → selector = "SO"

// 然后提取内容
const content = extractPlaceholderContent(
  swotNode.defaultPrompt,
  selector,
  swotNode.placeholders
);
```

## 调试技巧

### 打印节点信息
```javascript
console.log('当前节点:', nodes);
console.log('当前连接:', connections);
console.log('选中ID:', selectedId);
```

### 验证占位符提取
```javascript
import { extractPlaceholderContent } from './utils/contentExtraction';

// 测试占位符提取
const test = "[A] Content A [B] Content B [C] Content C";
console.log('提取 A:', extractPlaceholderContent(test, 'A', ['A', 'B', 'C']));
console.log('提取 AC:', extractPlaceholderContent(test, 'AC', ['A', 'B', 'C']));
```

### 检查连接是否正确
```javascript
import { getInputConnections, getOutputConnections } from './utils/nodeHelpers';

const nodeId = 'SWOT-0';
console.log('输入连接:', getInputConnections(connections, nodeId));
console.log('输出连接:', getOutputConnections(connections, nodeId));
```

## PromptRun 组件快速参考

### PromptRun 使用方式

```javascript
<PromptRun 
  promptContent={selectedNodeContent}
/>
```

### PromptRun Props

| Props | 类型 | 说明 |
|------|------|------|
| `promptContent` | `string` | 发送给LLM的提示词内容 |

### PromptRun 内部状态速查

| 状态 | 初始值 | 用途 |
|-----|--------|------|
| `apiKey` | `''` | LLM API密钥 |
| `apiBase` | `'https://api.openai.com/v1'` | API基础URL |
| `model` | `'gpt-4'` | 选中的LLM模型 |
| `temperature` | `0.7` | LLM温度参数 |
| `isLoading` | `false` | 是否正在调用LLM |
| `result` | `''` | LLM返回结果 |
| `error` | `''` | 错误信息 |
| `showPreview` | `false` | 是否显示预览模式 |
| `previewFontSize` | `14` | 预览模式字体大小 |
| `expandedConfig` | `true` | 配置面板是否展开 |

### 常用 LLM 配置

#### OpenAI (推荐)
```javascript
apiBase = "https://api.openai.com/v1"
model = "gpt-4" // 或 "gpt-3.5-turbo"
temperature = 0.7
```

#### Azure OpenAI
```javascript
apiBase = "https://{resource-name}.openai.azure.com/v1"
model = "gpt-4" // 需要匹配Azure部署名称
temperature = 0.7
```

#### 本地部署 (Ollama)
```javascript
apiBase = "http://localhost:11434/v1"
model = "llama2" // 或其他本地模型名称
temperature = 0.5
apiKey = "" // 本地无需密钥
```

#### Anthropic Claude
```javascript
apiBase = "https://api.anthropic.com/v1"
model = "claude-3-opus"
temperature = 0.7
```

### LLM API 调用模式

```javascript
// PromptRun内部的API调用
const response = await fetch(`${apiBase}/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: model,
    messages: [{role: 'user', content: promptContent}],
    temperature: temperature,
    max_tokens: 4000
  })
});

// 处理响应
const data = await response.json();
const output = data.choices[0].message.content;
```

### Temperature 参数指南

| 值 | 特性 | 使用场景 |
|----|------|---------|
| 0.0 | 完全确定 | 事实性任务、代码生成 |
| 0.3-0.5 | 低随机性 | 总结、分类、提取 |
| 0.7 | 平衡 | **推荐值**，创意+准确 |
| 1.0-1.5 | 高随机性 | 创意写作、头脑风暴 |
| 2.0 | 最大随机性 | 随机生成、实验 |

### 错误处理速查

```javascript
// 验证错误
if (!apiKey.trim()) {
  setError('Please enter API key');
}

// 内容错误
if (!promptContent || promptContent.trim() === '') {
  setError('No prompt content to process');
}

// API错误
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error?.message || `API error: ${response.status}`);
}

// 网络错误
catch (err) {
  setError(`Error: ${err.message}`);
}
```

### PromptRun 事件流程

```
用户操作 → 状态更新 → 验证 → API调用 → 响应处理 → UI更新
   ↓          ↓        ↓      ↓        ↓        ↓
输入配置 → setState  验证通过 POST    JSON解析  显示结果
选择模型   更新state 无密钥  /v1/chat  data[0]  setResult
调整温度            无内容  /completions choices  自动Preview
点击Run
```

### PromptRun 按钮快速表

| 按钮 | 功能 | 快捷键 | 状态 |
|-----|------|--------|------|
| ▶ Run | 调用LLM | 无 | isLoading=false时启用 |
| Clear | 重置配置 | 无 | 总是启用 |
| 🔍 Preview | 切换预览 | 无 | result非空时启用 |
| 📋 Copy | 复制结果 | 无 | result非空时启用 |
| A− | 缩小字体 | 无 | 预览模式启用时 |
| A+ | 放大字体 | 无 | 预览模式启用时 |

### 文件大小限制

- **Token限制**: 4000 tokens (单次请求)
- **字体范围**: 12px - 24px (预览)
- **Temperature范围**: 0 - 2.0
- **API粘贴板**: 浏览器剪贴板限制 (通常1MB)

### 支持的API提供商列表

✅ **官方支持**:
- OpenAI (GPT-3.5, GPT-4, GPT-4 Turbo)
- Microsoft Azure OpenAI
- Anthropic Claude (需API转换)

✅ **开源兼容** (OpenAI格式):
- Ollama
- LM Studio
- vLLM
- LocalAI
- Text Generation WebUI

⚠️ **需要适配**:
- 其他格式的API需要自定义请求体

## 导入检查清单

使用新的函数、Hooks 和组件时，检查以下导入：

- [ ] ✅ `import { ... } from './utils/constants';`
- [ ] ✅ `import { ... } from './utils/contentExtraction';`
- [ ] ✅ `import { ... } from './utils/nodeHelpers';`
- [ ] ✅ `import { useCanvasState } from './hooks/useCanvasState';`
- [ ] ✅ `import { useNodeManagement, ... } from './hooks/useNodeManagement';`
- [ ] ✅ `<PromptRun promptContent={...} />` (PromptRun已在App.js中)

---

**快速参考版本**：1.0  
**最后更新**：2026年2月11日
