# ModularReport 架构文档

## 目录
1. [系统概览](#系统概览)
2. [核心概念](#核心概念)
3. [组件架构](#组件架构)
4. [数据流](#数据流)
5. [状态管理](#状态管理)
6. [库存机制](#库存机制)

## 系统概览

ModularReport 是一个基于 React 的可视化节点图编辑系统，用于组织和执行模块化的报告生成流程。

### 系统特点

- **无后端依赖**：纯前端解决方案
- **实时渲染**：基于状态变化立即更新 UI
- **模块化**：模块通过 JSON 配置定义，易于扩展
- **可视化编辑**：直观的拖拽和连接操作

## 核心概念

### 1. 模块（Module）
预定义的功能单元，具有：
- 唯一标识符（id）
- 输入/输出端口定义
- 默认提示词（defaultPrompt）
- 可选的占位符（placeholders）用于智能提取

### 2. 节点（Node）
画布上的模块实例，具有：
- 唯一实例标识（nodeInstanceId）
- 屏幕坐标（position）
- 来自模块的继承属性
- 运行时输入值（从 nodeInputValues 获取）

### 3. 连接（Connection）
定义两个节点之间的数据流：
```
from → to
source node output port → target node input port
```

### 4. 占位符（Placeholder）
内容中的标记，用于选择性提取：
```
"[S] content A [W] content B [O] content C"
占位符: ["S", "W", "O"]
选择 "SO" 则提取对应内容
```

## 组件架构

### 顶层组件

#### App（应用根组件）
**职责**：
- 管理全局状态（nodes, connections, modules）
- 加载模块 JSON 文件
- 协调组件间通信
- 计算预览内容

**关键状态**：
```javascript
- modules[]              // 所有可用模块
- nodes[]               // 当前画布节点
- connections[]         // 节点连接
- selectedId            // 选中的模块/节点
- nodeInputValues{}     // 各节点的运行时值
- nodeCounter          // 生成唯一实例 ID
```

### 子组件

#### Toolbar（工具栏）
**职责**：
- 显示应用标题和 logo
- 提供展开/收起侧栏的按钮
- 应用级别的操作按钮

#### ModuleLibrary（模块库）
**职责**：
- 显示所有可用模块，按分类组织
- 支持拖拽到画布
- 点击查看模块详情
- 搜索/筛选功能（建议扩展）

**交互**：
```
用户拖拽模块 → handleDragStart
             → NodeCanvas 的 handleDrop
             → onAddNode → 创建新节点实例
```

#### NodeCanvas（节点画布）
**职责**：
- 渲染所有节点和连接线
- 处理拖拽、缩放、平移操作
- SVG 连接线管理
- 端口连接交互

**交互**：
1. **拖拽节点**：更新节点坐标
2. **连接端口**：记录连接关系
3. **删除连接**：悬停线条显示删除按钮
4. **缩放/平移**：鼠标滚轮和中键控制

#### SingleModule（单个节点）
**职责**：
- 渲染单个节点的 UI
- 处理输入框和文件上传
- 显示输入/输出端口

#### PromptPreview（预览面板）
**职责**：
- 显示选中模块或节点的预览内容
- 实时展示计算结果
- 支持内容复制（建议扩展）

#### ZoomPercentageDisplay（缩放显示）
**职责**：缩放时显示百分比提示

## 数据流

### 1. 模块加载流程

```
App 挂载
  ↓
读取 moduleFiles 列表
  ↓
异步加载每个 JSON 文件 (import)
  ↓
提取 moduleNodes 数组
  ↓
添加 category 属性
  ↓
setModules → ModuleLibrary 渲染
```

### 2. 节点创建流程

```
用户拖拽模块 → canvasRef.drop 事件
  ↓
计算拖拽位置
  ↓
调用 onAddNode(module, null)
  ↓
创建 newNode 对象
  - 合并模块属性
  - 生成 nodeInstanceId
  - 设置 position
  ↓
setNodes([...nodes, newNode])
  ↓
setNodeCounter++
  ↓
NodeCanvas 重新渲染新节点
```

### 3. 连接流程

```
用户点击输出端口 (handleOutputClick)
  ↓
setConnectionStart({nodeId, outputIdx, x, y})
  ↓
用户移动鼠标
  ↓
生成临时虚线跟踪鼠标
  ↓
用户点击目标输入端口 (handleInputClick)
  ↓
调用 onConnect(fromId, outputIdx, toId, inputIdx)
  ↓
创建新连接对象
  ↓
setConnections([...connections, newConnection])
  ↓
SVG 绘制新的实线连接
  ↓
重置 connectionStart 和 temporaryLine
```

### 4. 内容组合流程

```
用户选择节点 → getSelectedForPreview()
  ↓
检查节点类型
  ↓
如果是 output 节点 → getOutputNodeContent()
  ↓
递归：getNodeFullContent(nodeId)
  ├─ 查找输入连接
  ├─ 如果无上游连接，返回本节点内容
  └─ 如果有上游连接
     ├─ 递归获取上游节点内容
     ├─ 应用占位符提取（如指定）
     └─ 合并：上游内容 + 本节点内容
  ↓
根据选中的输出端口提取内容
  (extractPlaceholderContent)
  ↓
返回预览对象 { name, description, defaultPrompt }
  ↓
PromptPreview 显示结果
```

### 5. 占位符提取示例

```javascript
// 原始内容（SWOT 模块）
defaultPrompt = "[S] Strengths content\n[W] Weaknesses\n[O] Opportunities\n[T] Threats"
placeholders = ["S", "W", "O", "T"]

// 场景：用户连接第 0（S）和第 2（O）输出端口
connectionStart = { outputIdx: 0 }
connectionStart = { outputIdx: 2 }

// 生成的 outputPortOverride = "SO"

// 提取结果
extractPlaceholderContent(defaultPrompt, "SO", placeholders)
→ "Strengths content\nOpportunities"
```

## 状态管理

### 顶层状态（App）

| 状态 | 类型 | 说明 |
|------|------|------|
| modules | Array | 所有可用模块定义 |
| nodes | Array | 画布上的节点实例 |
| connections | Array | 节点间的连接 |
| selectedId | String | 当前选中项的 ID |
| nodeCounter | Number | 生成 nodeInstanceId 的计数器 |
| nodeInputValues | Object | { nodeInstanceId: value } |
| libraryExpanded | Boolean | 模块库面板展开状态 |
| previewExpanded | Boolean | 预览面板展开状态 |

### 局部状态（NodeCanvas）

| 状态 | 说明 |
|------|------|
| isDragging | 是否拖拽节点中 |
| draggedNode | 被拖拽的节点 ID |
| canvasPan | 画布平移偏移量 |
| canvasZoom | 画布缩放倍数 |
| connectionStart | 开始连接的源信息 |
| temporaryLine | 连接过程中的临时线 |
| showZoomPercentage | 是否显示缩放百分比 |

## 库存机制

### 模块库结构

模块库按 `category` 分类展示，支持的类别：

- **Basic**（basic.json）：基础模块
  - 文本输入、图片输入、数据输入
  - 最终输出节点

- **Marketing**（marketing.json）：营销分析
  - SWOT 分析
  - 市场细分
  - 竞争分析等

- **Routine**（routine.json）：日常管理
  - 任务管理
  - 项目规划等

- **Technology**（technology.json）：技术分析
  - 技术评估
  - 架构设计等

- **Finance**（finance.json）：财务分析
  - 财务报表
  - 成本分析等

- **HR**（hr.json）：人力资源
  - 人才评估
  - 薪酬分析等

- **Memes**（memes.json）：模板和备忘录
  - 常用模板
  - 思维模式等

### 模块 JSON 格式规范

```json
{
  "moduleNodes": [
    {
      "id": "UNIQUE_ID",
      "name": "Display Name",
      "type": "nodetype",
      "description": "一句话描述",
      "defaultPrompt": "默认提示词或内容",
      "input": ["input port 1", "input port 2"],
      "output": ["output port 1", "output port 2"],
      "placeholders": ["S", "W", "O"],
      "tags": ["tag1", "tag2"],
      "category": "Category Name"
    }
  ]
}
```

## 性能考虑

### 优化策略

1. **引用缓存**：nodeRefs 存储 DOM 引用，避免重复查找
2. **Refs 跟踪**：使用 useRef 保存最新状态值供事件处理器使用
3. **条件渲染**：预览面板折叠时节省渲染
4. **SVG 优化**：连接线使用 SVG，支持大量连接

### 潜在瓶颈

- 节点数量过多（>1000）时拖拽可能卡顿
- 递归内容提取在深层图时可能慢
- 实时连接线预览需要频繁重排

### 建议改进

- 虚拟滚动（如节点数>100）
- 连接线防抖（减少 SVG 更新频率）
- WebWorker 计算复杂的内容提取

---

**文档版本**：1.0  
**最后更新**：2026年2月11日
