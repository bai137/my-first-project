# 教学龙虾 - 自动文档处理助手（桌面版）

## 项目简介

教学龙虾是一款专为教师设计的智能文档处理桌面应用，旨在帮助教师从繁重的文件处理工作中解脱出来，专注于更重要的教学工作。该应用支持多种文档格式的上传和处理，提供统一格式排版、关键信息提取、内容摘要生成等功能。

![教学龙虾Logo](assets/icon.png)

## 功能特点

- **智能文档处理**：自动识别并处理多种格式文档，统一排版风格，提取关键信息
- **AI 辅助分析**：利用人工智能技术对文档内容进行深度分析，生成摘要，提取关键点
- **批量高效处理**：支持批量上传和处理多个文件，一次性完成繁琐工作
- **桌面应用体验**：提供原生桌面应用体验，支持系统菜单、快捷键等功能

## 支持的文件格式

- Microsoft Word (.docx)
- Microsoft Excel (.xlsx)
- Microsoft PowerPoint (.pptx)
- PDF (.pdf)
- 纯文本 (.txt)

## 如何使用

1. 安装并启动教学龙虾应用
2. 点击"立即开始"按钮进入文件处理中心
3. 将需要处理的文件拖放到上传区域，或点击"浏览文件"按钮选择本地文件
4. 根据需要选择相应的处理选项
5. 点击"开始处理文件"按钮，等待处理完成
6. 处理完成后，选择保存位置获取处理后的文件

## 技术实现

- **前端框架**：HTML5, CSS3, JavaScript
- **桌面应用框架**：Electron
- **UI 框架**：Tailwind CSS v3
- **图标库**：Font Awesome
- **动画效果**：GSAP (GreenSock Animation Platform)
- **数据存储**：Electron Store

## 本地开发

1. 克隆项目到本地
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm start`

## 构建应用

```bash
# 构建所有平台
npm run build

# 构建Windows版本
npm run build:win

# 构建macOS版本
npm run build:mac

# 构建Linux版本
npm run build:linux
```

## 项目结构

```
teaching-lobster-electron/
├── assets/             # 资源文件夹
│   └── icon.png        # 应用图标
├── index.html          # 主页面
├── main.js             # Electron主进程
├── preload.js          # 预加载脚本
├── package.json        # 项目配置文件
└── README.md           # 项目说明文档
```

## 系统要求

- Windows 7 及以上版本
- macOS 10.10 (Yosemite) 及以上版本
- Linux (Ubuntu 14.04+, Debian 8+, CentOS 7+)

## 快捷键

- `Ctrl/Cmd + U`：上传文件
- `Ctrl/Cmd + O`：打开处理选项
- `Ctrl/Cmd + R`：刷新应用
- `F11`：切换全屏模式
- `Ctrl/Cmd + Shift + I`：打开开发者工具
- `Ctrl/Cmd + Q`：退出应用

## 未来计划

- 添加更多文档格式支持
- 增强 AI 分析能力
- 添加用户账户系统，支持云端存储和历史记录
- 开发浏览器扩展，提供更便捷的使用方式

## 联系方式

如有任何问题或建议，请联系我们：
- 邮箱：contact@teachinglobster.com
- 电话：400-123-4567