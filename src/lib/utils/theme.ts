// 主题管理

export type Theme = 'light' | 'dark' | 'system';

// 检查是否在浏览器环境中
function isBrowser() {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getTheme(): Theme {
	if (isBrowser()) {
		const savedTheme = localStorage.getItem('theme') as Theme | null;
		return savedTheme || 'system';
	}
	return 'system';
}

export function setTheme(theme: Theme): void {
	if (isBrowser()) {
		localStorage.setItem('theme', theme);
		applyTheme(theme);
	}
}

export function applyTheme(theme: Theme): void {
	if (isBrowser()) {
		// 先移除所有可能的 dark 类
		document.documentElement.classList.remove('dark');
		
		// 然后根据主题添加或保持移除状态
		if (theme === 'system') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			if (prefersDark) {
				document.documentElement.classList.add('dark');
			}
		} else if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		}
		// light 主题不需要添加 dark 类，已经通过上面的 remove 处理了
	}
}

// 监听系统主题变化
export function setupThemeListener(): void {
	if (isBrowser()) {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			const theme = getTheme();
			if (theme === 'system') {
				applyTheme(theme);
			}
		});
	}
}