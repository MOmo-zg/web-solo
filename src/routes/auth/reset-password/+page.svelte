<script lang="ts">
	import { goto } from '$app/navigation';
	import { resetPassword } from '$lib/utils/auth';

	let email = $state('');
	let isLoading = $state(false);
	let error = $state('');
	let success = $state('');

	async function handleResetPassword() {
		error = '';
		success = '';
		if (!email) {
			error = '请填写邮箱地址';
			return;
		}

		try {
			isLoading = true;
			await resetPassword(email);
			success = '重置密码邮件已发送，请查收';
			// 3秒后跳转到登录页面
			setTimeout(() => {
				goto('/auth/login');
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : '重置密码失败，请稍后重试';
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleResetPassword();
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
	<div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
		<div class="text-center mb-8">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
			</svg>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">重置密码</h1>
			<p class="text-gray-600 dark:text-gray-400 mt-2">请输入你的邮箱地址，我们将发送重置密码的链接</p>
		</div>

		{#if error}
			<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
				{error}
			</div>
		{/if}

		{#if success}
			<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-3 rounded-md mb-4">
				{success}
			</div>
		{/if}

		<form onsubmit={e => { e.preventDefault(); handleResetPassword(); }} class="space-y-4">
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

			<button
				onclick={handleResetPassword}
				disabled={isLoading}
				class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
			>
				{#if isLoading}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					发送重置邮件...
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
					发送重置邮件
				{/if}
			</button>
		</form>

		<div class="mt-6 text-center">
			<p class="text-gray-600 dark:text-gray-400 text-sm">
				想起密码了？
				<a href="/auth/login" class="text-blue-500 hover:text-blue-600 font-medium">立即登录</a>
			</p>
		</div>
	</div>
</div>