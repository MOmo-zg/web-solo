<script lang="ts">
	import { goto } from '$app/navigation';
	import { login } from '$lib/utils/auth';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let showPassword = $state(false);

	async function handleLogin() {
		error = '';
		if (!email || !password) {
			error = '请填写所有必填字段';
			return;
		}

		try {
		isLoading = true;
		await login(email, password);
		// 登录成功，跳转到首页
		goto('/');
	} catch (err) {
		error = err instanceof Error ? err.message : '登录失败，请检查邮箱和密码';
	} finally {
		isLoading = false;
	}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
	<div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
		<div class="text-center mb-8">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
			</svg>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">登录</h1>
			<p class="text-gray-600 dark:text-gray-400 mt-2">欢迎回到小说创作平台</p>
		</div>

		{#if error}
			<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
				{error}
			</div>
		{/if}

		<form onsubmit={e => { e.preventDefault(); handleLogin(); }} class="space-y-4">
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

			<div class="relative">
			<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">密码</label>
			<input
				id="password"
				type={showPassword ? 'text' : 'password'}
				bind:value={password}
				onkeypress={handleKeyPress}
				class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors pr-10"
				placeholder="请输入密码"
				required
			/>
			<button
				onclick={() => showPassword = !showPassword}
				class="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
				aria-label={showPassword ? '隐藏密码' : '显示密码'}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					{#if showPassword}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-5.858-.908a3 3 0 10-4.243-4.243M9.878 9.878l-4.242-4.242M9.878 9.878l3.29 3.29" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					{/if}
				</svg>
			</button>
		</div>

			<button
				onclick={handleLogin}
				disabled={isLoading}
				class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
			>
				{#if isLoading}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					登录中...
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m5 4h3" />
					</svg>
					登录
				{/if}
			</button>
		</form>

		<div class="mt-6 space-y-2 text-center">
			<p class="text-gray-600 dark:text-gray-400 text-sm">
				<a href="/auth/reset-password" class="text-blue-500 hover:text-blue-600 font-medium">忘记密码？</a>
			</p>
			<p class="text-gray-600 dark:text-gray-400 text-sm">
				还没有账号？
				<a href="/auth/register" class="text-blue-500 hover:text-blue-600 font-medium">立即注册</a>
			</p>
		</div>
	</div>
</div>
