<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import SettingsDropdown from '$lib/components/SettingsDropdown.svelte';
	import { getTheme, applyTheme, setupThemeListener } from '$lib/utils/theme';
	import { addProject } from '$lib/utils/project';

	// 初始化主题
	applyTheme(getTheme());
	setupThemeListener();

	let projectName = $state('');
	let projectType = $state('');
	let projectDescription = $state('');

	const projectTypes = ['奇幻', '言情', '科幻', '悬疑', '历史', '武侠', '现代'];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		// 创建项目
		const newProject = addProject({
			name: projectName,
			type: projectType,
			description: projectDescription
		});
		// 跳转到项目编辑页
		throw redirect(302, `/project/${newProject.id}`);
	}
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
				<SettingsDropdown />
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
		<!-- 页面标题 -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-800">创建新项目</h1>
			<p class="text-gray-600 mt-2">设置你的小说项目基本信息</p>
		</div>

		<!-- 表单 -->
		<div class="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
			<form onsubmit={handleSubmit}>
				<div class="mb-6">
					<label for="projectName" class="block text-sm font-medium text-gray-700 mb-2">项目名称</label>
					<input
						type="text"
						id="projectName"
						bind:value={projectName}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e]"
						required
					/>
				</div>

				<div class="mb-6">
					<label for="projectType" class="block text-sm font-medium text-gray-700 mb-2">小说类型</label>
					<select
						id="projectType"
						bind:value={projectType}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e]"
						required
					>
						<option value="">请选择类型</option>
						{#each projectTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>

				<div class="mb-6">
					<label for="projectDescription" class="block text-sm font-medium text-gray-700 mb-2">项目描述</label>
					<textarea
						id="projectDescription"
						bind:value={projectDescription}
						rows={4}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e]"
						placeholder="简要描述你的小说内容..."
					></textarea>
				</div>

				<div class="flex justify-end space-x-4">
					<a href="/" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
						取消
					</a>
					<button
						type="submit"
						class="bg-[#ffd700] text-[#1a237e] px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
					>
						创建项目
					</button>
				</div>
			</form>
		</div>
	</div>
</div>