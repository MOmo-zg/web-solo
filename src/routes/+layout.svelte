<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { getTheme, setTheme, applyTheme, setupThemeListener } from '$lib/utils/theme';
	import type { Theme } from '$lib/utils/theme';
	import { getLanguage, setLanguage, getTranslations } from '$lib/utils/i18n';
	import type { Language } from '$lib/utils/i18n';
	import { getProjects, type Project } from '$lib/utils/project';
	import { getUser, logout, isLoggedIn } from '$lib/utils/auth';
	import { goto } from '$app/navigation';
	import { onMount, type Component } from 'svelte';
	
	// 懒加载 AgentChat 组件
	let AgentChatComponent = $state<Component | null>(null);
	let isAgentChatLoaded = $state(false);
	
	async function loadAgentChat() {
		if (!isAgentChatLoaded) {
			const module = await import('$lib/components/AgentChat.svelte');
			AgentChatComponent = module.default;
			isAgentChatLoaded = true;
		}
	}
	
	// 当右侧边栏打开时加载 AgentChat 组件
	$effect(() => {
		if (rightSidebarOpen && !isAgentChatLoaded) {
			loadAgentChat();
		}
	});

	let { children } = $props();
	let sidebarOpen = $state(true);
	let rightSidebarOpen = $state(true);
	let userMenuOpen = $state(false);
	let themeHoverOpen = $state(false);
	let languageHoverOpen = $state(false);
	let theme = $state(getTheme());
	let language = $state(getLanguage());
	let t = $state(getTranslations());
	let projects = $state<Project[]>([]);
	let user = $state(getUser());
	let loggedIn = $state(isLoggedIn());

	onMount(async () => {
		applyTheme(theme);
		setupThemeListener();
		// 清除旧的localStorage数据，显示新的模拟项目
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('projects');
		}
		// 加载项目列表
		projects = await getProjects();
	});

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function toggleRightSidebar() {
		rightSidebarOpen = !rightSidebarOpen;
	}

	function changeTheme(newTheme: Theme) {
		console.log('Changing theme to:', newTheme);
		setTheme(newTheme);
		theme = newTheme;
		console.log('Theme state updated to:', theme);
		themeHoverOpen = false;
		// 确保主题被正确应用
		applyTheme(newTheme);
		console.log('Theme applied');
	}

	function changeLanguage(newLanguage: Language) {
		setLanguage(newLanguage);
		language = newLanguage;
		languageHoverOpen = false;
		t = getTranslations();
	}

	function createNewNovel() {
		// 跳转到创建项目页面
		goto('/create');
	}

	function selectProject(project: Project) {
		// 跳转到项目编辑页面
		goto(`/project/${project.id}`);
	}

	// 登录
	function handleLogin() {
		goto('/auth/login');
	}

	// 注册
	function handleRegister() {
		goto('/auth/register');
	}

	// 登出
	function handleLogout() {
		logout();
		user = null;
		loggedIn = false;
		goto('/');
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 flex">
	<!-- 左侧边栏 -->
	<div class={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-50 dark:bg-gray-800 transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-screen z-40 relative`}>
		<div class="p-4 flex justify-between items-center shrink-0">
			<div class="flex items-center space-x-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
				<span class="font-medium">Novel</span>
			</div>
			<button onclick={toggleSidebar} class="text-gray-400 hover:text-white" aria-label="切换侧边栏">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
				</svg>
			</button>
		</div>
		
		<div class="p-4 space-y-6 flex-1 overflow-y-auto min-h-0">
			<!-- New Task -->
			<div>
				<button class="flex items-center space-x-2 text-gray-300 hover:text-white w-full text-left py-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					<span>New task</span>
				</button>
			</div>
			
			<!-- Rules -->
			<div>
				<div class="flex items-center space-x-2 text-gray-400 mb-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span class="text-sm font-medium">Rules</span>
				</div>
			</div>
			
			<!-- Skills -->
			<div>
				<div class="flex items-center space-x-2 text-gray-400 mb-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span class="text-sm font-medium">Skills</span>
				</div>
			</div>
			
			<!-- Project List -->
			<div class="min-w-0">
				<div class="flex items-center justify-between text-gray-400 mb-2 px-1">
					<span class="text-sm font-medium">Novels</span>
					<button onmousedown={createNewNovel} class="text-gray-400 hover:text-white" aria-label="Add novel">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
					</button>
				</div>
				<div class="space-y-1 overflow-y-auto max-h-80">
					{#if projects.length === 0}
						<div class="flex items-center space-x-2 text-gray-400 py-2">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span class="text-sm">暂无项目，点击 + 创建新小说</span>
						</div>
					{:else}
						{#each projects as project}
							<button 
								onmousedown={() => selectProject(project)}
								class="flex items-center space-x-2 text-gray-300 hover:text-white py-2 px-3 w-full text-left transition-colors rounded-md hover:bg-gray-700/30 dark:hover:bg-gray-600/30 duration-200 ease-in-out group"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
								</svg>
								<div class="flex-1 min-w-0">
									<div class="text-sm font-medium transition-all duration-200 truncate">{project.name}</div>
									<div class="text-xs text-gray-400 transition-all duration-200 truncate">{project.type}</div>
								</div>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<!-- 用户信息区域 -->
		<div class="mt-auto p-4 relative z-50">
			{#if loggedIn && user}
				<div class="relative">
					<button onclick={() => userMenuOpen = !userMenuOpen} class="flex items-center space-x-3 w-full text-left py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
						<div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
							{#if user.avatar}
								<img src={user.avatar} alt="用户头像" class="w-full h-full object-cover" />
							{:else}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							{/if}
						</div>
						<div class="flex-1">
							<div class="text-sm font-medium text-gray-900 dark:text-gray-300">{user.username}</div>
							<div class="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
						</div>
					</button>

					{#if userMenuOpen}
				<div class="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[100] py-1">
						<!-- 个人中心 -->
						<button onmousedown={() => { goto('/profile'); userMenuOpen = false; }} class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between">
							<span>个人中心</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</button>
						
						<div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
						
						<!-- Language -->
						<div 
					class="relative"
					onmouseenter={() => { languageHoverOpen = true; themeHoverOpen = false; }}
					onmouseleave={() => languageHoverOpen = false}
					role="button"
					tabindex="0"
				>
							<button 
								class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
							>
								<span>Language</span>
								<div class="flex items-center space-x-2">
									<span class="text-gray-500 dark:text-gray-400">{language === 'zh' ? t.chinese : t.english}</span>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</button>
							
							{#if languageHoverOpen}
						<div 
								class="absolute left-full top-0 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[150] py-1"
							>
								<button onmousedown={() => changeLanguage('zh')} class={`w-full text-left px-3 py-2 text-sm ${language === 'zh' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors flex items-center justify-between`}>
									<span>{t.chinese}</span>
									{#if language === 'zh'}
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									{/if}
								</button>
								<button onmousedown={() => changeLanguage('en')} class={`w-full text-left px-3 py-2 text-sm ${language === 'en' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors flex items-center justify-between`}>
									<span>{t.english}</span>
									{#if language === 'en'}
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									{/if}
								</button>
							</div>
							{/if}
						</div>
						
						<!-- Theme -->
						<div 
					class="relative"
					onmouseenter={() => { themeHoverOpen = true; languageHoverOpen = false; }}
					onmouseleave={() => themeHoverOpen = false}
					role="button"
					tabindex="0"
				>
							<button 
								class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
							>
								<span>Theme</span>
								<div class="flex items-center space-x-2">
									<span class="text-gray-500 dark:text-gray-400">{theme === 'light' ? t.light : theme === 'dark' ? t.dark : t.system}</span>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</button>
							
							{#if themeHoverOpen}
						<div 
								class="absolute left-full top-0 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[150] py-1"
							>
								<button onmousedown={() => changeTheme('light')} class={`w-full text-left px-3 py-2 text-sm ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors flex items-center justify-between`}>
									<span>{t.light}</span>
									{#if theme === 'light'}
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									{/if}
								</button>
								<button onmousedown={() => changeTheme('dark')} class={`w-full text-left px-3 py-2 text-sm ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors flex items-center justify-between`}>
									<span>{t.dark}</span>
									{#if theme === 'dark'}
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									{/if}
								</button>
							</div>
							{/if}
						</div>
						
						<!-- Settings -->
						<button class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
							Settings
						</button>
						
						<!-- Download SOLO Desktop -->
						<button class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
							Download SOLO Desktop
						</button>
						
						<div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
						
						<!-- Log Out -->
						<button onclick={handleLogout} class="w-full text-left px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
							Log Out
						</button>
					</div>
					{/if}
				</div>
			{:else}
				<div class="space-y-2">
					<button onclick={handleLogin} class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/30 dark:hover:bg-gray-600/30 rounded-md transition-colors flex items-center space-x-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1m5 4h3" />
						</svg>
						<span>登录</span>
					</button>
					<button onclick={handleRegister} class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/30 dark:hover:bg-gray-600/30 rounded-md transition-colors flex items-center space-x-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
						</svg>
						<span>注册</span>
					</button>
				</div>
			{/if}
		</div>
	</div>
	
	<!-- 主内容区域 -->
	<div class="flex-1 h-screen flex flex-col">
		<!-- 顶部工具栏 -->
		<div class="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center">
			<div class="flex items-center space-x-4">
				{#if !sidebarOpen}
					<button onclick={toggleSidebar} class="text-gray-400 hover:text-white" aria-label="打开侧边栏">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				{/if}
				<h1 class="text-xl font-semibold text-blue-400">小说创作助手</h1>
			</div>
			<button onclick={toggleRightSidebar} class="text-gray-400 hover:text-white" aria-label="切换右侧边栏">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
				</svg>
			</button>
		</div>
		
		<!-- 内容区域 -->
		<div class="flex-1 p-4 overflow-auto">
			{@render children()}
		</div>
	</div>
	
	<!-- 右侧栏 -->
	<div class={`${rightSidebarOpen ? 'w-80' : 'w-0'} bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-screen`}>
		<div class="p-4 border-b border-gray-700 flex justify-between items-center">
			<span class="font-medium">小说创作助手</span>
			<button onclick={toggleRightSidebar} class="text-gray-400 hover:text-white" aria-label="关闭右侧边栏">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
				</svg>
			</button>
		</div>
		
		{#if isAgentChatLoaded && AgentChatComponent}
			<AgentChatComponent />
		{:else}
			<div class="flex-1 flex items-center justify-center p-4">
				<div class="flex flex-col items-center space-y-2">
					<div class="flex space-x-2">
						<div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
						<div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
						<div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
					</div>
					<p class="text-gray-500 dark:text-gray-400 text-sm">加载助手...</p>
				</div>
			</div>
		{/if}
	</div>
</div>
