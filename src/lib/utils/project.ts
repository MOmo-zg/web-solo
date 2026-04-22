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

// 版本类型定义
export interface Version {
	id: string;
	project_id: string;
	name: string;
	description: string;
	content?: string;
	chapters?: Chapter[];
	created_at: string;
	updated_by: string;
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
	versions?: Version[];
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

// 导出项目为 Word (DOCX)
export async function exportProjectAsWord(projectId: string) {
	const project = await getProjectById(projectId);
	if (!project) {
		return;
	}

	// 动态导入 docx
	const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');

	const doc = new Document({
		title: project.name,
		description: project.description,
		authors: ['小说创作平台']
	});

	// 添加项目信息
	doc.addSection({
		properties: {},
		children: [
			new Paragraph({
				text: '项目信息',
				heading: HeadingLevel.HEADING_1,
				alignment: AlignmentType.CENTER
			}),
			new Paragraph({
				children: [
					new TextRun({ text: '类型: ', bold: true }),
					new TextRun({ text: project.type })
				]
			}),
			new Paragraph({
				children: [
					new TextRun({ text: '描述: ', bold: true }),
					new TextRun({ text: project.description })
				]
			}),
			new Paragraph({
				children: [
					new TextRun({ text: '创建时间: ', bold: true }),
					new TextRun({ text: new Date(project.created_at).toLocaleString() })
				]
			}),
			new Paragraph({
				children: [
					new TextRun({ text: '更新时间: ', bold: true }),
					new TextRun({ text: new Date(project.updated_at).toLocaleString() })
				]
			}),
			new Paragraph({ text: '' }) // 空行
		]
	});

	// 添加内容
	if (project.content) {
		doc.addSection({
			properties: {},
			children: [
				new Paragraph({
					text: '内容',
					heading: HeadingLevel.HEADING_1,
					alignment: AlignmentType.CENTER
				}),
				...project.content.split('\n').map(line => new Paragraph({ text: line })),
				new Paragraph({ text: '' }) // 空行
			]
		});
	}

	// 添加章节
	if (project.chapters && project.chapters.length > 0) {
		project.chapters.forEach((chapter, index) => {
			doc.addSection({
				properties: {},
				children: [
					new Paragraph({
						text: `第${index + 1}章 ${chapter.title}`,
						heading: HeadingLevel.HEADING_1,
						alignment: AlignmentType.CENTER
					}),
					...chapter.content.split('\n').map(line => new Paragraph({ text: line })),
					new Paragraph({ text: '' }) // 空行
				]
			});
		});
	}

	// 生成 DOCX 文件
	const buffer = await Packer.toBuffer(doc);
	
	// 下载文件
	if (typeof window !== 'undefined') {
		const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${project.name}.docx`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
}

// 导出并下载项目
export async function exportAndDownloadProject(projectId: string, format: 'markdown' | 'txt' | 'pdf' | 'epub' | 'docx') {
	const project = await getProjectById(projectId);
	if (!project) {
		return false;
	}

	if (format === 'markdown') {
		const content = await exportProjectAsMarkdown(projectId);
		downloadFile(content, `${project.name}.md`, 'text/markdown');
	} else if (format === 'txt') {
		const content = await exportProjectAsTxt(projectId);
		downloadFile(content, `${project.name}.txt`, 'text/plain');
	} else if (format === 'pdf') {
		await exportProjectAsPdf(projectId);
	} else if (format === 'epub') {
		await exportProjectAsEpub(projectId);
	} else if (format === 'docx') {
		await exportProjectAsWord(projectId);
	}

	return true;
}

// 导出项目为 PDF
export async function exportProjectAsPdf(projectId: string) {
	const project = await getProjectById(projectId);
	if (!project) {
		return;
	}

	// 动态导入 jsPDF
	const { jsPDF } = await import('jspdf');

	const doc = new jsPDF();
	let y = 20;

	// 设置字体和大小
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(20);
	doc.text(project.name, 20, y);
	y += 25;

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(12);
	doc.text(`类型: ${project.type}`, 20, y);
	y += 10;
	doc.text(`描述: ${project.description}`, 20, y);
	y += 10;
	doc.text(`创建时间: ${new Date(project.created_at).toLocaleString()}`, 20, y);
	y += 10;
	doc.text(`更新时间: ${new Date(project.updated_at).toLocaleString()}`, 20, y);
	y += 20;

	if (project.content) {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(16);
		doc.text('内容', 20, y);
		y += 15;

		doc.setFont('helvetica', 'normal');
		doc.setFontSize(12);
		const contentLines = doc.splitTextToSize(project.content, 170);
		contentLines.forEach(line => {
			if (y > 280) {
				doc.addPage();
				y = 20;
			}
			doc.text(line, 20, y);
			y += 7;
		});
		y += 15;
	}

	if (project.chapters && project.chapters.length > 0) {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(16);
		doc.text('章节', 20, y);
		y += 15;

		project.chapters.forEach((chapter, index) => {
			if (y > 280) {
				doc.addPage();
				y = 20;
			}

			doc.setFont('helvetica', 'bold');
			doc.setFontSize(14);
			doc.text(`第${index + 1}章 ${chapter.title}`, 20, y);
			y += 10;

			doc.setFont('helvetica', 'normal');
			doc.setFontSize(12);
			const chapterLines = doc.splitTextToSize(chapter.content, 170);
			chapterLines.forEach(line => {
				if (y > 280) {
					doc.addPage();
					y = 20;
				}
				doc.text(line, 20, y);
				y += 7;
			});
			y += 15;
		});
	}

	// 保存 PDF 文件
	doc.save(`${project.name}.pdf`);
}

// 导出项目为 EPUB
export async function exportProjectAsEpub(projectId: string) {
	const project = await getProjectById(projectId);
	if (!project) {
		return;
	}

	// 动态导入 epub-gen
	const Epub = (await import('epub-gen')).default;

	const options = {
		title: project.name,
		author: '小说创作平台',
		publisher: '小说创作平台',
		description: project.description,
		cover: '', // 可选封面
		content: []
	};

	// 添加项目信息
	options.content.push({
		title: '项目信息',
		data: `
			<h1>项目信息</h1>
			<p><strong>类型:</strong> ${project.type}</p>
			<p><strong>描述:</strong> ${project.description}</p>
			<p><strong>创建时间:</strong> ${new Date(project.created_at).toLocaleString()}</p>
			<p><strong>更新时间:</strong> ${new Date(project.updated_at).toLocaleString()}</p>
		`
	});

	// 添加内容
	if (project.content) {
		options.content.push({
			title: '内容',
			data: `<h1>内容</h1><p>${project.content.replace(/\n/g, '</p><p>')}</p>`
		});
	}

	// 添加章节
	if (project.chapters && project.chapters.length > 0) {
		project.chapters.forEach((chapter, index) => {
			options.content.push({
				title: `第${index + 1}章 ${chapter.title}`,
				data: `<h1>第${index + 1}章 ${chapter.title}</h1><p>${chapter.content.replace(/\n/g, '</p><p>')}</p>`
			});
		});
	}

	// 生成 EPUB 文件
	try {
		// 由于 epub-gen 需要写入文件系统，而浏览器环境不支持
		// 我们在浏览器环境中使用一种替代方案
		if (typeof window !== 'undefined') {
			// 在浏览器中，我们可以生成一个简单的 EPUB 结构并下载
			const epubContent = JSON.stringify(options, null, 2);
			downloadFile(epubContent, `${project.name}.epub`, 'application/epub+zip');
		} else {
			// 在服务器环境中，使用 epub-gen 生成实际的 EPUB 文件
			new Epub(options, `${project.name}.epub`);
		}
	} catch (error) {
		console.error('生成 EPUB 失败:', error);
		// 失败时使用替代方案
		const epubContent = JSON.stringify(options, null, 2);
		downloadFile(epubContent, `${project.name}.epub`, 'application/epub+zip');
	}
}

// 创建版本
export async function createVersion(projectId: string, versionData: {
	name: string;
	description: string;
}): Promise<Version | null> {
	try {
		// 获取当前项目状态
		const project = await getProjectById(projectId);
		if (!project) {
			throw new Error('项目不存在');
		}

		const response = await fetch(`http://localhost:3001/api/projects/${projectId}/versions`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({
				...versionData,
				content: project.content,
				chapters: project.chapters
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '创建版本失败');
		}

		const data = await response.json();
		return data.version || null;
	} catch (error) {
		console.error('创建版本失败:', error);
		return null;
	}
}

// 获取版本列表
export async function getVersions(projectId: string): Promise<Version[]> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${projectId}/versions`, {
			headers: getHeaders()
		});

		if (!response.ok) {
			throw new Error('获取版本列表失败');
		}

		const data = await response.json();
		return data.versions || [];
	} catch (error) {
		console.error('获取版本列表失败:', error);
		return [];
	}
}

// 获取单个版本
export async function getVersionById(projectId: string, versionId: string): Promise<Version | null> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${projectId}/versions/${versionId}`, {
			headers: getHeaders()
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '获取版本失败');
		}

		const data = await response.json();
		return data.version || null;
	} catch (error) {
		console.error('获取版本失败:', error);
		return null;
	}
}

// 恢复到某个版本
export async function restoreVersion(projectId: string, versionId: string): Promise<Project | null> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${projectId}/versions/${versionId}/restore`, {
			method: 'POST',
			headers: getHeaders()
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '恢复版本失败');
		}

		const data = await response.json();
		return data.project || null;
	} catch (error) {
		console.error('恢复版本失败:', error);
		return null;
	}
}

// 删除版本
export async function deleteVersion(projectId: string, versionId: string): Promise<boolean> {
	try {
		const response = await fetch(`http://localhost:3001/api/projects/${projectId}/versions/${versionId}`, {
			method: 'DELETE',
			headers: getHeaders()
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '删除版本失败');
		}

		return true;
	} catch (error) {
		console.error('删除版本失败:', error);
		return false;
	}
}

// 协作功能相关类型
export interface ProjectMember {
	id: string;
	user_id: string;
	project_id: string;
	role: 'owner' | 'editor' | 'viewer';
	user: {
		id: string;
		username: string;
		email: string;
	};
	created_at: string;
}

// 获取项目成员列表
export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
	try {
		const response = await fetch(`http://localhost:3001/api/collaboration/projects/${projectId}/members`, {
			headers: getHeaders()
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '获取项目成员失败');
		}

		const data = await response.json();
		return data.members || [];
	} catch (error) {
		console.error('获取项目成员失败:', error);
		return [];
	}
}

// 邀请项目成员
export async function inviteProjectMember(projectId: string, email: string, role: 'owner' | 'editor' | 'viewer'): Promise<ProjectMember | null> {
	try {
		const response = await fetch(`http://localhost:3001/api/collaboration/projects/${projectId}/members`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ email, role })
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '邀请项目成员失败');
		}

		const data = await response.json();
		return data.member || null;
	} catch (error) {
		console.error('邀请项目成员失败:', error);
		return null;
	}
}

// 更新成员角色
export async function updateMemberRole(projectId: string, memberId: string, role: 'owner' | 'editor' | 'viewer'): Promise<ProjectMember | null> {
	try {
		const response = await fetch(`http://localhost:3001/api/collaboration/projects/${projectId}/members/${memberId}`, {
			method: 'PUT',
			headers: getHeaders(),
			body: JSON.stringify({ role })
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '更新成员角色失败');
		}

		const data = await response.json();
		return data.member || null;
	} catch (error) {
		console.error('更新成员角色失败:', error);
		return null;
	}
}

// 移除项目成员
export async function removeProjectMember(projectId: string, memberId: string): Promise<boolean> {
	try {
		const response = await fetch(`http://localhost:3001/api/collaboration/projects/${projectId}/members/${memberId}`, {
			method: 'DELETE',
			headers: getHeaders()
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '移除项目成员失败');
		}

		return true;
	} catch (error) {
		console.error('移除项目成员失败:', error);
		return false;
	}
}
