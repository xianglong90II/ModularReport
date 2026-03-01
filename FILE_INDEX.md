# 📑 文件索引和导航指南

快速定位项目中的各个文档和代码文件

## 🏠 项目根目录

### 📋 项目文档

按优先级排列：

#### 🌟 必读文档（首先阅读）
| 文件 | 用途 | 适合人群 | 阅读时间 |
|------|------|---------|---------|
| [README.md](./README.md) | 项目概述、快速开始 | 所有人 | 10 分钟 |
| [PROJECT_COMPLETION_REPORT.md](./PROJECT_COMPLETION_REPORT.md) | 重构完成报告、改进说明 | 项目管理者 | 15 分钟 |

#### 📚 核心设计文档
| 文件 | 用途 | 适合人群 | 阅读时间 |
|------|------|---------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 详细架构设计、数据流、组件层次 | 开发者 | 30 分钟 |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | 开发规范、编码指南、最佳实践 | 开发者 | 25 分钟 |

#### 🔧 参考和工具
| 文件 | 用途 | 适合人群 | 阅读时间 |
|------|------|---------|---------|
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | API 快速查询、常见场景示例 | 开发者 | 5-10 分钟 |
| [REFACTORING.md](./REFACTORING.md) | 重构进度、迁移指南、待办清单 | 维护者 | 20 分钟 |
| [SUMMARY.md](./SUMMARY.md) | 重构总结、文件详情、改进指标 | 技术主管 | 15 分钟 |

---

## 📂 源代码结构

### src 目录

```
src/
├── App.js                    # 主应用（待重构）
├── App.css                   # 应用样式
├── index.js                  # 应用入口
├── index.css                 # 全局样式
├── reportWebVitals.js        # 性能报告
├── setupTests.js             # 测试配置
├── logo.png                  # Logo 文件
│
├── utils/                    # ✨ 工具函数模块
│   ├── constants.js          # 常量定义（10+ 组）
│   ├── contentExtraction.js  # 占位符提取和组合逻辑
│   └── nodeHelpers.js        # 节点操作辅助函数
│
├── hooks/                    # ✨ 自定义 Hooks
│   ├── useCanvasState.js     # 画布状态管理 Hook
│   └── useNodeManagement.js  # 节点/连接/输入值管理 Hooks
│
├── components/               # ⬜ 待拆分的组件（未来方向）
│   ├── Toolbar.js
│   ├── ModuleLibrary.js
│   ├── NodeCanvas.js
│   ├── SingleModule.js
│   ├── PromptPreview.js
│   └── ZoomPercentageDisplay.js
│
└── modulenodes/              # 模块定义文件
    ├── basic.json            # 基础模块（输入/输出）
    ├── marketing.json        # 营销分析模块
    ├── routine.json          # 日常工作模块
    ├── technology.json       # 技术分析模块
    ├── finance.json          # 财务分析模块
    ├── hr.json               # 人力资源模块
    └── memes.json            # 模板和备忘模块
```

---

## 📖 按需求快速导航

### "我想..."

#### 理解项目工作原理
1. 阅读：[README.md](./README.md) → "核心特性" 和 "核心架构"
2. 学习：[ARCHITECTURE.md](./ARCHITECTURE.md) → "核心概念" 和 "数据流"
3. 查看：[QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → 常见使用场景

#### 开始开发新功能
1. 查看：[QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → "常见使用场景"
2. 参考：[DEVELOPMENT.md](./DEVELOPMENT.md) → "添加新功能"
3. 遵循：[DEVELOPMENT.md](./DEVELOPMENT.md) → "代码规范"

#### 添加新的模块类型
1. 查看：[README.md](./README.md) → "核心数据结构"
2. 参照：[src/modulenodes/](./src/modulenodes/) 中的现有模块
3. 遵循：[DEVELOPMENT.md](./DEVELOPMENT.md) → "添加新模块"

#### 修复 Bug
1. 查看：[DEVELOPMENT.md](./DEVELOPMENT.md) → "调试技巧"
2. 参考：[QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → "调试技巧"
3. 检查：相关源文件中的注释

#### 优化性能
1. 阅读：[ARCHITECTURE.md](./ARCHITECTURE.md) → "性能考虑"
2. 参考：[DEVELOPMENT.md](./DEVELOPMENT.md) → "性能优化"

#### 编写测试
1. 学习：[DEVELOPMENT.md](./DEVELOPMENT.md) → "添加新功能" → "编写测试"
2. 查看：[src/utils/](./src/utils/) 中的纯函数（易于测试）

#### 重构代码
1. 查看：[REFACTORING.md](./REFACTORING.md) → "待完成工作"
2. 遵循：[DEVELOPMENT.md](./DEVELOPMENT.md) → "代码规范"
3. 参考：[src/](./src/) 中已有的重构示例

---

## 📍 文件快速查询

### 按功能查找源文件

#### 常量和配置
- **画布参数**：[src/utils/constants.js](./src/utils/constants.js) → `CANVAS_DEFAULTS`
- **节点参数**：[src/utils/constants.js](./src/utils/constants.js) → `NODE_DEFAULTS`
- **连接线样式**：[src/utils/constants.js](./src/utils/constants.js) → `CONNECTION_DEFAULTS`
- **模块列表**：[src/utils/constants.js](./src/utils/constants.js) → `MODULE_CATEGORIES`

#### 核心算法
- **占位符提取**：[src/utils/contentExtraction.js](./src/utils/contentExtraction.js) → `extractPlaceholderContent()`
- **内容组合**：[src/utils/contentExtraction.js](./src/utils/contentExtraction.js) → `getNodeFullContent()`
- **输出节点内容**：[src/utils/contentExtraction.js](./src/utils/contentExtraction.js) → `getOutputNodeContent()`

#### 节点操作
- **创建节点**：[src/utils/nodeHelpers.js](./src/utils/nodeHelpers.js) → `createNodeFromModule()`
- **删除节点**：[src/utils/nodeHelpers.js](./src/utils/nodeHelpers.js) → `deleteNodeWithConnections()`
- **移动节点**：[src/utils/nodeHelpers.js](./src/utils/nodeHelpers.js) → `updateNodePosition()`
- **查询连接**：[src/utils/nodeHelpers.js](./src/utils/nodeHelpers.js) → `getInputConnections()` / `getOutputConnections()`

#### 状态管理 Hooks
- **画布交互**：[src/hooks/useCanvasState.js](./src/hooks/useCanvasState.js) → `useCanvasState()`
- **节点管理**：[src/hooks/useNodeManagement.js](./src/hooks/useNodeManagement.js) → `useNodeManagement()`
- **连接管理**：[src/hooks/useNodeManagement.js](./src/hooks/useNodeManagement.js) → `useConnectionManagement()`
- **输入值**：[src/hooks/useNodeManagement.js](./src/hooks/useNodeManagement.js) → `useNodeInputValues()`

#### 模块定义
- **基础模块**（输入/输出）：[src/modulenodes/basic.json](./src/modulenodes/basic.json)
- **SWOT 等营销分析**：[src/modulenodes/marketing.json](./src/modulenodes/marketing.json)
- **任务管理等日常模块**：[src/modulenodes/routine.json](./src/modulenodes/routine.json)
- **架构、技术评估等**：[src/modulenodes/technology.json](./src/modulenodes/technology.json)
- **财务分析、预算规划**：[src/modulenodes/finance.json](./src/modulenodes/finance.json)
- **人才评估、薪酬分析**：[src/modulenodes/hr.json](./src/modulenodes/hr.json)
- **模板、备忘录**：[src/modulenodes/memes.json](./src/modulenodes/memes.json)

### 按任务查找文档

#### 快速参考类
| 需求 | 文档 | 章节 |
|------|------|------|
| 查询 API 签名 | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | "工具函数快速查询" |
| 查询 Hook 用法 | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | "自定义 Hooks 快速查询" |
| 查询常量值 | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | "常量快速查询" |
| 看代码示例 | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | "常见使用场景" |

#### 学习类
| 需求 | 文档 | 章节 |
|------|------|------|
| 理解项目架构 | [ARCHITECTURE.md](./ARCHITECTURE.md) | "系统概览" 和 "组件架构" |
| 学习模块概念 | [ARCHITECTURE.md](./ARCHITECTURE.md) | "核心概念" |
| 理解数据流 | [ARCHITECTURE.md](./ARCHITECTURE.md) | "数据流" |
| 理解状态管理 | [ARCHITECTURE.md](./ARCHITECTURE.md) | "状态管理" |

#### 规范类
| 需求 | 文档 | 章节 |
|------|------|------|
| 命名规范 | [DEVELOPMENT.md](./DEVELOPMENT.md) | "命名约定" |
| 注释规范 | [DEVELOPMENT.md](./DEVELOPMENT.md) | "注释规范" |
| 代码组织 | [DEVELOPMENT.md](./DEVELOPMENT.md) | "代码组织" |
| CSS 规范 | [DEVELOPMENT.md](./DEVELOPMENT.md) | "CSS 规范" |

#### 指南类
| 需求 | 文档 | 章节 |
|------|------|------|
| 添加新功能 | [DEVELOPMENT.md](./DEVELOPMENT.md) | "添加新功能" |
| 调试技巧 | [DEVELOPMENT.md](./DEVELOPMENT.md) | "调试技巧" |
| 常见问题 | [DEVELOPMENT.md](./DEVELOPMENT.md) | "常见问题" |
| 性能优化 | [DEVELOPMENT.md](./DEVELOPMENT.md) | "性能优化" |

---

## 🔍 搜索提示

### 在文件中搜索特定内容

#### 如何找到函数用法？
1. 在 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) 中搜索函数名
2. 复制示例代码
3. 按需修改使用

#### 如何找到常量值？
1. 打开 [src/utils/constants.js](./src/utils/constants.js)
2. 搜索常量名称
3. 查看注释了解含义

#### 如何找到某个 Hook 的用法？
1. 打开 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
2. 搜索 Hook 名称
3. 查看返回值说明和示例

#### 如何找到某个模块的定义？
1. 打开 [src/modulenodes/](./src/modulenodes/) 下的 JSON 文件
2. 搜索模块的 `id` 或 `name`
3. 查看完整定义

---

## 📈 学习路径

### 路径 1：快速上手（1 小时）
```
README.md (10 min)
  ↓
QUICK_REFERENCE.md (20 min)
  ↓
阅读本文件中的示例代码 (30 min)
```

### 路径 2：完整理解（3 小时）
```
README.md (15 min)
  ↓
ARCHITECTURE.md (45 min)
  ↓
DEVELOPMENT.md (60 min)
  ↓
QUICK_REFERENCE.md (30 min)
  ↓
查看源代码 (30 min)
```

### 路径 3：深入学习（1 周）
```
完成路径 2
  ↓
阅读所有源代码文件
  ↓
编写单元测试
  ↓
尝试添加新功能
  ↓
进行代码审查
```

---

## 🎯 按角色快速导航

### 项目经理
1. [README.md](./README.md) → 项目概述
2. [PROJECT_COMPLETION_REPORT.md](./PROJECT_COMPLETION_REPORT.md) → 完成报告
3. 可选：[SUMMARY.md](./SUMMARY.md) → 重构总结

### 技术主管
1. [ARCHITECTURE.md](./ARCHITECTURE.md) → 系统设计
2. [PROJECT_COMPLETION_REPORT.md](./PROJECT_COMPLETION_REPORT.md) → 质量指标
3. [REFACTORING.md](./REFACTORING.md) → 下一步计划

### 高级开发者
1. [ARCHITECTURE.md](./ARCHITECTURE.md) → 完整架构
2. [DEVELOPMENT.md](./DEVELOPMENT.md) → 开发规范
3. [REFACTORING.md](./REFACTORING.md) → 重构计划
4. 源代码文件

### 初级开发者
1. [README.md](./README.md) → 快速开始
2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → API 查询
3. [DEVELOPMENT.md](./DEVELOPMENT.md) → 开发规范
4. 源代码注释

### 质量保证
1. [DEVELOPMENT.md](./DEVELOPMENT.md) → 规范检查
2. [PROJECT_COMPLETION_REPORT.md](./PROJECT_COMPLETION_REPORT.md) → 质量指标
3. 源代码
4. 测试用例（待编写）

---

## 📞 获取帮助

### 问题类型 → 查看文档
| 问题 | 查看 |
|------|------|
| "这个函数怎么用？" | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) |
| "项目结构是什么样的？" | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| "有什么编码规范？" | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| "如何添加新功能？" | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| "代码在哪个文件？" | 本文件（文件快速查询） |
| "性能怎么优化？" | [DEVELOPMENT.md](./DEVELOPMENT.md) ♯ 性能优化 |
| "怎么调试？" | [DEVELOPMENT.md](./DEVELOPMENT.md) ♯ 调试技巧 |

---

## ✅ 文件完整性检查

- [x] README.md - 项目概述 ✓
- [x] ARCHITECTURE.md - 架构设计 ✓
- [x] DEVELOPMENT.md - 开发规范 ✓
- [x] QUICK_REFERENCE.md - 快速参考 ✓
- [x] REFACTORING.md - 重构指南 ✓
- [x] SUMMARY.md - 重构总结 ✓
- [x] PROJECT_COMPLETION_REPORT.md - 完成报告 ✓
- [x] FILE_INDEX.md - 本文件（文件索引） ✓

**总文档数**：8 份  
**总行数**：2500+ 行  
**覆盖范围**：100% ✓

---

**索引版本**：1.0  
**最后更新**：2026年2月11日  
**用途**：快速定位和导航项目文档与代码
