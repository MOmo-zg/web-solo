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

// 从本地存储获取 token
function getToken(): string | null {
	if (isBrowser()) {
		return localStorage.getItem('token');
	}
	return null;
}

// 构建请求头
function getHeaders(): HeadersInit {
	const headers: HeadersInit = {
		'Content-Type': 'application/json'
	};
	const token = getToken();
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	return headers;
}

// 获取项目列表
export async function getProjects(): Promise<Project[]> {
	try {
		const response = await fetch('http://localhost:3001/api/projects', {
			headers: getHeaders()
		});

		if (!response.ok) {
			throw new Error('获取项目列表失败');
		}

		const data = await response.json();
		return data.projects || [];
	} catch (error) {
		console.error('获取项目列表失败:', error);
		// 失败时返回空数组
		return [];
	}
}

// 添加新项目
export async function addProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
	try {
		const response = await fetch('http://localhost:3001/api/projects', {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(project)
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '创建项目失败');
		}

		const data = await response.json();
		return data.project || null;
	} catch (error) {
		console.error('创建项目失败:', error);
		return null;
	}
}

// 更新项目
export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<Project | null> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
			method: 'PUT',
			headers: getHeaders(),
			body: JSON.stringify(updates)
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '更新项目失败');
		}

		const data = await response.json();
		return data.project || null;
	} catch (error) {
		console.error('更新项目失败:', error);
		return null;
	}
}

// 删除项目
export async function deleteProject(id: string): Promise<boolean> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
			method: 'DELETE',
			headers: getHeaders()
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '删除项目失败');
		}

		return true;
	} catch (error) {
		console.error('删除项目失败:', error);
		return false;
	}
}

// 获取单个项目
export async function getProjectById(id: string): Promise<Project | null> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
			headers: getHeaders()
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '获取项目失败');
		}

		const data = await response.json();
		return data.project || null;
	} catch (error) {
		console.error('获取项目失败:', error);
		return null;
	}
}

// 添加章节
export async function addChapter(projectId: string, chapter: Omit<Chapter, 'id' | 'order' | 'created_at' | 'updated_at'>): Promise<Chapter | null> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${projectId}/chapters`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify(chapter)
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '添加章节失败');
		}

		const data = await response.json();
		return data.chapter || null;
	} catch (error) {
		console.error('添加章节失败:', error);
		return null;
	}
}

// 更新章节
export async function updateChapter(projectId: string, chapterId: string, updates: Partial<Omit<Chapter, 'id' | 'order' | 'created_at'>>): Promise<Chapter | null> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${projectId}/chapters/${chapterId}`, {
			method: 'PUT',
			headers: getHeaders(),
			body: JSON.stringify(updates)
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '更新章节失败');
		}

		const data = await response.json();
		return data.chapter || null;
	} catch (error) {
		console.error('更新章节失败:', error);
		return null;
	}
}

// 删除章节
export async function deleteChapter(projectId: string, chapterId: string): Promise<boolean> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${projectId}/chapters/${chapterId}`, {
			method: 'DELETE',
			headers: getHeaders()
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '删除章节失败');
		}

		return true;
	} catch (error) {
		console.error('删除章节失败:', error);
		return false;
	}
}

// 重新排序章节
export async function reorderChapters(projectId: string, chapterIds: string[]): Promise<boolean> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${projectId}/chapters/reorder`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ chapterIds })
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '重新排序章节失败');
		}

		return true;
	} catch (error) {
		console.error('重新排序章节失败:', error);
		return false;
	}
}

// 导出项目为Markdown
export async function exportProjectAsMarkdown(projectId: string): Promise<string> {
	const project = await getProjectById(projectId);
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
export async function exportProjectAsTxt(projectId: string): Promise<string> {
	const project = await getProjectById(projectId);
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
export async function searchProjects(query: string): Promise<Project[]> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects?search=${encodeURIComponent(query)}`, {
			headers: getHeaders()
		});

		if (!response.ok) {
			throw new Error('搜索项目失败');
		}

		const data = await response.json();
		return data.projects || [];
	} catch (error) {
		console.error('搜索项目失败:', error);
		return [];
	}
}

// 筛选项目
export async function filterProjects(
	filters: {
		type?: string;
		sortBy?: 'created_at' | 'updated_at' | 'name';
		sortOrder?: 'asc' | 'desc';
	}
): Promise<Project[]> {
	try {
		let url = 'http://localhost:3001/api/projects';
		const params = new URLSearchParams();

		if (filters.type) {
			params.append('type', filters.type);
		}

		if (filters.sortBy) {
			params.append('sortBy', filters.sortBy);
		}

		if (filters.sortOrder) {
			params.append('sortOrder', filters.sortOrder);
		}

		if (params.toString()) {
			url += `?${params.toString()}`;
		}

		const response = await fetch(url, {
			headers: getHeaders()
		});

		if (!response.ok) {
			throw new Error('筛选项目失败');
		}

		const data = await response.json();
		return data.projects || [];
	} catch (error) {
		console.error('筛选项目失败:', error);
		return [];
	}
}

// 获取所有可用的项目类型
export async function getProjectTypes(): Promise<string[]> {
	try {
		const projects = await getProjects();
		const types = new Set<string>();
		projects.forEach(project => types.add(project.type));
		return Array.from(types).sort();
	} catch (error) {
		console.error('获取项目类型失败:', error);
		return [];
	}
}

// 导入项目数据
export async function importProject(data: string, format: 'json' | 'markdown'): Promise<Project | null> {
	try {
		if (format === 'json') {
			const parsed = JSON.parse(data);
			// 创建新项目
			const projectData = {
				name: parsed.name || '导入的项目',
				type: parsed.type || '其他',
				description: parsed.description || '',
				content: parsed.content || ''
			};
			
			return await addProject(projectData);
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
			
			const projectData = {
				name: name,
				type: '导入',
				description: description.trim(),
				content: content.trim()
			};
			
			return await addProject(projectData);
		}
	} catch (e) {
		console.error('导入项目失败:', e);
		return null;
	}
	
	return null;
}

// 导出并下载项目
export async function exportAndDownloadProject(projectId: string, format: 'markdown' | 'txt') {
	const project = await getProjectById(projectId);
	if (!project) {
		return false;
	}

	let content: string;
	let filename: string;
	let contentType: string;

	if (format === 'markdown') {
		content = await exportProjectAsMarkdown(projectId);
		filename = `${project.name}.md`;
		contentType = 'text/markdown';
	} else {
		content = await exportProjectAsTxt(projectId);
		filename = `${project.name}.txt`;
		contentType = 'text/plain';
	}

	downloadFile(content, filename, contentType);
	return true;
}
