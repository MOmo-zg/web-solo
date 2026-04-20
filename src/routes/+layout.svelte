<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { getTheme, setTheme } from '$lib/utils/theme';
	import type { Theme } from '$lib/utils/theme';
	import { getLanguage, setLanguage, getTranslations } from '$lib/utils/i18n';
	import type { Language } from '$lib/utils/i18n';

	let { children } = $props();
	let sidebarOpen = $state(true);
	let rightSidebarOpen = $state(true);
	let userMenuOpen = $state(false);
	let themeHoverOpen = $state(false);
	let languageHoverOpen = $state(false);
	let theme = $state(getTheme());
	let language = $state(getLanguage());
	const t = getTranslations();

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function toggleRightSidebar() {
		rightSidebarOpen = !rightSidebarOpen;
	}

	function changeTheme(newTheme: Theme) {
		setTheme(newTheme);
		theme = newTheme;
		themeHoverOpen = false;
	}

	function changeLanguage(newLanguage: Language) {
		setLanguage(newLanguage);
		language = newLanguage;
		languageHoverOpen = false;
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 flex">
	<!-- 左侧边栏 -->
	<div class={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-50 dark:bg-gray-800 transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-screen z-40 relative`}>
		<div class="p-4 flex justify-between items-center">
			<div class="flex items-center space-x-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
				<span class="font-medium">Novel</span>
			</div>
			<button onclick={toggleSidebar} class="text-gray-400 hover:text-white">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
				</svg>
			</button>
		</div>
		
		<div class="p-4 space-y-6">
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
			<div>
				<div class="flex items-center justify-between text-gray-400 mb-2">
					<span class="text-sm font-medium">Novels</span>
					<button class="text-gray-400 hover:text-white" aria-label="Add novel">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
					</button>
				</div>
				<div class="space-y-1">
					<div class="flex items-center space-x-2 text-gray-300 hover:text-white py-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
						</svg>
						<span>web-solo</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 用户信息区域 -->
		<div class="mt-auto p-4">
			<div class="relative">
				<button onclick={() => userMenuOpen = !userMenuOpen} class="flex items-center space-x-3 w-full text-left py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
					<div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<div class="flex-1">
						<div class="text-sm font-medium text-gray-900 dark:text-gray-300">用户21002254381</div>
					</div>
				</button>

				{#if userMenuOpen}
			<div class="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 py-1">
					<!-- Manage Account -->
					<button class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between">
						<span>Manage Account</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" />
						</svg>
					</button>
					
					<div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
					
					<!-- Language -->
					<div class="relative">
						<button 
							onmouseenter={() => { languageHoverOpen = true; themeHoverOpen = false; }}
							onmouseleave={() => languageHoverOpen = false}
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
						onmouseenter={() => languageHoverOpen = true}
						onmouseleave={() => languageHoverOpen = false}
						class="absolute left-full top-0 ml-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-60 py-1"
					>
						<button onclick={() => changeLanguage('zh')} class={`w-full text-left px-3 py-2 text-sm ${language === 'zh' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors flex items-center justify-between`}>
							<span>{t.chinese}</span>
							{#if language === 'zh'}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							{/if}
						</button>
						<button onclick={() => changeLanguage('en')} class={`w-full text-left px-3 py-2 text-sm ${language === 'en' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors flex items-center justify-between`}>
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
					<div class="relative">
						<button 
							onmouseenter={() => { themeHoverOpen = true; languageHoverOpen = false; }}
							onmouseleave={() => themeHoverOpen = false}
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
						onmouseenter={() => themeHoverOpen = true}
						onmouseleave={() => themeHoverOpen = false}
						class="absolute left-full top-0 ml-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-60 py-1"
					>
						<button onclick={() => changeTheme('light')} class={`w-full text-left px-3 py-2 text-sm ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors flex items-center justify-between`}>
							<span>{t.light}</span>
							{#if theme === 'light'}
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							{/if}
						</button>
						<button onclick={() => changeTheme('dark')} class={`w-full text-left px-3 py-2 text-sm ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors flex items-center justify-between`}>
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
					<button class="w-full text-left px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
						Log Out
					</button>
				</div>
				{/if}
			</div>
		</div>
	</div>
	
	<!-- 主内容区域 -->
	<div class="flex-1 h-screen flex flex-col">
		<!-- 顶部工具栏 -->
		<div class="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between items-center">
			<div class="flex items-center space-x-4">
				{#if !sidebarOpen}
					<button onclick={toggleSidebar} class="text-gray-400 hover:text-white">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				{/if}
				<h1 class="text-xl font-semibold text-blue-400">小说创作助手</h1>
			</div>
			<button onclick={toggleRightSidebar} class="text-gray-400 hover:text-white">
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
			<span class="font-medium">小说信息</span>
			<button onclick={toggleRightSidebar} class="text-gray-400 hover:text-white">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
				</svg>
			</button>
		</div>
		
		<div class="p-4 overflow-y-auto flex-1">
			<!-- 当前小说信息 -->
			<div class="mb-6">
				<h2 class="text-lg font-semibold text-blue-500 dark:text-blue-400 mb-3">当前小说</h2>
				<div class="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
					<h3 class="text-gray-900 dark:text-white font-medium">奇幻冒险小说</h3>
					<p class="text-gray-600 dark:text-gray-300 text-sm mt-1">写到：第一章 勇者的觉醒</p>
					<p class="text-gray-500 dark:text-gray-400 text-xs mt-1">更新时间：2026-04-20</p>
				</div>
			</div>
			
			<!-- 模型上下文 -->
			<div>
				<h2 class="text-lg font-semibold text-blue-500 dark:text-blue-400 mb-3">模型上下文</h2>
				<div class="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
					<div class="text-gray-600 dark:text-gray-300 text-sm space-y-2">
						<p>• 世界观：中世纪奇幻世界，存在魔法和各种种族</p>
						<p>• 主角：年轻的勇者艾伦，拥有特殊的魔法天赋</p>
						<p>• 情节：勇者需要收集五颗宝石来拯救世界</p>
						<p>• 反派：邪恶的黑龙，想要毁灭世界</p>
						<p>• 当前进度：第一章 勇者的觉醒</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
