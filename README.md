# 🧠 Modular Report

![logo](logo.png)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K41V52DS)


**English**
-----------

A node-based modular tool that empowers anyone—even without technical or writing expertise—to build structured thinking frameworks and generate business-grade reports using AI prompts. Just connect modules, shape your ideas, and let AI do the writing.

**Key Features:**
- 🔗 **Node-Based Modular System** - Drag-and-drop interface for building complex workflows
- 📝 **Smart Prompt Generation** - Intelligent placeholder-based content composition
- 🤖 **LLM Integration (NEW v1.1)** - Built-in support for OpenAI, Azure, and local LLM services
- 👁️ **Real-time Preview** - View generated content as you build
- 📋 **Copy & Export** - Easy clipboard integration for export

**中文**
--------

一个基于节点的模块化工具，即使没有专业知识或写作功底，也能轻松组装思维框架，通过 AI 提示词生成具备商业提案水准的报告。只需拼接模块，构思逻辑，剩下交给 AI。

**主要功能：**
- 🔗 **基于节点的模块系统** - 拖拽式界面构建复杂工作流
- 📝 **智能提示词生成** - 基于占位符的内容自动组合
- 🤖 **LLM 集成（新增 v1.1）** - 内置支持 OpenAI、Azure 和本地 LLM 服务
- 👁️ **实时预览** - 边构建边预览生成内容
- 📋 **复制导出** - 轻松复制到剪贴板

**日本語**
----------

専門知識や文章力がなくても大丈夫！ノードベースのモジュールツールで、誰でも思考フレームを組み立て、AIプロンプトを使ってビジネス提案レベルのレポートを自動生成できます。

**主な機能：**
- 🔗 **ノードベースモジュールシステム** - ドラッグ&ドロップで複雑なワークフローを作成
- 📝 **スマートプロンプト生成** - プレースホルダーベースの自動コンテンツ作成
- 🤖 **LLM統合（v1.1新機能）** - OpenAI、Azure、ローカルLLMサービスに対応
- 👁️ **リアルタイムプレビュー** - 構築しながらコンテンツを確認
- 📋 **コピー＆エクスポート** - クリップボードへの簡単統合

## Quick Start

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/your-repo/modular-report.git
cd modular-report

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app will open at `http://localhost:3000`

### Basic Workflow

1. **Build Your Module**: Drag modules from the left library onto the canvas
2. **Connect Modules**: Click and drag connections between module ports
3. **Preview Content**: View the generated text in the Prompt Preview panel
4. **Configure LLM** (NEW): Set your API credentials in the LLM Run panel
5. **Generate with AI**: Click Run to process content with your chosen LLM
6. **Copy Results**: Export the generated content to clipboard

## Components

### Core Components
- **NodeCanvas** - Central workspace for building node graphs
- **ModuleLibrary** - Repository of available modules and templates
- **PromptPreview** - Real-time display of generated prompts
- **PromptRun** (NEW) - LLM API configuration and execution

### Available Modules
- Basic I/O (Text, Image, Data Input/Output)
- Business Frameworks (SWOT, PESTLE, Porter's Five Forces, etc.)
- Marketing Tools (BCG Matrix, STP Analysis, etc.)
- HR Solutions (Talent Assessment, Development Planning, etc.)
- Finance Tools (Financial Analysis, Budget Planning, etc.)
- Technology (Architecture Design, Tech Roadmap, etc.)
- Productivity (SMART Goals, Eisenhower Matrix, etc.)

## New in v1.1: LLM Integration

The **PromptRun** component enables direct integration with large language models:

### Features
- **Multi-Provider Support** - OpenAI, Azure OpenAI, Claude, local deployments
- **Real-time Configuration** - Adjust API details and model parameters on-the-fly
- **Preview Modes** - Normal view and enlarged preview for different use cases
- **Result Management** - Copy to clipboard with one click
- **Error Handling** - Clear error messages and recovery options

### Supported LLM Services
- ✅ OpenAI (GPT-4, GPT-3.5)
- ✅ Azure OpenAI (Enterprise)
- ✅ Anthropic Claude (Multiple models)
- ✅ Ollama (Local deployment)
- ✅ LM Studio (Desktop client)
- ✅ vLLM (High-performance inference)

## Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [PROMPT_RUN_GUIDE.md](PROMPT_RUN_GUIDE.md) | User guide with examples | End users, product managers |
| [PROMPT_RUN_TECHNICAL.md](PROMPT_RUN_TECHNICAL.md) | Technical implementation details | Developers, architects |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design and data flow | Technical teams |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Development standards | Developers |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | API quick lookup | Developers |
| [CHANGELOG_v1.1.md](CHANGELOG_v1.1.md) | Version update details | All stakeholders |

## API Configuration Examples

### OpenAI (Recommended)
```
Base URL: https://api.openai.com/v1
Model: gpt-4
API Key: sk-xxxxxxxxxxxxx
```

### Local Ollama
```
Base URL: http://localhost:11434/v1
Model: llama2
API Key: (not required)
```

### Azure OpenAI
```
Base URL: https://{resource}.openai.azure.com/v1
Model: gpt-4
API Key: (Your Azure API key)
```

## Use Cases

### 1. Marketing Report Generation
Create SWOT analysis → Apply marketing frameworks → Generate promotional content

### 2. Business Analysis
Combine financial data → Analyze with multiple tools → Generate comprehensive reports

### 3. Human Resources
Assess talents → Apply development frameworks → Generate personalized plans

### 4. Technical Documentation
Define architecture → Apply design patterns → Generate technical specifications


## Development

### Available Scripts

```bash
npm start        # Run development server
npm test         # Run test suite
npm run build    # Build production bundle
npm run eject    # Eject from create-react-app
```

### Contributing

Contributions are welcome! 
## Future Roadmap

- [ ] Streaming LLM responses
- [ ] Markdown rendering
- [ ] Code syntax highlighting
- [ ] Conversation history
- [ ] Batch processing
- [ ] RAG (Retrieval-Augmented Generation) support
- [ ] TypeScript migration
- [ ] Unit and integration tests

## Troubleshooting

### LLM won't connect
- Verify API key is correct
- Check API Base URL format
- Ensure HTTPS for cloud APIs
- Check firewall for local deployments

### Results are incomplete
- Increase max_tokens setting (currently 4000)
- Adjust temperature parameter
- Shorten input prompt length

### Copy to clipboard not working
- Use HTTPS protocol
- Check browser permissions
- Try refreshing the page

## License

MIT License - see LICENSE file for details

## Support & Feedback

- 📧 Email: xianglong90233@gmail.com
- 💬 QQ group: 1074782831

## Version History

- **v1.0** (Initial) - Core node-based modular system

---

**Last Updated**: March 1, 2026  
**Current Version**: 1.0  
**Status**: Active Development
