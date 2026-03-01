# PromptRun 快速开始

## 🚀 30秒快速开始

### 第一步：打开应用
访问 `http://localhost:3000` (如果还未启动，运行 `npm start`)

### 第二步：创建节点流程
1. 从左侧 **Module Library** 拖拽模块到中间画布
2. 连接两个模块（从输出端口拖到输入端口）
3. 在右侧 **Prompt Preview** 查看生成的提示词

### 第三步：配置 LLM
1. 向下滚动到 **LLM Run** 面板
2. 输入你的 API Key：
   - OpenAI: 从 https://platform.openai.com/api-keys 获取
   - 本地: 运行 `ollama serve` 然后输入 `http://localhost:11434/v1`

### 第四步：调用 LLM
1. 点击顶部的 **▼** 按钮展开配置（如果已折叠）
2. 选择模型（推荐：gpt-4 或 gpt-3.5-turbo）
3. 点击 **▶ Run** 按钮
4. 等待 LLM 返回结果

### 第五步：查看和复制结果
1. 点击 **🔍 Preview** 进入放大预览模式
2. 使用 **A−/A+** 调整字体大小
3. 点击 **📋 Copy** 复制到剪贴板

## 🎯 实际使用场景

### 场景 1: 生成市场营销分析

**步骤**:
```
1. 拖拽 "TEXT_INPUT" 节点 → 输入品牌信息
2. 拖拽 "SWOT_ANALYSIS" 节点 → 点击连接
3. 拖拽 "OUTPUT" 节点 → 连接到 SWOT
4. 在右侧 Preview 查看生成的提示词
5. 配置 API Key
6. 点击 Run 
7. 预览结果 → 复制到 Word/Google Docs
```

**时间**: ~30 秒操作 + 10 秒 LLM 处理

### 场景 2: 财务数据总结

**步骤**:
```
1. 拖拽 "DATA_INPUT" 节点 → 粘贴财务报表
2. 拖拽 "FINANCIAL_ANALYSIS" → 连接
3. 拖拽 "OUTPUT" → 连接  
4. 使用 gpt-3.5-turbo 快速处理
5. 运行 LLM
6. 复制摘要到报告
```

## ⚙️ API 快速配置

### OpenAI
```
Base URL: https://api.openai.com/v1
Model: gpt-4 (或 gpt-3.5-turbo)
Key: sk-xxxxxxxxxxxxxxxxxxxxx
```

### 本地 Ollama
```
1. 先在终端运行: ollama serve
2. Base URL: http://localhost:11434/v1
3. Model: llama2 (或其他本地模型)
4. Key: (留空)
```

### Azure OpenAI
```
Base URL: https://{resource-name}.openai.azure.com/v1
Model: gpt-4
Key: (Azure API Key)
```

## 💡 使用技巧

### 技巧 1: 快速重置
如果 API 配置有误，点击 **Clear** 按钮重置所有设置

### 技巧 2: 调整输出风格
- Temperature = 0.3 (准确) → 事实性任务
- Temperature = 0.7 (平衡) → 推荐默认值
- Temperature = 1.5 (创意) → 创意写作

### 技巧 3: 批量处理
1. 修改节点输入值
2. 重新运行 LLM
3. 复制 → 粘贴
4. 重复 1-3

### 技巧 4: 预览优化
- 普通模式：查看代码结构
- 预览模式：易读文本格式
- 使用 **A+** 放大重要内容

## ❌ 常见错误及解决

### 错误：「Please enter API key」
**原因**: 你没有输入 API 密钥  
**解决**: 在 API Key 字段输入有效的密钥

### 错误：「No prompt content to process」
**原因**: 没有选中任何节点或节点没有内容  
**解决**: 
1. 在canvas中创建节点
2. 连接到output节点
3. 选中output节点
4. 右侧会显示提示词内容

### 错误：「API error: 401」
**原因**: API 密钥无效或过期  
**解决**:
1. 检查密钥是否正确复制（无多余空格）
2. 重新获取新的 API 密钥
3. 确认是否选择了正确的提供商

### 错误：「ECONNREFUSED localhost:11434」
**原因**: 本地 LLM 服务未启动  
**解决**:
```bash
# 如果使用 Ollama
ollama serve

# 然后在另一个终端
ollama pull llama2  # 下载模型
```

## 📚 更多资源

### 文档
- **PROMPT_RUN_GUIDE.md** - 完整用户指南（包含场景示例）
- **PROMPT_RUN_TECHNICAL.md** - 技术文档（开发者参考）
- **README.md** - 项目概览

### 获取帮助
1. 查阅 PROMPT_RUN_GUIDE.md 中的 FAQ 章节
2. 检查浏览器控制台错误 (F12)
3. 查看我们的故障排查指南

## ✨ 下一步

### 立即尝试
- [ ] 创建一个简单的节点流程
- [ ] 配置你的 API Key
- [ ] 调用 LLM 查看结果
- [ ] 尝试不同的模型和温度值

### 进阶使用
- [ ] 探索不同的模块库 (marketing, finance, hr 等)
- [ ] 创建复杂的多节点管道
- [ ] 对比不同 LLM 输出
- [ ] 使用预览模式细致审查

### 集成到工作流
- [ ] 批量处理内容
- [ ] 集成到你的报告或文档系统
- [ ] 建立内容生成管道
- [ ] 分享给团队成员

---

**提示**: 需要回顾完整文档？查看 [PROMPT_RUN_GUIDE.md](PROMPT_RUN_GUIDE.md)
