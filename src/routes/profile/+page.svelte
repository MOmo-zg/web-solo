<script lang="ts">
	import { getUser, updateUser, getUserSettings, saveUserSettings, changePassword, uploadAvatar, type User, type UserSettings } from '$lib/utils/auth';
	import { page } from '$app/stores';

	let activeTab = $state('profile');
	let user = $state<User | null>(getUser());
	let userSettings = $state<UserSettings>(getUserSettings());
	
	let username = $state(user?.username || '');
	let email = $state(user?.email || '');
	let bio = $state(user?.bio || '');
	
	$effect(() => {
		if (user) {
			username = user.username || '';
			email = user.email || '';
			bio = user.bio || '';
		}
	});
	
	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	
	let isSaving = $state(false);
	let passwordError = $state('');
	let successMessage = $state('');

	async function handleProfileSave() {
		isSaving = true;
		try {
			const updatedUser = updateUser({
				username,
				email,
				bio
			});
			if (updatedUser) {
				user = updatedUser;
				successMessage = '个人信息更新成功！';
				setTimeout(() => successMessage = '', 3000);
			}
		} catch (error) {
			console.error('更新失败:', error);
		} finally {
			isSaving = false;
		}
	}

	async function handlePasswordChange() {
		passwordError = '';
		successMessage = '';
		
		if (newPassword !== confirmPassword) {
			passwordError = '两次输入的密码不一致';
			return;
		}
		
		if (newPassword.length < 6) {
			passwordError = '密码至少需要6个字符';
			return;
		}
		
		isSaving = true;
		try {
			const success = await changePassword(oldPassword, newPassword);
			if (success) {
				successMessage = '密码更改成功！';
				oldPassword = '';
				newPassword = '';
				confirmPassword = '';
				setTimeout(() => successMessage = '', 3000);
			}
		} catch (error) {
			passwordError = '密码更改失败，请重试';
		} finally {
			isSaving = false;
		}
	}

	async function handleAvatarUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			isSaving = true;
			try {
				const avatarUrl = await uploadAvatar(file);
				const updatedUser = updateUser({ avatar: avatarUrl });
				if (updatedUser) {
					user = updatedUser;
					successMessage = '头像上传成功！';
					setTimeout(() => successMessage = '', 3000);
				}
			} catch (error) {
				console.error('上传失败:', error);
			} finally {
				isSaving = false;
			}
		}
	}

	function handleSettingsSave() {
		saveUserSettings(userSettings);
		successMessage = '设置保存成功！';
		setTimeout(() => successMessage = '', 3000);
	}
</script>

<div class="container mx-auto px-4 py-8">
	<!-- 页面标题 -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-800 dark:text-white">个人中心</h1>
		<p class="text-gray-600 dark:text-gray-300 mt-2">管理你的账户信息和应用设置</p>
	</div>

	{#if successMessage}
		<div class="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg">
			{successMessage}
		</div>
	{/if}

	<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
		<!-- 侧边栏标签 -->
		<div class="lg:col-span-1">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
				<nav class="space-y-2">
					<button
						onclick={() => activeTab = 'profile'}
						class="{activeTab === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} w-full text-left px-4 py-2 rounded-lg transition-colors"
					>
						个人资料
					</button>
					<button
						onclick={() => activeTab = 'settings'}
						class="{activeTab === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} w-full text-left px-4 py-2 rounded-lg transition-colors"
					>
						应用设置
					</button>
					<button
						onclick={() => activeTab = 'security'}
						class="{activeTab === 'security' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} w-full text-left px-4 py-2 rounded-lg transition-colors"
					>
						安全设置
					</button>
				</nav>
			</div>
		</div>

		<!-- 内容区域 -->
		<div class="lg:col-span-3">
			<!-- 个人资料 -->
			{#if activeTab === 'profile'}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
					<h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">个人资料</h2>
					
					<!-- 头像上传 -->
					<div class="flex items-center mb-8">
						<div class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mr-6">
							{#if user?.avatar}
								<img src={user.avatar} alt="用户头像" class="w-full h-full object-cover" />
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							{/if}
						</div>
						<label class="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
							上传新头像
							<input type="file" accept="image/*" onchange={handleAvatarUpload} class="hidden" />
						</label>
					</div>

					<form onsubmit={handleProfileSave} class="space-y-6">
						<div>
							<label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">用户名</label>
							<input
								type="text"
								id="username"
								bind:value={username}
								class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
								required
							/>
						</div>

						<div>
							<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">电子邮箱</label>
							<input
								type="email"
								id="email"
								bind:value={email}
								class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
								required
							/>
						</div>

						<div>
							<label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">个人简介</label>
							<textarea
								id="bio"
								bind:value={bio}
								rows={4}
								class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
								placeholder="介绍一下你自己..."
							></textarea>
						</div>

						<div class="pt-4">
							<button
								type="submit"
								disabled={isSaving}
								class="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSaving ? '保存中...' : '保存修改'}
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- 应用设置 -->
			{#if activeTab === 'settings'}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
					<h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">应用设置</h2>

					<div class="space-y-6">
						<div>
							<label for="theme" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">主题</label>
							<select
								id="theme"
								bind:value={userSettings.theme}
								class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
							>
								<option value="system">跟随系统</option>
								<option value="light">浅色模式</option>
								<option value="dark">深色模式</option>
							</select>
						</div>

						<div>
							<label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">语言</label>
							<select
								id="language"
								bind:value={userSettings.language}
								class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
							>
								<option value="zh">中文</option>
								<option value="en">English</option>
							</select>
						</div>

						<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<div>
								<p class="font-medium text-gray-800 dark:text-white">通知提醒</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">接收应用的更新和通知</p>
							</div>
							<label class="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" bind:checked={userSettings.notifications} class="sr-only peer" />
								<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
							</label>
						</div>

						<div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<div>
								<p class="font-medium text-gray-800 dark:text-white">自动保存</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">自动保存你的创作内容</p>
							</div>
							<label class="relative inline-flex items-center cursor-pointer">
								<input type="checkbox" bind:checked={userSettings.autoSave} class="sr-only peer" />
								<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
							</label>
						</div>

						<div class="pt-4">
							<button
								onclick={handleSettingsSave}
								class="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-blue-600 transition-colors"
							>
								保存设置
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- 安全设置 -->
			{#if activeTab === 'security'}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
					<h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">安全设置</h2>

					<div class="space-y-6">
						<!-- 密码修改 -->
						<div class="border-b border-gray-200 dark:border-gray-700 pb-6">
							<h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">修改密码</h3>
							
							{#if passwordError}
								<div class="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
									{passwordError}
								</div>
							{/if}
							
							<form onsubmit={handlePasswordChange} class="space-y-4">
								<div>
									<label for="oldPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">当前密码</label>
									<input
										type="password"
										id="oldPassword"
										bind:value={oldPassword}
										class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
										required
									/>
								</div>

								<div>
									<label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">新密码</label>
									<input
										type="password"
										id="newPassword"
										bind:value={newPassword}
										class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
										required
									/>
								</div>

								<div>
									<label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">确认新密码</label>
									<input
										type="password"
										id="confirmPassword"
										bind:value={confirmPassword}
										class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
										required
									/>
								</div>

								<button
									type="submit"
									disabled={isSaving}
									class="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isSaving ? '修改中...' : '修改密码'}
								</button>
							</form>
						</div>

						<!-- 账户信息 -->
						<div>
							<h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">账户信息</h3>
							<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
								<div class="flex justify-between items-center mb-3">
									<span class="text-gray-600 dark:text-gray-400">账户创建时间</span>
									<span class="text-gray-800 dark:text-white">{user ? new Date(user.created_at).toLocaleDateString('zh-CN') : ''}</span>
								</div>
								{#if user?.updated_at}
									<div class="flex justify-between items-center">
										<span class="text-gray-600 dark:text-gray-400">最后更新时间</span>
										<span class="text-gray-800 dark:text-white">{new Date(user.updated_at).toLocaleDateString('zh-CN')}</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
