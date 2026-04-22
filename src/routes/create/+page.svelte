<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import { addProject } from '$lib/utils/project';

	let projectName = $state('');
	let projectType = $state('');
	let projectDescription = $state('');

	const projectTypes = ['奇幻', '言情', '科幻', '悬疑', '历史', '武侠', '现代'];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		// 创建项目
		const newProject = await addProject({
			name: projectName,
			type: projectType,
			description: projectDescription
		});
		// 跳转到项目编辑页
		if (newProject) {
			throw redirect(302, `/project/${newProject.id}`);
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<!-- 页面标题 -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-800 dark:text-white">创建新项目</h1>
		<p class="text-gray-600 dark:text-gray-300 mt-2">设置你的小说项目基本信息</p>
	</div>

	<!-- 表单 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto">
		<form onsubmit={handleSubmit}>
			<div class="mb-6">
				<label for="projectName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">项目名称</label>
				<input
					type="text"
					id="projectName"
					bind:value={projectName}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
					required
				/>
			</div>

			<div class="mb-6">
				<label for="projectType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">小说类型</label>
				<select
					id="projectType"
					bind:value={projectType}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
					required
				>
					<option value="">请选择类型</option>
					{#each projectTypes as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
			</div>

			<div class="mb-6">
				<label for="projectDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">项目描述</label>
				<textarea
					id="projectDescription"
					bind:value={projectDescription}
					rows={4}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
					placeholder="简要描述你的小说内容..."
				></textarea>
			</div>

			<div class="flex justify-end space-x-4">
				<a href="/" class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					取消
				</a>
				<button
					type="submit"
					class="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-blue-600 transition-colors"
				>
					创建项目
				</button>
			</div>
		</form>
	</div>
</div>