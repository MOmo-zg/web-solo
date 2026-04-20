<script lang="ts">
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
</script>

<div class="min-h-screen bg-gray-50">
	<!-- 顶部导航栏 -->
	<nav class="bg-[#1a237e] text-white shadow-md">
		<div class="container mx-auto px-4 py-3 flex justify-between items-center">
			<div class="flex items-center space-x-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
				<span class="text-xl font-bold">小说创作平台</span>
			</div>
			<div class="flex items-center space-x-4">
				<button class="flex items-center space-x-1 hover:text-[#ffd700] transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					<span>我的资料</span>
				</button>
				<button class="flex items-center space-x-1 hover:text-[#ffd700] transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
					<span>退出登录</span>
				</button>
			</div>
		</div>
	</nav>

	<!-- 主要内容 -->
	<div class="container mx-auto px-4 py-8">
		<!-- 页面标题和创建按钮 -->
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-3xl font-bold text-gray-800">我的小说项目</h1>
			<a href="/create" class="bg-[#ffd700] text-[#1a237e] px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center space-x-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span>创建新项目</span>
			</a>
		</div>

		<!-- 项目列表 -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each projects as project}
				<a href={`/project/${project.id}`} class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block">
					<h3 class="text-xl font-bold text-[#1a237e] mb-2">{project.name}</h3>
					<div class="flex items-center text-sm text-gray-500 mb-2">
						<span class="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{project.type}</span>
						<span class="mx-2">•</span>
						<div class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>{project.updated_at}</span>
						</div>
					</div>
					<p class="text-gray-600 mb-4">{project.description}</p>
					<div class="flex justify-end">
						<span class="text-[#1a237e] hover:text-[#ffd700] transition-colors text-sm font-medium">
							继续创作 →
						</span>
					</div>
				</a>
			{/each}
		</div>

		<!-- 空状态 -->
		{#if projects.length === 0}
			<div class="text-center py-16">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
				<h3 class="text-xl font-semibold text-gray-500 mb-2">还没有小说项目</h3>
				<p class="text-gray-400 mb-6">点击"创建新项目"开始你的创作之旅</p>
				<a href="/create" class="bg-[#ffd700] text-[#1a237e] px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow">
					创建新项目
				</a>
			</div>
		{/if}
	</div>
</div>