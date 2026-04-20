<script lang="ts">
	import SettingsDropdown from '$lib/components/SettingsDropdown.svelte';
	import { getTranslations } from '$lib/utils/i18n';
	import { getTheme, applyTheme, setupThemeListener } from '$lib/utils/theme';

	// 初始化主题
	applyTheme(getTheme());
	setupThemeListener();

	// 模拟项目数据
	const mockProjects = [
		{
			id: '1',
			name: '奇幻冒险小说',
			type: '奇幻',
			description: '一个关于勇者拯救世界的故事',
			created_at: '2026-04-15',
			updated_at: '2026-04-18',
		},
		{
			id: '2',
			name: '都市言情小说',
			type: '言情',
			description: '都市男女的爱情故事',
			created_at: '2026-04-10',
			updated_at: '2026-04-17',
		},
		{
			id: '3',
			name: '科幻悬疑小说',
			type: '科幻',
			description: '未来世界的悬疑故事',
			created_at: '2026-04-05',
			updated_at: '2026-04-16',
		},
	];

	let projects = mockProjects;
	const t = getTranslations();
</script>

<!-- 顶部导航栏 -->
<nav class="bg-gray-800 border-b border-gray-700">
	<div class="container mx-auto px-4 py-3 flex justify-between items-center">
		<div class="flex items-center space-x-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
			</svg>
			<span class="text-xl font-bold text-blue-400">Novel Codex</span>
		</div>
		<div class="flex items-center space-x-4">
			<button class="flex items-center space-x-1 hover:text-blue-400 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				<span>{t.profile}</span>
			</button>
			<SettingsDropdown />
			<button class="flex items-center space-x-1 hover:text-blue-400 transition-colors">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
				</svg>
				<span>{t.logout}</span>
			</button>
		</div>
	</div>
</nav>

<!-- 主要内容 -->
<div class="container mx-auto px-4 py-8">
	<!-- 页面标题和创建按钮 -->
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold text-white">{t.myProjects}</h1>
		<a href="/create" class="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span>{t.newProject}</span>
		</a>
	</div>

	<!-- 项目列表 -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each projects as project}
			<a href={`/project/${project.id}`} class="bg-gray-800 border border-gray-700 rounded-md hover:border-blue-500 transition-colors p-6 block">
				<h3 class="text-xl font-bold text-blue-400 mb-2">{project.name}</h3>
				<div class="flex items-center text-sm text-gray-400 mb-2">
					<span class="bg-gray-700 px-2 py-1 rounded text-xs font-medium">{project.type}</span>
					<span class="mx-2">•</span>
					<div class="flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{project.updated_at}</span>
					</div>
				</div>
				<p class="text-gray-400 mb-4">{project.description}</p>
				<div class="flex justify-end">
					<span class="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
						Open Project →
					</span>
				</div>
			</a>
		{/each}
	</div>

	<!-- 空状态 -->
	{#if projects.length === 0}
		<div class="text-center py-16">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
			</svg>
			<h3 class="text-xl font-semibold text-gray-400 mb-2">No Projects Yet</h3>
			<p class="text-gray-500 mb-6">Click "New Project" to start your creative journey</p>
			<a href="/create" class="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
				New Project
			</a>
		</div>
	{/if}
</div>