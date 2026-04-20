// 主题管理

export type Theme = 'light' | 'dark' | 'system';

// 检查是否在浏览器环境中
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export function getTheme(): Theme {
	if (isBrowser) {
		const savedTheme = localStorage.getItem('theme') as Theme | null;
		return savedTheme || 'system';
	}
	return 'system';
}

export function setTheme(theme: Theme): void {
	if (isBrowser) {
		localStorage.setItem('theme', theme);
		applyTheme(theme);
	}
}

export function applyTheme(theme: Theme): void {
	if (isBrowser) {
		if (theme === 'system') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.classList.toggle('dark', prefersDark);
		} else {
			document.documentElement.classList.toggle('dark', theme === 'dark');
		}
	}
}

// 监听系统主题变化
export function setupThemeListener(): void {
	if (isBrowser) {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			const theme = getTheme();
			if (theme === 'system') {
				applyTheme(theme);
			}
		});
	}
}