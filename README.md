# 创意写作助手

一个基于Python Flask和OpenAI API的创意写作辅助应用，提供流式AI建议来激发写作灵感。

## 功能特点

- 🎨 **现代化的暗色界面**：采用深色主题配以彩色点缀，保护视力同时保持美观
- ✍️ **富文本编辑器**：流畅的写作体验，支持实时字数和段落统计
- 🤖 **AI智能建议**：基于OpenAI API的流式响应，为你的写作提供情节转折和角色发展建议
- 💾 **文档管理**：本地保存/加载功能，支持导出为文本文件
- 📱 **响应式设计**：适配桌面和移动设备
- ⚡ **实时流式输出**：AI建议逐字显示，提供沉浸式体验

## 技术栈

- **后端**: Python Flask + OpenAI API
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **样式**: 自定义CSS变量系统，现代渐变和阴影效果
- **交互**: 原生JavaScript，无需第三方框架
- **数据**: LocalStorage + 文件下载API

## 安装使用

### 1. 克隆项目

```bash
git clone <repository-url>
cd writing-assistant
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置API密钥

编辑 `.env` 文件，添加你的OpenAI API密钥：

```
OPENAI_API_KEY=your_actual_openai_api_key
```

### 4. 运行应用

```bash
python app.py
```

访问 `http://localhost:5000` 开始使用。

## 项目结构

```
writing-assistant/
├── app.py                 # Flask后端主文件
├── requirements.txt       # Python依赖
├── .env                   # 环境变量配置
├── README.md             # 项目文档
├── templates/
│   └── index.html        # 主页面模板
└── static/
    ├── css/
    │   └── styles.css    # 样式文件
    └── js/
        └── app.js        # 前端逻辑
```

## 使用指南

1. **开始写作**：在左侧写作区输入你的故事或文章内容
2. **生成建议**：点击"生成建议"按钮，AI将分析你的文本并提供创意建议
3. **实时反馈**：建议会以流式方式显示，实时看到AI的思考过程
4. **保存作品**：使用保存按钮将作品下载为文本文件，或自动保存到浏览器本地存储
5. **加载作品**：从本地存储加载之前保存的内容

## 建议类型

AI会提供以下类型的写作建议：
- **情节转折**：故事发展的关键转折点
- **角色发展**：人物性格和成长的建议
- **叙事技巧**：写作手法和技巧改进
- **情感深化**：情感表达和氛围营造
- **冲突构建**：矛盾冲突的设计思路

## 注意事项

- 需要有效的OpenAI API密钥才能使用AI建议功能
- 建议功能会消耗OpenAI API额度，请注意使用量
- 作品保存在浏览器本地存储中，清除浏览器数据会导致内容丢失

## 自定义配置

可以在 `app.py` 中调整以下参数：
- `model`: 使用的OpenAI模型 (默认: gpt-3.5-turbo)
- `max_tokens`: 最大生成长度 (默认: 800)
- `temperature`: 创造性程度 (默认: 0.7)

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！