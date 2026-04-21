<script lang="ts">
	import { goto } from '$app/navigation';
	import { register } from '$lib/utils/auth';

	let username = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let error = $state('');

	async function handleRegister() {
		error = '';
		if (!username || !email || !password || !confirmPassword) {
			error = '请填写所有必填字段';
			return;
		}

		if (password !== confirmPassword) {
			error = '两次输入的密码不一致';
			return;
		}

		if (password.length < 6) {
			error = '密码长度至少为6位';
			return;
		}

		try {
			isLoading = true;
			await register(username, email, password);
			// 注册成功，跳转到首页
			goto('/');
		} catch (err) {
			error = '注册失败，请稍后重试';
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleRegister();
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
	<div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
		<div class="text-center mb-8">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
			</svg>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">注册</h1>
			<p class="text-gray-600 dark:text-gray-400 mt-2">创建新账号，开始你的小说创作之旅</p>
		</div>

		{#if error}
			<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
				{error}
			</div>
		{/if}

		<form onsubmit={e => { e.preventDefault(); handleRegister(); }} class="space-y-4">
			<div>
				<label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">用户名</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					onkeypress={handleKeyPress}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
					placeholder="请输入用户名"
					required
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					onkeypress={handleKeyPress}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
					placeholder="请输入邮箱"
					required
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					onkeypress={handleKeyPress}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
					placeholder="请输入密码"
					required
				/>
			</div>

			<div>
				<label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">确认密码</label>
				<input
					id="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					onkeypress={handleKeyPress}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
					placeholder="请确认密码"
					required
				/>
			</div>

			<button
				onclick={handleRegister}
				disabled={isLoading}
				class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
			>
				{#if isLoading}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					注册中...
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
					</svg>
					注册
				{/if}
			</button>
		</form>

		<div class="mt-6 text-center">
			<p class="text-gray-600 dark:text-gray-400 text-sm">
				已有账号？
				<a href="/auth/login" class="text-blue-500 hover:text-blue-600 font-medium">立即登录</a>
			</p>
		</div>
	</div>
</div>
