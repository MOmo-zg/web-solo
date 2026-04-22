<script lang="ts">
	import { page } from '$app/stores';
	import { getProjectById, getVersions, createVersion, restoreVersion, deleteVersion } from '$lib/utils/project';

	const projectId = $page.params.id;
	const safeProjectId = projectId || 'default';

	// 项目数据
	let project = $state({
		id: safeProjectId,
		name: '加载中...',
		type: '未知类型',
		description: '正在加载项目数据...'
	});

	// 版本列表
	let versions = $state<Array<{
		id: string;
		project_id: string;
		name: string;
		description: string;
		content?: string;
		chapters?: Array<{
			id: string;
			title: string;
			content: string;
			order: number;
			created_at: string;
			updated_at: string;
		}>;
		created_at: string;
		updated_by: string;
	}>>([]);

	// 加载状态
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);

	// 创建版本的表单数据
	let createVersionForm = $state({
		name: '',
		description: ''
	});

	// 创建版本的状态
	let isCreatingVersion = $state(false);
	let createVersionError = $state<string | null>(null);

	// 恢复版本的状态
	let isRestoringVersion = $state(false);
	let restoreVersionError = $state<string | null>(null);

	// 删除版本的状态
	let isDeletingVersion = $state(false);
	let deleteVersionError = $state<string | null>(null);

	// 加载项目数据
	async function loadProject() {
		isLoading = true;
		loadError = null;
		try {
			const data = await getProjectById(safeProjectId);
			if (data) {
				project = data;
			} else {
				loadError = '项目不存在';
				project = {
					id: safeProjectId,
					name: '未知项目',
					type: '未知类型',
					description: '项目不存在'
				};
			}
		} catch (error) {
			loadError = '加载项目失败，请重试';
			console.error('Error loading project:', error);
		} finally {
			isLoading = false;
		}
	}

	// 加载版本列表
	async function loadVersions() {
		isLoading = true;
		loadError = null;
		try {
			const data = await getVersions(safeProjectId);
			versions = data;
		} catch (error) {
			loadError = '加载版本列表失败，请重试';
			console.error('Error loading versions:', error);
		} finally {
			isLoading = false;
		}
	}

	// 创建版本
	async function handleCreateVersion() {
		if (!createVersionForm.name.trim()) {
			createVersionError = '版本名称不能为空';
			return;
		}

		isCreatingVersion = true;
		createVersionError = null;
		try {
			const result = await createVersion(safeProjectId, {
				name: createVersionForm.name.trim(),
				description: createVersionForm.description.trim()
			});

			if (result) {
				// 重置表单
				createVersionForm = {
					name: '',
					description: ''
				};
				// 重新加载版本列表
				await loadVersions();
			} else {
				createVersionError = '创建版本失败，请重试';
			}
		} catch (error) {
			createVersionError = '创建版本失败，请重试';
			console.error('Error creating version:', error);
		} finally {
			isCreatingVersion = false;
		}
	}

	// 恢复版本
	async function handleRestoreVersion(versionId: string) {
		if (!confirm('确定要恢复到这个版本吗？当前的更改将会丢失。')) {
			return;
		}

		isRestoringVersion = true;
		restoreVersionError = null;
		try {
			const result = await restoreVersion(safeProjectId, versionId);
			if (result) {
				// 重新加载项目数据和版本列表
				await loadProject();
				await loadVersions();
				alert('版本恢复成功');
			} else {
				restoreVersionError = '恢复版本失败，请重试';
			}
		} catch (error) {
			restoreVersionError = '恢复版本失败，请重试';
			console.error('Error restoring version:', error);
		} finally {
			isRestoringVersion = false;
		}
	}

	// 删除版本
	async function handleDeleteVersion(versionId: string) {
		if (!confirm('确定要删除这个版本吗？此操作不可恢复。')) {
			return;
		}

		isDeletingVersion = true;
		deleteVersionError = null;
		try {
			const result = await deleteVersion(safeProjectId, versionId);
			if (result) {
				// 重新加载版本列表
				await loadVersions();
			} else {
				deleteVersionError = '删除版本失败，请重试';
			}
		} catch (error) {
			deleteVersionError = '删除版本失败，请重试';
			console.error('Error deleting version:', error);
		} finally {
			isDeletingVersion = false;
		}
	}

	// 初始化加载数据
	async function init() {
		await loadProject();
		await loadVersions();
	}

	init();
</script>

<div class="p-6 space-y-6">
	<!-- 项目导航 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
		<div class="flex space-x-4">
			<a href={`/project/${projectId}`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				编辑内容
			</a>
			<a href={`/project/${projectId}/chapters`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				章节管理
			</a>
			<a href={`/project/${projectId}/export`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				导出项目
			</a>
			<a href={`/project/${projectId}/versions`} class="px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
				版本控制
			</a>
		</div>
	</div>

	<!-- 页面标题 -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">版本控制</h1>
		<p class="text-gray-600 dark:text-gray-400">管理项目的历史版本，创建新版本或恢复到之前的版本</p>
	</div>

	<!-- 项目信息 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">项目信息</h2>
		<div class="space-y-3">
			<div class="flex justify-between">
				<span class="text-gray-600 dark:text-gray-400">项目名称：</span>
				<span class="text-gray-900 dark:text-white font-medium">{project.name}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-gray-600 dark:text-gray-400">项目类型：</span>
				<span class="text-gray-900 dark:text-white">{project.type}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-gray-600 dark:text-gray-400">项目描述：</span>
				<span class="text-gray-900 dark:text-white truncate max-w-md">{project.description}</span>
			</div>
		</div>
	</div>

	<!-- 创建新版本 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">创建新版本</h2>
		{#if createVersionError}
			<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
				<p>{createVersionError}</p>
			</div>
		{/if}
		<form on:submit|preventDefault={handleCreateVersion} class="space-y-4">
			<div>
				<label for="versionName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">版本名称</label>
				<input
					type="text"
					id="versionName"
					bind:value={createVersionForm.name}
					placeholder="例如：第一章完成"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
				/>
			</div>
			<div>
				<label for="versionDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">版本描述</label>
				<textarea
					id="versionDescription"
					bind:value={createVersionForm.description}
					placeholder="描述这个版本的主要变更..."
					rows={3}
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
				></textarea>
			</div>
			<button
				type="submit"
				disabled={isCreatingVersion}
				class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
			>
				{#if isCreatingVersion}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					创建中...
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
					</svg>
					创建版本
				{/if}
			</button>
		</form>
	</div>

	<!-- 版本列表 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">版本历史</h2>
		{#if loadError}
			<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
				<p>{loadError}</p>
			</div>
		{:else if isLoading}
			<div class="flex justify-center items-center py-8">
				<svg class="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span class="ml-2 text-gray-600 dark:text-gray-400">加载中...</span>
			</div>
		{:else if versions.length === 0}
			<div class="text-center py-8">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				<p class="mt-2 text-gray-500 dark:text-gray-400">还没有创建任何版本</p>
				<p class="mt-1 text-sm text-gray-400 dark:text-gray-500">创建版本可以帮助你保存项目的历史状态，以便在需要时恢复</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each versions as version, index}
					<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
						<div class="flex justify-between items-start mb-3">
							<div>
								<h3 class="font-medium text-gray-900 dark:text-white">{version.name}</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{version.description}</p>
							</div>
							<div class="text-right">
								<p class="text-sm text-gray-500 dark:text-gray-400">创建于: {new Date(version.created_at).toLocaleString()}</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">创建者: {version.updated_by}</p>
							</div>
						</div>
						<div class="flex justify-end space-x-2">
							<button
								onclick={() => handleRestoreVersion(version.id)}
								disabled={isRestoringVersion}
								class="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
							>
								{#if isRestoringVersion}
									恢复中...
								{:else}
									恢复
								{/if}
							</button>
							<button
								onclick={() => handleDeleteVersion(version.id)}
								disabled={isDeletingVersion}
								class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
							>
								{#if isDeletingVersion}
									删除中...
								{:else}
									删除
								{/if}
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>