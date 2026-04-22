<script lang="ts">
	import { page } from '$app/stores';
	import { getProjectById, getWorldSettings, addWorldSetting, updateWorldSetting, deleteWorldSetting, type WorldSetting } from '$lib/utils/project';

	const projectId = $page.params.id;
	const safeProjectId = projectId || 'default';

	// 项目数据
	let project = $state({
		id: safeProjectId,
		name: '加载中...',
		type: '未知类型',
		description: '正在加载项目数据...'
	});

	// 世界观/设定列表
	let worldSettings = $state<WorldSetting[]>([]);

	// 加载状态
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);

	// 当前正在编辑的设定
	let editingSetting = $state<WorldSetting | null>(null);

	// 创建/编辑设定的表单数据
	let settingForm = $state({
		name: '',
		type: '',
		description: '',
		content: ''
	});

	// 表单状态
	let isSubmitting = $state(false);
	let formError = $state<string | null>(null);

	// 删除设定状态
	let isDeleting = $state(false);
	let deleteError = $state<string | null>(null);

	// 常用设定类型
	const commonTypes = ['地理环境', '历史背景', '社会结构', '魔法系统', '科技水平', '文化习俗', '宗教信仰', '其他'];

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

	// 加载设定列表
	async function loadWorldSettings() {
		isLoading = true;
		loadError = null;
		try {
			const data = await getWorldSettings(safeProjectId);
			worldSettings = data;
		} catch (error) {
			loadError = '加载世界观/设定列表失败，请重试';
			console.error('Error loading world settings:', error);
		} finally {
			isLoading = false;
		}
	}

	// 打开创建新设定的表单
	function openCreateForm() {
		editingSetting = null;
		settingForm = {
			name: '',
			type: '',
			description: '',
			content: ''
		};
		formError = null;
	}

	// 打开编辑设定的表单
	function openEditForm(setting: WorldSetting) {
		editingSetting = setting;
		settingForm = {
			name: setting.name,
			type: setting.type,
			description: setting.description,
			content: setting.content || ''
		};
		formError = null;
	}

	// 关闭表单
	function closeForm() {
		editingSetting = null;
	}

	// 提交设定表单
	async function handleSubmitForm() {
		if (!settingForm.name.trim() || !settingForm.type.trim() || !settingForm.description.trim()) {
			formError = '请填写所有必填字段';
			return;
		}

		isSubmitting = true;
		formError = null;
		try {
			if (editingSetting) {
				// 更新现有设定
				const result = await updateWorldSetting(safeProjectId, editingSetting.id, settingForm);
				if (result) {
					await loadWorldSettings();
					closeForm();
				} else {
					formError = '更新设定失败，请重试';
				}
			} else {
				// 创建新设定
				const result = await addWorldSetting(safeProjectId, settingForm);
				if (result) {
					await loadWorldSettings();
					closeForm();
				} else {
					formError = '创建设定失败，请重试';
				}
			}
		} catch (error) {
			formError = error instanceof Error ? error.message : '操作失败，请重试';
			console.error('Error submitting setting form:', error);
		} finally {
			isSubmitting = false;
		}
	}

	// 删除设定
	async function handleDeleteSetting(setting: WorldSetting) {
		if (!confirm(`确定要删除设定 "${setting.name}" 吗？此操作不可恢复。`)) {
			return;
		}

		isDeleting = true;
		deleteError = null;
		try {
			const result = await deleteWorldSetting(safeProjectId, setting.id);
			if (result) {
				await loadWorldSettings();
			} else {
				deleteError = '删除设定失败，请重试';
			}
		} catch (error) {
			deleteError = error instanceof Error ? error.message : '删除设定失败，请重试';
			console.error('Error deleting setting:', error);
		} finally {
			isDeleting = false;
		}
	}

	// 初始化加载数据
	async function init() {
		await loadProject();
		await loadWorldSettings();
	}

	init();
</script>

<div class="p-6 space-y-6">
	<!-- 项目导航 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
		<div class="flex flex-wrap gap-4">
			<a href={`/project/${projectId}`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				编辑内容
			</a>
			<a href={`/project/${projectId}/chapters`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				章节管理
			</a>
			<a href={`/project/${projectId}/characters`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				角色管理
			</a>
			<a href={`/project/${projectId}/world-settings`} class="px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
				世界观/设定
			</a>
			<a href={`/project/${projectId}/export`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				导出项目
			</a>
			<a href={`/project/${projectId}/versions`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				版本控制
			</a>
			<a href={`/project/${projectId}/collaboration`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				协作管理
			</a>
		</div>
	</div>

	<!-- 页面标题 -->
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">世界观/设定管理</h1>
			<p class="text-gray-600 dark:text-gray-400">管理小说的世界观和设定信息</p>
		</div>
		<button
			onclick={openCreateForm}
			class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2 font-medium"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
			</svg>
			<span>添加设定</span>
		</button>
	</div>

	<!-- 项目信息 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">项目信息</h2>
		<div class="space-y-3">
			<div class="flex justify-between">
				<span class="text-gray-600 dark:text-gray-400">项目名称:</span>
				<span class="text-gray-900 dark:text-white font-medium">{project.name}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-gray-600 dark:text-gray-400">项目类型:</span>
				<span class="text-gray-900 dark:text-white">{project.type}</span>
			</div>
			<div class="flex justify-between">
				<span class="text-gray-600 dark:text-gray-400">项目描述:</span>
				<span class="text-gray-900 dark:text-white truncate max-w-md">{project.description}</span>
			</div>
		</div>
	</div>

	<!-- 设定列表 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">设定列表</h2>
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
		{:else if worldSettings.length === 0}
			<div class="text-center py-8">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
				</svg>
				<p class="mt-2 text-gray-500 dark:text-gray-400">还没有添加任何设定</p>
				<p class="mt-1 text-sm text-gray-400 dark:text-gray-500">点击"添加设定"按钮创建你的第一个设定</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each worldSettings as setting}
					<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
						<div class="flex justify-between items-start mb-3">
							<div>
								<div class="flex items-center space-x-3 mb-2">
									<h3 class="font-semibold text-gray-900 dark:text-white">{setting.name}</h3>
									<span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded">
										{setting.type}
									</span>
								</div>
								<p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{setting.description}</p>
								{#if setting.content}
									<div class="mt-3">
										<details class="group">
											<summary class="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
												查看详细内容
											</summary>
											<div class="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
												{setting.content}
											</div>
										</details>
									</div>
								{/if}
							</div>
							<div class="flex space-x-1">
								<button
									onclick={() => openEditForm(setting)}
									class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
									aria-label="编辑设定"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</button>
								<button
									onclick={() => handleDeleteSetting(setting)}
									disabled={isDeleting}
									class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
									aria-label="删除设定"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>
						<div class="text-xs text-gray-500 dark:text-gray-500">
							更新于: {new Date(setting.updated_at).toLocaleString()}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- 创建/编辑设定的弹窗 -->
	{#if editingSetting !== null || settingForm.name !== '' || settingForm.description !== ''}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div class="p-6 border-b border-gray-200 dark:border-gray-700">
					<div class="flex justify-between items-center">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							{editingSetting ? '编辑设定' : '添加新设定'}
						</h2>
						<button
							onclick={closeForm}
							class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							aria-label="关闭表单"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				<div class="p-6">
					{#if formError}
						<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
							<p>{formError}</p>
						</div>
					{/if}

					<form onsubmit={e => { e.preventDefault(); handleSubmitForm(); }} class="space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label for="settingName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">设定名称 *</label>
								<input
									type="text"
									id="settingName"
									bind:value={settingForm.name}
									placeholder="输入设定名称"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
									required
								/>
							</div>

							<div>
								<label for="settingType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">设定类型 *</label>
								<div class="relative">
									<select
										id="settingType"
										bind:value={settingForm.type}
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
										required
									>
										<option value="">选择类型...</option>
										{#each commonTypes as type}
											<option value={type}>{type}</option>
										{/each}
									</select>
									<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
										<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
											<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
										</svg>
									</div>
								</div>
								<div class="mt-2">
									<label for="customType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">或输入自定义类型:</label>
									<input
										id="customType"
										type="text"
										oninput={(e) => {
									const target = e.target as HTMLInputElement;
									settingForm.type = target.value;
								}}
										placeholder="输入自定义类型"
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
									/>
								</div>
							</div>

							<div class="md:col-span-2">
								<label for="settingDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">设定简介 *</label>
								<textarea
									id="settingDescription"
									bind:value={settingForm.description}
									placeholder="简要描述这个设定"
									rows="3"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
									required
								></textarea>
							</div>

							<div class="md:col-span-2">
								<label for="settingContent" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">详细内容</label>
								<textarea
									id="settingContent"
									bind:value={settingForm.content}
									placeholder="设定的详细说明"
									rows="8"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								></textarea>
							</div>
						</div>

						<div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
							<button
								type="button"
								onclick={closeForm}
								class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
							>
								取消
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
							>
								{#if isSubmitting}
									<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									保存中...
								{:else}
									{editingSetting ? '保存修改' : '创建设定'}
								{/if}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
