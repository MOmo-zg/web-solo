// 项目数据管理

// 项目类型定义
export interface Project {
	id: string;
	name: string;
	type: string;
	description: string;
	content?: string;
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
