// 主题管理

export type Theme = 'light' | 'dark' | 'system';

export function getTheme(): Theme {
	const savedTheme = localStorage.getItem('theme') as Theme | null;
	return savedTheme || 'system';
}

export function setTheme(theme: Theme): void {
	localStorage.setItem('theme', theme);
	applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
	if (theme === 'system') {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		document.documentElement.classList.toggle('dark', prefersDark);
	} else {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}
}

// 监听系统主题变化
export function setupThemeListener(): void {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		const theme = getTheme();
		if (theme === 'system') {
			applyTheme(theme);
		}
	});
}