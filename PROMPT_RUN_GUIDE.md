# PromptRun 组件使用指南

## 概述

`PromptRun` 是一个新添加的React组件，允许用户在ModularReport应用中集成大语言模型(LLM)功能。用户可以通过配置LLM API参数来调用任何兼容的LLM服务，获取智能化的内容生成和处理。

## 主要功能

### 1. **LLM API 配置**
   - 支持自定义API基础URL（Base URL）
   - 支持输入API密钥（支持密码字段隐藏显示）
   - 支持多个LLM模型选择
   - 支持调整温度（Temperature）参数控制输出的随机性

### 2. **调用LLM**
   - 一键调用LLM处理提示词
   - 实时加载状态显示
   - 详细的错误提示

### 3. **结果预览和管理**
   - 普通查看模式：紧凑的代码字体显示
   - 放大预览模式：大字体、清晰的格式化显示
   - 动态字体放大/缩小（支持12px-24px范围）
   - 一键复制结果到剪贴板

### 4. **配置面板可折叠**
   - 点击∨/▶按钮展开/折叠API配置区域
   - 节省屏幕空间，集中显示结果

## 界面说明

### 右侧面板布局
```
┌─────────────────────────┐
│   Prompt Preview        │ ← 展示选中节点的提示词内容
│                         │   (PromptPreview组件)
├─────────────────────────┤
│   LLM Run               │ ← LLM调用和结果显示
│ ▼ API配置(可折叠)      │   (PromptRun组件)
│  API Base: [......]    │
│  API Key:  [......]    │
│  Model:    [dropdown]  │
│  Temp:     [slider]    │
│  [▶Run] [Clear]        │
├─────────────────────────┤
│                         │
│  LLM结果显示区域        │
│  (普通查看/放大预览)    │
│                         │
│ [🔍Preview][📋Copy]    │
│ [A−][A+]               │
└─────────────────────────┘
```

## 使用步骤

### 基本工作流程

1. **在画布中创建节点流程**
   - 从左侧Module Library拖拽节点到中间画布
   - 连接节点以组成处理管道

2. **配置LLM参数**
   - 在右侧PromptRun面板中输入 API Base URL（可选，默认为OpenAI URL）
   - 输入您的LLM API密钥
   - 选择要使用的模型（支持GPT系列和Claude系列）
   - 调整Temperature参数（0=确定性，2=随机性）

3. **调用LLM**
   - 点击 **▶Run** 按钮
   - 等待LLM处理（显示⏳加载状态）

4. **查看结果**
   - 普通模式：自动显示结果（固定宽度字体）
   - 放大预览：点击 **🔍Preview** 进入放大查看模式

5. **保存结果**
   - 点击 **📋Copy** 将结果复制到剪贴板
   - 粘贴到其他应用或文档

## API 配置示例

### OpenAI (默认)
```
API Base: https://api.openai.com/v1
Model: gpt-4 或 gpt-3.5-turbo
API Key: sk-xxxxxxxxxxxxx
```

### Azure OpenAI
```
API Base: https://{resource-name}.openai.azure.com/v1
Model: gpt-4 或自定义部署名称
API Key: 您的Azure API密钥
```

### Anthropic Claude
```
API Base: https://api.anthropic.com/v1
Model: claude-3-opus 或其他Claude模型
API Key: sk-ant-xxxxxxxxxxxxx
```

### 本地部署 (Ollama等)
```
API Base: http://localhost:11434/v1
Model: 您的本地模型名称
API Key: 可选（本地无需密钥）
```

## PromptRun 组件详细说明

### 组件属性 (Props)

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `promptContent` | `string` | 否 | 要发送给LLM的提示词内容，来自PromptPreview中选中的节点 |

### 内部状态

| 状态 | 类型 | 初始值 | 说明 |
|------|------|--------|------|
| `apiKey` | `string` | `''` | 用户输入的LLM API密钥 |
| `apiBase` | `string` | `'https://api.openai.com/v1'` | LLM API的基础URL |
| `model` | `string` | `'gpt-4'` | 选定的LLM模型 |
| `temperature` | `number` | `0.7` | LLM温度参数 (范围: 0-2) |
| `isLoading` | `boolean` | `false` | LLM请求是否在进行中 |
| `result` | `string` | `''` | LLM返回的结果 |
| `error` | `string` | `''` | 请求过程中的错误信息 |
| `showPreview` | `boolean` | `false` | 是否显示放大预览模式 |
| `previewFontSize` | `number` | `14` | 预览模式的字体大小 |
| `expandedConfig` | `boolean` | `true` | 配置面板是否展开 |

### 核心函数

#### `handleRunLLM()`
调用LLM API的主函数：
- 验证API密钥和提示词内容
- 发送POST请求到LLM API
- 解析响应并显示结果
- 错误处理和用户反馈

```javascript
// API请求格式
POST {apiBase}/chat/completions
{
  model: string,
  messages: [{role: 'user', content: promptContent}],
  temperature: number,
  max_tokens: 4000
}
```

#### `handleCopyToClipboard()`
复制结果到系统剪贴板：
- 使用新的Clipboard API
- 显示临时成功提示
- 错误处理

#### `handleClearConfig()`
清空所有配置和结果：
- 重置API关键信息
- 清除之前的结果
- 恢复初始状态

## 特性说明

### 1. 温度参数滑块
- **范围**: 0 - 2.0
- **0.0**: 完全确定性输出，每次输入相同输出相同
- **0.7**: 平衡的创意和一致性（推荐）
- **1.5-2.0**: 高度创意和多样性

### 2. 字体调整
- **A−**: 减小字体 (最小12px)
- **A+**: 增大字体 (最大24px)
- 只在放大预览模式中可用

### 3. 错误处理
常见错误信息和解决方案：
| 错误 | 原因 | 解决方案 |
|------|------|--------|
| `Please enter API key` | 未输入API密钥 | 在API Key字段输入您的密钥 |
| `No prompt content to process` | 没有提示词内容 | 在PromptPreview中选择一个节点 |
| `API error: 401` | API密钥无效或过期 | 检查并更新您的API密钥 |
| `API error: 429` | 请求过于频繁 | 等待几秒后重试 |
| `Failed to copy to clipboard` | 系统剪贴板访问失败 | 检查浏览器权限设置 |

## 工作流程示例

### 场景1: 利用LLM生成营销文案

```
1. 在画布中创建节点：
   - [TEXT_INPUT] → 品牌信息
   - [SWOT_ANALYSIS] → 分析框架
   - [OUTPUT] → 最终输出

2. 连接节点：
   品牌信息 → SWOT_ANALYSIS → OUTPUT

3. 点击OUTPUT节点，在PromptPreview中查看生成的提示词

4. 在PromptRun中配置：
   - Model: gpt-4
   - Temperature: 0.8（创意）

5. 点击Run按钮

6. 收到结果后，点击Preview查看完整内容

7. 点击Copy复制到营销文档
```

### 场景2: 利用LLM总结报告

```
1. 创建节点：
   - [DATA_INPUT] → 原始数据
   - [FINANCIAL_ANALYSIS] → 分析模块
   - [OUTPUT] → 总结

2. 配置LLM：
   - Model: gpt-3.5-turbo（快速）
   - Temperature: 0.3（准确）
   - API Base: 本地部署URL

3. 调用Run获取总结

4. 使用Preview模式审查长篇内容

5. Copy到报告中
```

## 开发者指南

### 集成新的LLM供应商

如需支持新的LLM供应商，修改Model dropdown：

```javascript
<select value={model} onChange={(e) => setModel(e.target.value)}>
  <option value="gpt-4">gpt-4</option>
  <option value="gpt-4-turbo">gpt-4-turbo</option>
  <option value="your-new-model">Your New Model</option>
  {/* 添加新的选项 */}
</select>
```

### 自定义API请求格式

如果LLM服务的API格式不同，修改`handleRunLLM`中的请求体：

```javascript
body: JSON.stringify({
  // 自定义请求格式
  model: model,
  messages: [...],
  // 添加自定义参数
})
```

### 扩展预览功能

可添加以下功能：
- Markdown渲染
- 代码高亮
- 实时流式输出
- 性能指标显示

## 性能考虑

- **网络延迟**: LLM调用可能需要5-30秒，取决于API响应时间
- **Token限制**: 每个请求限制为4000 tokens
- **并发限制**: 建议同时只执行一个LLM请求

## 安全建议

⚠️ **重要**: 
- 不要在GitHub或公开仓库中提交真实的API密钥
- 使用环境变量存储敏感信息
- 对用户输入的提示词进行验证
- 实施请求速率限制防止滥用

## 故障排查

### 问题: LLM调用无响应

**症状**: 点击Run后没有加载状态，结果区域无变化

**解决方案**:
1. 打开浏览器控制台（F12）查看错误信息
2. 检查API Base URL是否正确
3. 确认API密钥是否有效
4. 检查网络连接

### 问题: "API error: 401"

**症状**: 显示认证失败错误

**解决方案**:
1. 验证API密钥是否正确复制（无多余空格）
2. 确认API密钥未过期
3. 检查是否使用了正确的API端点
4. 如使用Azure，确认资源名称和区域正确

### 问题: 结果被截断或不完整

**症状**: LLM返回内容不完整

**解决方案**:
1. 增加温度值（可能模型未完成生成）
2. 短缩输入提示词长度
3. 检查max_tokens设置（当前为4000）

## 未来改进计划

- [ ] 支持流式输出（实时字符流显示）
- [ ] Markdown渲染支持
- [ ] 代码块语法高亮
- [ ] 调用历史记录
- [ ] 批量处理多个输出节点
- [ ] 自定义系统提示词
- [ ] 成本和token使用统计
- [ ] 多语言支持

## 常见问题 (FAQ)

**Q: 是否支持其他LLM？**  
A: 是的，只要API格式兼容OpenAI标准即可。修改apiBase和model参数。

**Q: 结果可以保存吗？**  
A: 当前版本支持复制到剪贴板。建议复制到文本编辑器或笔记应用保存。

**Q: 支持批量处理吗？**  
A: 当前版本不支持。可以多次调用不同节点的内容。

**Q: LLM调用收费吗？**  
A: 取决于您选择的LLM供应商。OpenAI和Claude都按使用量收费。

**Q: 支持本地部署吗？**  
A: 是的，使用本地API Base URL（如`http://localhost:11434/v1`）。

## 相关资源

- [OpenAI API 文档](https://platform.openai.com/docs)
- [Anthropic Claude 文档](https://docs.anthropic.com)
- [Ollama 本地部署](https://ollama.ai)
- [LangChain 集成](https://python.langchain.com)

---

**最后更新**: 2026年2月11日  
**版本**: 1.0
