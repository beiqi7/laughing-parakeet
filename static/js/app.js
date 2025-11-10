class WritingAssistant {
    constructor() {
        this.editor = document.getElementById('editor');
        this.suggestionsContainer = document.getElementById('suggestionsContainer');
        this.generateBtn = document.getElementById('generateBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.loadBtn = document.getElementById('loadBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.errorModal = document.getElementById('errorModal');
        this.wordCount = document.getElementById('wordCount');
        this.paragraphCount = document.getElementById('paragraphCount');

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
        this.loadFromStorage();
    }

    bindEvents() {
        this.editor.addEventListener('input', () => this.updateStats());
        this.generateBtn.addEventListener('click', () => this.generateSuggestions());
        this.saveBtn.addEventListener('click', () => this.saveDocument());
        this.loadBtn.addEventListener('click', () => this.loadDocument());
        this.clearBtn.addEventListener('click', () => this.clearDocument());

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.errorModal.classList.remove('show');
        });

        // Close modal on outside click
        this.errorModal.addEventListener('click', (e) => {
            if (e.target === this.errorModal) {
                this.errorModal.classList.remove('show');
            }
        });
    }

    updateStats() {
        const text = this.editor.textContent || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;

        this.wordCount.textContent = `${words} 字`;
        this.paragraphCount.textContent = `${paragraphs} 段`;
    }

    async generateSuggestions() {
        const text = this.editor.textContent.trim();
        if (!text) {
            this.showError('请先在写作区输入一些内容');
            return;
        }

        this.showLoading(true);
        this.suggestionsContainer.innerHTML = '';

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: this.buildPrompt(text),
                    stream: true,
                    model: 'gpt-3.5-turbo',
                    max_tokens: 800,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('API请求失败');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.text) {
                                this.appendToSuggestions(parsed.text);
                            }
                        } catch (e) {
                            console.error('解析流数据失败:', e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('生成建议失败:', error);
            this.showError('生成建议时出错，请重试');
        } finally {
            this.showLoading(false);
        }
    }

    buildPrompt(text) {
        return `你是一位专业的创意写作助手。请基于以下文本内容，为作者提供创意写作建议，包括情节转折和角色发展建议。

文本内容：
${text}

请提供3-5个具体的建议，每个建议包括：
1. 建议类型（情节转折/角色发展）
2. 具体建议内容
3. 为什么这个建议可能有帮助

请用中文回复，并用简洁明了的方式表达。`;
    }

    appendToSuggestions(text) {
        if (!this.currentSuggestion) {
            this.createNewSuggestion();
        }

        this.currentSuggestion.querySelector('p').textContent += text;
    }

    createNewSuggestion() {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion-item';

        const typeSpan = document.createElement('span');
        typeSpan.className = 'suggestion-type';
        typeSpan.textContent = this.getSuggestionType();

        const title = document.createElement('h3');
        title.textContent = this.getSuggestionTitle();

        const content = document.createElement('p');
        content.textContent = '';

        suggestionDiv.appendChild(typeSpan);
        suggestionDiv.appendChild(title);
        suggestionDiv.appendChild(content);

        this.suggestionsContainer.appendChild(suggestionDiv);
        this.currentSuggestion = suggestionDiv;
    }

    getSuggestionType() {
        const types = ['情节转折', '角色发展', '叙事技巧', '情感深化', '冲突构建'];
        return types[Math.floor(Math.random() * types.length)];
    }

    getSuggestionTitle() {
        const titles = [
            '可能的剧情发展',
            '角色弧线建议',
            '冲突深化思路',
            '情感转折点',
            '叙事创新点'
        ];
        return titles[Math.floor(Math.random() * titles.length)];
    }

    saveDocument() {
        const text = this.editor.textContent;
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `writing-${timestamp}.txt`;

        // 使用浏览器下载功能
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 同时保存到localStorage
        localStorage.setItem('writing-content', text);
        localStorage.setItem('writing-timestamp', new Date().toISOString());

        this.showNotification('文档已保存');
    }

    loadDocument() {
        const text = localStorage.getItem('writing-content');
        if (text) {
            this.editor.textContent = text;
            this.updateStats();
            this.showNotification('文档已加载');
        } else {
            this.showError('未找到保存的文档');
        }
    }

    loadFromStorage() {
        const text = localStorage.getItem('writing-content');
        if (text) {
            this.editor.textContent = text;
            this.updateStats();
        }
    }

    clearDocument() {
        if (confirm('确定要清空所有内容吗？')) {
            this.editor.textContent = '';
            this.suggestionsContainer.innerHTML = `
                <div class="suggestion-placeholder">
                    <i class="fas fa-lightbulb"></i>
                    <p>在写作区输入文本后，点击"生成建议"按钮，AI将为你提供情节转折和角色发展建议。</p>
                </div>
            `;
            this.updateStats();
            localStorage.removeItem('writing-content');
            localStorage.removeItem('writing-timestamp');
        }
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.add('show');
            this.generateBtn.disabled = true;
        } else {
            this.loadingOverlay.classList.remove('show');
            this.generateBtn.disabled = false;
        }
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        this.errorModal.classList.add('show');
    }

    showNotification(message) {
        // 简单的通知功能，可以用Toast库替换
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new WritingAssistant();
});
