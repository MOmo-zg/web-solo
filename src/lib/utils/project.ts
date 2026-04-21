// 项目数据管理

// 章节类型定义
export interface Chapter {
	id: string;
	title: string;
	content: string;
	order: number;
	created_at: string;
	updated_at: string;
}

// 项目类型定义
export interface Project {
	id: string;
	name: string;
	type: string;
	description: string;
	content?: string;
	chapters?: Chapter[];
	created_at: string;
	updated_at: string;
}

// 检查是否在浏览器环境中
function isBrowser() {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

// 从本地存储获取项目列表
export function getProjects(): Project[] {
	if (isBrowser()) {
		const projects = localStorage.getItem('projects');
		if (projects) {
			return JSON.parse(projects);
		}
		// 如果没有项目，返回一些模拟数据
		return getMockProjects();
	}
	return [];
}

// 保存项目列表到本地存储
export function saveProjects(projects: Project[]): void {
	if (isBrowser()) {
		localStorage.setItem('projects', JSON.stringify(projects));
	}
}

// 获取模拟项目数据
function getMockProjects(): Project[] {
	return [
		{
			id: '1',
			name: '奇幻冒险小说',
			type: '奇幻',
			description: '一个关于勇者拯救世界的故事',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: '2',
			name: '未来科幻小说',
			type: '科幻',
			description: '2150年的未来世界',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: '3',
			name: '现代都市小说',
			type: '现代',
			description: '都市生活的故事',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: '4',
			name: '武侠江湖传说',
			type: '武侠',
			description: '武林中的英雄故事',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: '5',
			name: '历史王朝风云',
			type: '历史',
			description: '古代王朝的兴衰',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: '6',
			name: '浪漫爱情故事',
			type: '爱情',
			description: '甜蜜的恋爱故事',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: '7',
			name: '悬疑推理小说',
			type: '悬疑',
			description: '解开神秘案件的真相',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		}
	];
}

// 添加新项目
export function addProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
	const newProject: Project = {
		...project,
		id: Date.now().toString(),
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};
	const projects = getProjects();
	projects.push(newProject);
	saveProjects(projects);
	return newProject;
}

// 更新项目
export function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Project | null {
	const projects = getProjects();
	const index = projects.findIndex(p => p.id === id);
	if (index === -1) {
		return null;
	}
	projects[index] = {
		...projects[index],
		...updates,
		updated_at: new Date().toISOString()
	};
	saveProjects(projects);
	return projects[index];
}

// 删除项目
export function deleteProject(id: string): boolean {
	const projects = getProjects();
	const filteredProjects = projects.filter(p => p.id !== id);
	if (filteredProjects.length === projects.length) {
		return false; // 没有找到项目
	}
	saveProjects(filteredProjects);
	return true;
}

// 获取单个项目
export function getProjectById(id: string): Project | null {
	const projects = getProjects();
	return projects.find(p => p.id === id) || null;
}

// 添加章节
export function addChapter(projectId: string, chapter: Omit<Chapter, 'id' | 'order' | 'created_at' | 'updated_at'>): Chapter | null {
	const projects = getProjects();
	const projectIndex = projects.findIndex(p => p.id === projectId);
	if (projectIndex === -1) {
		return null;
	}

	const project = projects[projectIndex];
	const chapters = project.chapters || [];
	const newChapter: Chapter = {
		...chapter,
		id: Date.now().toString(),
		order: chapters.length,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};

	chapters.push(newChapter);
	project.chapters = chapters;
	project.updated_at = new Date().toISOString();

	saveProjects(projects);
	return newChapter;
}

// 更新章节
export function updateChapter(projectId: string, chapterId: string, updates: Partial<Omit<Chapter, 'id' | 'order' | 'created_at'>>): Chapter | null {
	const projects = getProjects();
	const projectIndex = projects.findIndex(p => p.id === projectId);
	if (projectIndex === -1) {
		return null;
	}

	const project = projects[projectIndex];
	const chapters = project.chapters || [];
	const chapterIndex = chapters.findIndex(c => c.id === chapterId);
	if (chapterIndex === -1) {
		return null;
	}

	chapters[chapterIndex] = {
		...chapters[chapterIndex],
		...updates,
		updated_at: new Date().toISOString()
	};

	project.updated_at = new Date().toISOString();
	saveProjects(projects);
	return chapters[chapterIndex];
}

// 删除章节
export function deleteChapter(projectId: string, chapterId: string): boolean {
	const projects = getProjects();
	const projectIndex = projects.findIndex(p => p.id === projectId);
	if (projectIndex === -1) {
		return false;
	}

	const project = projects[projectIndex];
	const chapters = project.chapters || [];
	const filteredChapters = chapters.filter(c => c.id !== chapterId);

	if (filteredChapters.length === chapters.length) {
		return false;
	}

	// 重新排序章节
	filteredChapters.forEach((chapter, index) => {
		chapter.order = index;
	});

	project.chapters = filteredChapters;
	project.updated_at = new Date().toISOString();
	saveProjects(projects);
	return true;
}

// 重新排序章节
export function reorderChapters(projectId: string, chapterIds: string[]): boolean {
	const projects = getProjects();
	const projectIndex = projects.findIndex(p => p.id === projectId);
	if (projectIndex === -1) {
		return false;
	}

	const project = projects[projectIndex];
	const chapters = project.chapters || [];

	// 按照新的顺序更新章节顺序
	chapterIds.forEach((chapterId, index) => {
		const chapter = chapters.find(c => c.id === chapterId);
		if (chapter) {
			chapter.order = index;
			chapter.updated_at = new Date().toISOString();
		}
	});

	// 按照新的顺序排序章节
	project.chapters = chapters.sort((a, b) => a.order - b.order);
	project.updated_at = new Date().toISOString();
	saveProjects(projects);
	return true;
}

// 导出项目为Markdown
export function exportProjectAsMarkdown(projectId: string): string {
	const project = getProjectById(projectId);
	if (!project) {
		return '';
	}

	let markdown = `# ${project.name}\n\n`;
	markdown += `## 项目信息\n`;
	markdown += `- 类型: ${project.type}\n`;
	markdown += `- 描述: ${project.description}\n`;
	markdown += `- 创建时间: ${new Date(project.created_at).toLocaleString()}\n`;
	markdown += `- 更新时间: ${new Date(project.updated_at).toLocaleString()}\n\n`;

	if (project.content) {
		markdown += `## 内容\n${project.content}\n\n`;
	}

	if (project.chapters && project.chapters.length > 0) {
		markdown += `## 章节\n\n`;
		project.chapters.forEach((chapter, index) => {
			markdown += `### 第${index + 1}章 ${chapter.title}\n\n`;
			markdown += `${chapter.content}\n\n`;
		});
	}

	return markdown;
}

// 导出项目为TXT
export function exportProjectAsTxt(projectId: string): string {
	const project = getProjectById(projectId);
	if (!project) {
		return '';
	}

	let txt = `${project.name}\n\n`;
	txt += `项目信息\n`;
	txt += `类型: ${project.type}\n`;
	txt += `描述: ${project.description}\n`;
	txt += `创建时间: ${new Date(project.created_at).toLocaleString()}\n`;
	txt += `更新时间: ${new Date(project.updated_at).toLocaleString()}\n\n`;

	if (project.content) {
		txt += `内容\n${project.content}\n\n`;
	}

	if (project.chapters && project.chapters.length > 0) {
		txt += `章节\n\n`;
		project.chapters.forEach((chapter, index) => {
			txt += `第${index + 1}章 ${chapter.title}\n\n`;
			txt += `${chapter.content}\n\n`;
		});
	}

	return txt;
}

// 下载文件
function downloadFile(content: string, filename: string, contentType: string) {
	const blob = new Blob([content], { type: contentType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

// 搜索项目
export function searchProjects(query: string): Project[] {
	const projects = getProjects();
	if (!query.trim()) {
		return projects;
	}
	
	const lowerQuery = query.toLowerCase();
	return projects.filter(project => 
		project.name.toLowerCase().includes(lowerQuery) || 
		project.description.toLowerCase().includes(lowerQuery) ||
		project.type.toLowerCase().includes(lowerQuery)
	);
}

// 筛选项目
export function filterProjects(
	filters: {
		type?: string;
		sortBy?: 'created_at' | 'updated_at' | 'name';
		sortOrder?: 'asc' | 'desc';
	}
): Project[] {
	let projects = getProjects();
	
	// 根据类型筛选
	if (filters.type) {
		projects = projects.filter(project => project.type === filters.type);
	}
	
	// 排序
	const sortBy = filters.sortBy || 'updated_at';
	const sortOrder = filters.sortOrder || 'desc';
	
	projects.sort((a, b) => {
		let comparison = 0;
		
		if (sortBy === 'name') {
			comparison = a.name.localeCompare(b.name);
		} else {
			const dateA = new Date(a[sortBy]);
			const dateB = new Date(b[sortBy]);
			comparison = dateA.getTime() - dateB.getTime();
		}
		
		return sortOrder === 'asc' ? comparison : -comparison;
	});
	
	return projects;
}

// 获取所有可用的项目类型
export function getProjectTypes(): string[] {
	const projects = getProjects();
	const types = new Set<string>();
	projects.forEach(project => types.add(project.type));
	return Array.from(types).sort();
}

// 导入项目数据
export function importProject(data: string, format: 'json' | 'markdown'): Project | null {
	try {
		if (format === 'json') {
			const parsed = JSON.parse(data);
			// 创建新项目
			const project: Project = {
				id: Date.now().toString(),
				name: parsed.name || '导入的项目',
				type: parsed.type || '其他',
				description: parsed.description || '',
				content: parsed.content || '',
				chapters: parsed.chapters || [],
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
			
			const projects = getProjects();
			projects.push(project);
			saveProjects(projects);
			return project;
		} else if (format === 'markdown') {
			// 简单的Markdown解析
			let name = '导入的项目';
			let description = '';
			let content = '';
			
			const lines = data.split('\n');
			let currentSection = '';
			
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				
				if (line.startsWith('# ')) {
					if (!name) {
						name = line.substring(2);
					} else {
						currentSection = line.substring(2);
					}
				} else if (currentSection === '项目信息' || currentSection === '项目描述') {
					description += line + '\n';
				} else if (currentSection === '内容') {
					content += line + '\n';
				} else if (!description && !content) {
					description += line + '\n';
				}
			}
			
			const project: Project = {
				id: Date.now().toString(),
				name: name,
				type: '导入',
				description: description.trim(),
				content: content.trim(),
				chapters: [],
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};
			
			const projects = getProjects();
			projects.push(project);
			saveProjects(projects);
			return project;
		}
	} catch (e) {
		console.error('导入项目失败:', e);
		return null;
	}
	
	return null;
}

// 导出并下载项目
export function exportAndDownloadProject(projectId: string, format: 'markdown' | 'txt') {
	const project = getProjectById(projectId);
	if (!project) {
		return false;
	}

	let content: string;
	let filename: string;
	let contentType: string;

	if (format === 'markdown') {
		content = exportProjectAsMarkdown(projectId);
		filename = `${project.name}.md`;
		contentType = 'text/markdown';
	} else {
		content = exportProjectAsTxt(projectId);
		filename = `${project.name}.txt`;
		contentType = 'text/plain';
	}

	downloadFile(content, filename, contentType);
	return true;
}
