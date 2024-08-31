import { Plugin } from 'obsidian';

export default class OpenTelegramPlugin extends Plugin {
    onload() {
        this.registerDomEvent(document, 'click', (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && target.tagName === 'A') {
                const link = target.getAttribute('href');
                if (link && this.isTelegramLink(link)) {
                    event.preventDefault();
                    this.openInTelegram(link);
                }
            }
        });
    }

    isTelegramLink(link: string): boolean {
        return link.startsWith('https://t.me/') || link.startsWith('tg://');
    }

    openInTelegram(link: string) {
        if (link.startsWith('https://t.me/')) {
            // 将所有 https://t.me/ 链接转换为 tg://resolve?domain=
            const url = new URL(link);
            const path = url.pathname.replace(/^\//, ''); // 移除前导斜杠
            
            // 检查是否有路径参数（如 /33656）
            if (path.includes('/')) {
                const parts = path.split('/');
                link = `tg://resolve?domain=${parts[0]}&post=${parts[1]}`;
            } else {
                link = `tg://resolve?domain=${path}`;
            }
            
            // 添加查询参数
            if (url.search) {
                link += `&${url.searchParams.toString()}`;
            }
        }

        // 尝试使用 window.open 直接打开 tg:// 链接
        try {
            console.log('Attempting to open Telegram link:', link);
            const openedWindow = window.open(link);
            if (!openedWindow) {
                console.error('Failed to open Telegram link. Please ensure Telegram is installed and configured to handle tg:// links.');
            } else {
                openedWindow.close(); // 关闭新窗口，以便在应用中打开链接
            }
        } catch (e) {
            console.error('Error while opening Telegram link:', e);
        }
    }
}
