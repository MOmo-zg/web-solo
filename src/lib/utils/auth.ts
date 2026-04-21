// 用户认证管理

// 用户类型定义
export interface User {
	id: string;
	username: string;
	email: string;
	avatar?: string;
	bio?: string;
	created_at: string;
	updated_at?: string;
}

// 用户设置类型
export interface UserSettings {
	theme: 'light' | 'dark' | 'system';
	language: 'zh' | 'en';
	notifications: boolean;
	autoSave: boolean;
}

// 检查是否在浏览器环境中
function isBrowser() {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

// 保存用户信息到本地存储
export function saveUser(user: User): void {
	if (isBrowser()) {
		localStorage.setItem('user', JSON.stringify(user));
	}
}

// 从本地存储获取用户信息
export function getUser(): User | null {
	if (isBrowser()) {
		const user = localStorage.getItem('user');
		if (user) {
			return JSON.parse(user);
		}
	}
	return null;
}

// 清除用户信息
export function clearUser(): void {
	if (isBrowser()) {
		localStorage.removeItem('user');
	}
}

// 检查用户是否已登录
export function isLoggedIn(): boolean {
	return getUser() !== null;
}

// 登录
export async function login(email: string, password: string): Promise<User> {
	try {
		const response = await fetch('http://localhost:3001/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '登录失败');
		}

		const data = await response.json();
		saveUser(data.user);
		// 保存 token 到本地存储
		if (data.token) {
			if (isBrowser()) {
				localStorage.setItem('token', data.token);
			}
		}
		return data.user;
	} catch (error) {
		console.error('登录失败:', error);
		throw error;
	}
}

// 注册
export async function register(username: string, email: string, password: string): Promise<User> {
	try {
		const response = await fetch('http://localhost:3001/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, email, password })
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '注册失败');
		}

		const data = await response.json();
		saveUser(data.user);
		return data.user;
	} catch (error) {
		console.error('注册失败:', error);
		throw error;
	}
}

// 登出
export function logout(): void {
	clearUser();
	// 清除 token
	if (isBrowser()) {
		localStorage.removeItem('token');
	}
}

// 更新用户信息
export function updateUser(updates: Partial<User>): User | null {
	const currentUser = getUser();
	if (currentUser) {
		const updatedUser: User = {
			...currentUser,
			...updates,
			updated_at: new Date().toISOString()
		};
		saveUser(updatedUser);
		return updatedUser;
	}
	return null;
}

// 保存用户设置
export function saveUserSettings(settings: UserSettings): void {
	if (isBrowser()) {
		localStorage.setItem('userSettings', JSON.stringify(settings));
	}
}

// 获取用户设置
export function getUserSettings(): UserSettings {
	if (isBrowser()) {
		const settings = localStorage.getItem('userSettings');
		if (settings) {
			return JSON.parse(settings);
		}
	}
	// 默认设置
	return {
		theme: 'system',
		language: 'zh',
		notifications: true,
		autoSave: true
	};
}

// 更改密码
export async function changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
	try {
		const token = isBrowser() ? localStorage.getItem('token') : null;
		if (!token) {
			throw new Error('未登录');
		}

		const response = await fetch('http://localhost:3001/api/auth/change-password', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ oldPassword, newPassword })
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '更改密码失败');
		}

		return true;
	} catch (error) {
		console.error('更改密码失败:', error);
		throw error;
	}
}

// 上传头像
export async function uploadAvatar(file: File): Promise<string> {
	try {
		const token = isBrowser() ? localStorage.getItem('token') : null;
		if (!token) {
			throw new Error('未登录');
		}

		const formData = new FormData();
		formData.append('avatar', file);

		const response = await fetch('http://localhost:3001/api/auth/upload-avatar', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			body: formData
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || '上传头像失败');
		}

		const data = await response.json();
		return data.avatarUrl;
	} catch (error) {
		console.error('上传头像失败:', error);
		throw error;
	}
}
