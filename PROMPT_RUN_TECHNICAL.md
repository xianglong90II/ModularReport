# PromptRun 组件技术文档

## 概述

`PromptRun` 是在ModularReport v1.1中新添加的组件，提供与大语言模型(LLM)的集成功能。该组件允许用户直接在应用中配置LLM API参数、发送提示词给LLM、接收和处理结果。

## 文件位置

- **组件代码**: `src/App.js` (第126-560行)
- **样式**: `src/App.css` (PromptRun相关样式)
- **使用位置**: App主组件的右侧面板容器 (第1637-1645行)

## 组件架构

### JSX 结构

```jsx
<div style={{flexDirection: 'column', ...}}>
  <PromptPreview ... />          {/* 上面板：提示词预览 */}
  <PromptRun promptContent={...}/> {/* 下面板：LLM调用和结果 */}
</div>
```

### 布局比例

- 右侧面板总宽度: **350px** (从原来的250px扩大)
- PromptPreview 最大高度: **40%** (可滚动)
- PromptRun 占用: **剩余60%** (flex: 1，占满剩余空间)

## 组件状态

### State 定义

```javascript
const [apiKey, setApiKey] = useState('');                    // LLM API密钥
const [apiBase, setApiBase] = useState('https://api.openai.com/v1'); // API基础URL
const [model, setModel] = useState('gpt-4');                 // 选定的模型
const [temperature, setTemperature] = useState(0.7);         // 温度参数
const [isLoading, setIsLoading] = useState(false);           // 加载状态
const [result, setResult] = useState('');                    // LLM结果
const [error, setError] = useState('');                      // 错误信息
const [showPreview, setShowPreview] = useState(false);       // 预览模式开关
const [previewFontSize, setPreviewFontSize] = useState(14);  // 预览字体大小
const [expandedConfig, setExpandedConfig] = useState(true);  // 配置面板展开状态
```

## 核心函数

### 1. handleRunLLM()

**职责**: 发送提示词给LLM并获取结果

**逻辑流程**:
```
验证输入 → 设置加载状态 → 构造API请求 → 发送请求 → 
解析响应 → 显示结果 → 自动切换到预览 → 处理错误
```

**请求格式**:
```javascript
fetch(`${apiBase}/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: {
    model: string,
    messages: [{role: 'user', content: promptContent}],
    temperature: number,
    max_tokens: 4000
  }
})
```

**响应处理**:
```javascript
const output = data.choices[0].message.content;
setResult(output);
setShowPreview(true);
```

**错误处理**:
- 验证错误: 直接显示用户友好的消息
- API错误: 捕获异常并显示详细错误信息
- 网络错误: "Error: {err.message}"

### 2. handleCopyToClipboard()

**职责**: 将结果复制到系统剪贴板

**实现**:
```javascript
navigator.clipboard.writeText(result)
  .then(() => {
    // 显示临时成功提示（2秒）
    setResult('✓ Copied to clipboard');
    setTimeout(() => setResult(originalResult), 2000);
  })
  .catch(err => setError('Failed to copy to clipboard'));
```

**兼容性**: 使用现代Clipboard API，需要HTTPS或localhost

### 3. handleClearConfig()

**职责**: 清空配置和结果

**功能**:
- 清空API密钥
- 清空之前的结果
- 清空错误提示
- 保留model和temperature设置

## UI 组件

### 1. 标题栏

```jsx
<div style={{display: 'flex', justifyContent: 'space-between', ...}}>
  <h2>LLM Run</h2>
  <button onClick={() => setExpandedConfig(!expandedConfig)}>
    {expandedConfig ? '▼' : '▶'}
  </button>
</div>
```

**功能**: 显示标题和展开/折叠配置区域的按钮

### 2. API 配置区域

#### API Base URL 输入框
```jsx
<input
  type="text"
  value={apiBase}
  placeholder="https://api.openai.com/v1"
  onChange={(e) => setApiBase(e.target.value)}
/>
```
- 可编辑，支持自定义API端点
- 默认为OpenAI官方URL

#### API Key 密码框
```jsx
<input
  type="password"
  value={apiKey}
  placeholder="Enter your API key"
  onChange={(e) => setApiKey(e.target.value)}
/>
```
- 使用密码输入类型隐藏密钥显示
- 必填项（显示红色 * 标记）

#### Model 选择器
```jsx
<select value={model} onChange={(e) => setModel(e.target.value)}>
  <option value="gpt-4">gpt-4</option>
  <option value="gpt-4-turbo">gpt-4-turbo</option>
  <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
  <option value="claude-3-opus">claude-3-opus</option>
  <option value="claude-3-sonnet">claude-3-sonnet</option>
  <option value="claude-3-haiku">claude-3-haiku</option>
</select>
```

支持的模型:
- **GPT系列**: gpt-4, gpt-4-turbo, gpt-3.5-turbo
- **Claude系列**: claude-3-opus, claude-3-sonnet, claude-3-haiku

#### Temperature 滑块
```jsx
<input
  type="range"
  min="0"
  max="2"
  step="0.1"
  value={temperature}
  onChange={(e) => setTemperature(parseFloat(e.target.value))}
/>
```

- 范围: 0 - 2.0
- 步长: 0.1
- 默认: 0.7
- 显示当前值: `Temperature: {temperature.toFixed(1)}`

#### 操作按钮组
```jsx
<button onClick={handleRunLLM} disabled={isLoading}>
  {isLoading ? '⏳ Running...' : '▶ Run'}
</button>
<button onClick={handleClearConfig}>Clear</button>
```

- **Run按钮**: 
  - 主绿色 (#4CAF50)
  - 加载时禁用并变灰
  - 显示加载状态: "⏳ Running..."

- **Clear按钮**:
  - 橙色 (#ff9800)
  - 一键重置配置

### 3. 错误显示区域

```jsx
{error && (
  <div style={{padding: '10px 12px', backgroundColor: '#ffebee', ...}}>
    ⚠️ {error}
  </div>
)}
```

- 背景红色提示危险
- 文字深红色 (#c62828)
- 条件渲染：仅当 error 非空时显示
- 包含错误类型：API错误、验证错误、网络错误

### 4. 结果工具栏

```jsx
<div style={{display: 'flex', gap: '8px', ...}}>
  <button onClick={() => setShowPreview(!showPreview)}>
    {showPreview ? '🔍 Hide' : '🔍 Preview'}
  </button>
  <button onClick={handleCopyToClipboard}>📋 Copy</button>
  {showPreview && (
    <div>
      <button onClick={() => setPreviewFontSize(prev => Math.max(prev - 2, 12))}>A−</button>
      <button onClick={() => setPreviewFontSize(prev => Math.min(prev + 2, 24))}>A+</button>
    </div>
  )}
</div>
```

**按钮功能**:
- **Preview**: 切换预览模式（蓝色#2196F3）
- **Copy**: 复制到剪贴板（橙色#FF9800）
- **A−/A+**: 字体大小调整 (仅在预览时显示，金色#FFC107)

### 5. 结果显示区域

#### 普通查看模式
```jsx
<div style={{
  fontFamily: 'monospace',
  fontSize: '12px',
  whiteSpace: 'pre-wrap'
}}>
  {result}
</div>
```

- 固定宽度字体 (monospace)
- 保留原始格式和缩进
- 适合查看代码或结构化文本

#### 放大预览模式
```jsx
<div style={{
  fontSize: `${previewFontSize}px`,
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
  backgroundColor: '#f5f5f5'
}}>
  {result}
</div>
```

- 可调整字体大小 (12-24px)
- 更好的行间距 (1.6)
- 浅灰背景便于阅读
- 适合长篇幅阅读和审核

#### 空状态显示
```jsx
<div style={{textAlign: 'center', color: '#999'}}>
  {isLoading ? (
    <div>⏳ Calling LLM...</div>
  ) : (
    <div>🚀 Configure API...Click Run</div>
  )}
</div>
```

- 加载中: 显示⏳图标和提示文本
- 无结果: 显示🚀图标和操作提示

## CSS 样式

### 新增样式

```css
/* 右侧面板容器 - 包含PromptPreview和PromptRun */
.App-body > div:last-child {
  display: flex;
  flex-direction: column;
  width: 350px;
  background-color: #ffffff;
  border-left: 1px solid #ddd;
  overflow: hidden;
}

/* 更新的PromptPreview样式 */
.PromptPreview {
  width: 350px;                    /* 从250px扩大到350px */
  /* ... 其他样式 */
  max-height: 40%;                 /* 新增：限制高度 */
  border-bottom: 1px solid #ddd;   /* 新增：分解线 */
}
```

### 布局说明

**宽度分配**:
- 左侧ModuleLibrary: 200px (可折叠)
- 中间NodeCanvas: flex (占满剩余)
- 右侧面板: 350px (PromptPreview + PromptRun)

**高度分配** (右侧面板):
- PromptPreview: 40% (可滚动)
- PromptRun: 60% (flex: 1)

## 集成点

### 在 App 主组件中的使用

```javascript
<PromptRun 
  promptContent={getSelectedForPreview()?.defaultPrompt || ''}
/>
```

**参数说明**:
- `promptContent`: 从PromptPreview选中节点的defaultPrompt字段获取，用作LLM输入
- 如果未选中节点，传入空字符串

### 与其他组件的交互

```
ModuleLibrary (模块选择)
    ↓
NodeCanvas (节点拖拽和连接)
    ↓
PromptPreview (显示选中节点的提示词)
    ↓
PromptRun (发送提示词给LLM并获取结果)
```

## API 标准

### 支持的 API 格式

本组件使用 **OpenAI 兼容格式** (OpenAI Chat Completions API):

```
POST {apiBase}/chat/completions
```

**请求体格式**:
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "user",
      "content": "Your prompt text here"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 4000
}
```

**响应体格式**:
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4",
  "usage": {...},
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "LLM response here"
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
```

### 支持的 LLM 服务

兼容以下提供商 (使用OpenAI格式API):
- **OpenAI** (官方)
- **Azure OpenAI** (Microsoft)
- **Ollama** (本地部署)
- **LM Studio** (本地部署)
- **Text Generation WebUI** (本地部署)
- **vLLM** (开源)
- **LocalAI** (开源)
- **Anthropic Claude** (需要转换API格式)

## 扩展可能性

### 1. 支持流式输出
```javascript
// 使用 fetch + ReadableStream
const response = await fetch(..., { stream: true });
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // 处理流数据
}
```

### 2. 自定义系统提示词
```javascript
messages: [
  {role: 'system', content: 'Custom system prompt'},
  {role: 'user', content: promptContent}
]
```

### 3. 历史记录
```javascript
const [history, setHistory] = useState([]);
// 保存每次调用的 {prompt, result, timestamp}
```

### 4. 批量处理
```javascript
// 遍历所有OUTPUT节点，收集内容并批量调用LLM
nodes
  .filter(n => n.type === 'OUTPUT')
  .forEach(node => { /* 处理 */ })
```

### 5. Markdown 渲染
```javascript
import ReactMarkdown from 'react-markdown';
// 在结果显示区使用 <ReactMarkdown>{result}</ReactMarkdown>
```

## 测试清单

- [ ] API密钥为空时显示验证错误
- [ ] 无提示词内容时显示警告
- [ ] LLM成功调用并显示结果
- [ ] 加载状态正确显示和隐藏
- [ ] 错误信息正确显示
- [ ] 复制到剪贴板功能工作
- [ ] 预览模式切换正常
- [ ] 字体大小调整在有效范围内 (12-24px)
- [ ] 配置面板可折叠/展开
- [ ] Clear按钮正确重置配置
- [ ] 支持不同的API Base URL
- [ ] 支持不同的模型选择
- [ ] Temperature滑块在0-2范围内工作

## 性能考虑

- **初始化**: 组件加载时没有额外的API调用
- **用户交互**: 仅在用户点击Run时发送请求
- **内存使用**: 结果存储在state中，支持较长的文本 (4000 tokens ≈ 8KB)
- **网络**: 请求超时设置为系统默认 (通常30秒)

## 安全建议

⚠️ **关键安全事项**:

1. **API密钥保护**:
   - 使用密码输入类型隐藏显示
   - 不要在代码中硬编码API密钥
   - 使用环境变量存储敏感信息
   - 启用CORS检查防止跨域访问

2. **输入验证**:
   - 验证promptContent长度
   - 限制API请求频率
   - 检查API Base URL的有效性

3. **输出处理**:
   - 对LLM输出进行清理（可选）
   - 避免执行不受信任的代码

## 故障排查

### 常见错误及解决方案

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `Please enter API key` | 未输入API密钥 | 在API Key字段输入密钥 |
| `No prompt content to process` | 未选择节点 | 在canvas中选择节点，PromptPreview会显示内容 |
| `API error: 401` | 认证失败 | 检查API密钥是否正确且未过期 |
| `API error: 429` | 速率限制 | 等待后重试，减少请求频率 |
| `Failed to copy to clipboard` | 权限问题 | 检查浏览器权限，使用HTTPS |
| Network timeout | 网络问题 | 检查网络连接，增加超时时间 |

## 版本历史

**v1.0 (初始版本)** - 2026-02-11
- 完整的LLM API集成
- 支持OpenAI兼容格式
- 结果预览和复制功能
- 配置面板折叠/展开
- 字体大小调整
- 错误处理和加载状态

## 相关文档

- [PROMPT_RUN_GUIDE.md](./PROMPT_RUN_GUIDE.md) - 用户使用指南
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发标准和规范
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 系统架构文档
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - API快速参考

---

**最后更新**: 2026-02-11  
**维护者**: ModularReport Team  
**许可证**: MIT
