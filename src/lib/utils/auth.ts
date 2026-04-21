// 用户认证管理

// 用户类型定义
export interface User {
	id: string;
	username: string;
	email: string;
	avatar?: string;
	created_at: string;
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
