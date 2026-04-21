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

// 模拟登录
export async function login(email: string, password: string): Promise<User> {
	// 模拟网络延迟
	await new Promise(resolve => setTimeout(resolve, 1000));

	// 模拟登录成功
	const user: User = {
		id: '1',
		username: '用户21002254381',
		email: email,
		avatar: '',
		created_at: new Date().toISOString()
	};

	saveUser(user);
	return user;
}

// 模拟注册
export async function register(username: string, email: string, password: string): Promise<User> {
	// 模拟网络延迟
	await new Promise(resolve => setTimeout(resolve, 1000));

	// 模拟注册成功
	const user: User = {
		id: Date.now().toString(),
		username: username,
		email: email,
		avatar: '',
		created_at: new Date().toISOString()
	};

	saveUser(user);
	return user;
}

// 模拟登出
export function logout(): void {
	clearUser();
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

// 更改密码（模拟）
export async function changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
	await new Promise(resolve => setTimeout(resolve, 1000));
	return true;
}

// 上传头像（模拟）
export async function uploadAvatar(file: File): Promise<string> {
	await new Promise(resolve => setTimeout(resolve, 1000));
	// 模拟返回头像URL
	return 'https://example.com/avatar.jpg';
}
