// 语言管理

export type Language = 'zh' | 'en';

// 检查是否在浏览器环境中
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// 中文翻译
export const zh = {
	appName: '小说创作平台',
	home: '首页',
	newProject: '创建新项目',
	myProjects: '我的小说项目',
	noProjects: '还没有小说项目',
	startJourney: '点击"创建新项目"开始你的创作之旅',
	openProject: '打开项目',
	continueWriting: '继续创作',
	profile: '我的资料',
	logout: '退出登录',
	projectName: '项目名称',
	projectType: '小说类型',
	projectDescription: '项目描述',
	createProject: '创建项目',
	cancel: '取消',
	agentConfig: '代理配置',
	writingStyle: '创作风格',
	languageType: '语言类型',
	contentLength: '内容长度',
	ruleSettings: '规则设置',
	addRule: '添加规则',
	skills: '技能选择',
	generateContent: '生成内容',
	generating: '生成中...',
	novelContent: '小说内容',
	save: '保存',
	settings: '设置',
	versions: '版本',
	export: '导出',
	theme: '主题',
	light: '浅色',
	dark: '深色',
	system: '跟随系统',
	language: '语言',
	chinese: '中文',
	english: '英文'
};

// 英文翻译
export const en = {
	appName: 'Novel Creation Platform',
	home: 'Home',
	newProject: 'New Project',
	myProjects: 'My Novel Projects',
	noProjects: 'No Projects Yet',
	startJourney: 'Click "New Project" to start your creative journey',
	openProject: 'Open Project',
	continueWriting: 'Continue Writing',
	profile: 'Profile',
	logout: 'Logout',
	projectName: 'Project Name',
	projectType: 'Novel Type',
	projectDescription: 'Project Description',
	createProject: 'Create Project',
	cancel: 'Cancel',
	agentConfig: 'Agent Configuration',
	writingStyle: 'Writing Style',
	languageType: 'Language Type',
	contentLength: 'Content Length',
	ruleSettings: 'Rule Settings',
	addRule: 'Add Rule',
	skills: 'Skills',
	generateContent: 'Generate Content',
	generating: 'Generating...',
	novelContent: 'Novel Content',
	save: 'Save',
	settings: 'Settings',
	versions: 'Versions',
	export: 'Export',
	theme: 'Theme',
	light: 'Light',
	dark: 'Dark',
	system: 'System',
	language: 'Language',
	chinese: 'Chinese',
	english: 'English'
};

export function getLanguage(): Language {
	if (isBrowser) {
		const savedLanguage = localStorage.getItem('language') as Language | null;
		return savedLanguage || 'zh';
	}
	return 'zh';
}

export function setLanguage(language: Language): void {
	if (isBrowser) {
		localStorage.setItem('language', language);
	}
}

export function getTranslations(): typeof zh {
	const language = getLanguage();
	return language === 'zh' ? zh : en;
}