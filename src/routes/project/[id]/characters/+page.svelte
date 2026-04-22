<script lang="ts">
	import { page } from '$app/stores';
	import { getProjectById, getCharacters, addCharacter, updateCharacter, deleteCharacter, type Character } from '$lib/utils/project';

	const projectId = $page.params.id;
	const safeProjectId = projectId || 'default';

	// 项目数据
	let project = $state({
		id: safeProjectId,
		name: '加载中...',
		type: '未知类型',
		description: '正在加载项目数据...'
	});

	// 角色列表
	let characters = $state<Character[]>([]);

	// 加载状态
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);

	// 当前正在编辑的角色
	let editingCharacter = $state<Character | null>(null);

	// 创建/编辑角色的表单数据
	let characterForm = $state({
		name: '',
		alias: '',
		description: '',
		appearance: '',
		personality: '',
		background: '',
		relationships: '',
		image_url: ''
	});

	// 表单状态
	let isSubmitting = $state(false);
	let formError = $state<string | null>(null);

	// 删除角色状态
	let isDeleting = $state(false);
	let deleteError = $state<string | null>(null);

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

	// 加载角色列表
	async function loadCharacters() {
		isLoading = true;
		loadError = null;
		try {
			const data = await getCharacters(safeProjectId);
			characters = data;
		} catch (error) {
			loadError = '加载角色列表失败，请重试';
			console.error('Error loading characters:', error);
		} finally {
			isLoading = false;
		}
	}

	// 打开创建新角色的表单
	function openCreateForm() {
		editingCharacter = null;
		characterForm = {
			name: '',
			alias: '',
			description: '',
			appearance: '',
			personality: '',
			background: '',
			relationships: '',
			image_url: ''
		};
		formError = null;
	}

	// 打开编辑角色的表单
	function openEditForm(character: Character) {
		editingCharacter = character;
		characterForm = {
			name: character.name,
			alias: character.alias || '',
			description: character.description,
			appearance: character.appearance || '',
			personality: character.personality || '',
			background: character.background || '',
			relationships: character.relationships || '',
			image_url: character.image_url || ''
		};
		formError = null;
	}

	// 关闭表单
	function closeForm() {
		editingCharacter = null;
	}

	// 提交角色表单
	async function handleSubmitForm() {
		if (!characterForm.name.trim()) {
			formError = '角色名称不能为空';
			return;
		}

		isSubmitting = true;
		formError = null;
		try {
			if (editingCharacter) {
				// 更新现有角色
				const result = await updateCharacter(safeProjectId, editingCharacter.id, characterForm);
				if (result) {
					await loadCharacters();
					closeForm();
				} else {
					formError = '更新角色失败，请重试';
				}
			} else {
				// 创建新角色
				const result = await addCharacter(safeProjectId, characterForm);
				if (result) {
					await loadCharacters();
					closeForm();
				} else {
					formError = '创建角色失败，请重试';
				}
			}
		} catch (error) {
			formError = error instanceof Error ? error.message : '操作失败，请重试';
			console.error('Error submitting character form:', error);
		} finally {
			isSubmitting = false;
		}
	}

	// 删除角色
	async function handleDeleteCharacter(character: Character) {
		if (!confirm(`确定要删除角色 "${character.name}" 吗？此操作不可恢复。`)) {
			return;
		}

		isDeleting = true;
		deleteError = null;
		try {
			const result = await deleteCharacter(safeProjectId, character.id);
			if (result) {
				await loadCharacters();
			} else {
				deleteError = '删除角色失败，请重试';
			}
		} catch (error) {
			deleteError = error instanceof Error ? error.message : '删除角色失败，请重试';
			console.error('Error deleting character:', error);
		} finally {
			isDeleting = false;
		}
	}

	// 初始化加载数据
	async function init() {
		await loadProject();
		await loadCharacters();
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
			<a href={`/project/${projectId}/characters`} class="px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
				角色管理
			</a>
			<a href={`/project/${projectId}/world-settings`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
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
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">角色管理</h1>
			<p class="text-gray-600 dark:text-gray-400">管理小说中的角色信息</p>
		</div>
		<button
			onclick={openCreateForm}
			class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2 font-medium"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
			</svg>
			<span>添加角色</span>
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

	<!-- 角色列表 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">角色列表</h2>
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
		{:else if characters.length === 0}
			<div class="text-center py-8">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
				<p class="mt-2 text-gray-500 dark:text-gray-400">还没有添加任何角色</p>
				<p class="mt-1 text-sm text-gray-400 dark:text-gray-500">点击"添加角色"按钮创建你的第一个角色</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each characters as character}
					<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
						<div class="flex items-start justify-between mb-3">
							<div class="flex items-center space-x-3">
								{#if character.image_url}
									<img src={character.image_url} alt={character.name} class="w-12 h-12 rounded-full object-cover" />
								{:else}
									<div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
										{character.name.charAt(0).toUpperCase()}
									</div>
								{/if}
								<div>
									<h3 class="font-semibold text-gray-900 dark:text-white">{character.name}</h3>
									{#if character.alias}
										<p class="text-sm text-gray-500 dark:text-gray-400">({character.alias})</p>
									{/if}
								</div>
							</div>
							<div class="flex space-x-1">
								<button
									onclick={() => openEditForm(character)}
									class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
									aria-label="编辑角色"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</button>
								<button
									onclick={() => handleDeleteCharacter(character)}
									disabled={isDeleting}
									class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
									aria-label="删除角色"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{character.description}</p>
						<div class="text-xs text-gray-500 dark:text-gray-500">
							更新于: {new Date(character.updated_at).toLocaleString()}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- 创建/编辑角色的弹窗 -->
	{#if editingCharacter !== null || characterForm.name !== '' || characterForm.description !== ''}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div class="p-6 border-b border-gray-200 dark:border-gray-700">
					<div class="flex justify-between items-center">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							{editingCharacter ? '编辑角色' : '添加新角色'}
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
							<div class="md:col-span-2">
								<label for="characterName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">角色名称 *</label>
								<input
									type="text"
									id="characterName"
									bind:value={characterForm.name}
									placeholder="输入角色名称"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
									required
								/>
							</div>

							<div>
								<label for="characterAlias" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">别名</label>
								<input
									type="text"
									id="characterAlias"
									bind:value={characterForm.alias}
									placeholder="角色别名（可选）"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								/>
							</div>

							<div>
								<label for="characterImageUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">角色图片URL</label>
								<input
									type="text"
									id="characterImageUrl"
									bind:value={characterForm.image_url}
									placeholder="图片链接（可选）"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								/>
							</div>

							<div class="md:col-span-2">
								<label for="characterDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">角色简介 *</label>
								<textarea
									id="characterDescription"
									bind:value={characterForm.description}
									placeholder="简要描述这个角色"
									rows="3"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
									required
								></textarea>
							</div>

							<div class="md:col-span-2">
								<label for="characterAppearance" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">外貌描写</label>
								<textarea
									id="characterAppearance"
									bind:value={characterForm.appearance}
									placeholder="角色的外貌特征描述"
									rows="4"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								></textarea>
							</div>

							<div class="md:col-span-2">
								<label for="characterPersonality" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">性格特点</label>
								<textarea
									id="characterPersonality"
									bind:value={characterForm.personality}
									placeholder="角色的性格特征"
									rows="4"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								></textarea>
							</div>

							<div class="md:col-span-2">
								<label for="characterBackground" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">背景故事</label>
								<textarea
									id="characterBackground"
									bind:value={characterForm.background}
									placeholder="角色的背景和经历"
									rows="4"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								></textarea>
							</div>

							<div class="md:col-span-2">
								<label for="characterRelationships" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">人际关系</label>
								<textarea
									id="characterRelationships"
									bind:value={characterForm.relationships}
									placeholder="与其他角色的关系"
									rows="4"
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
									{editingCharacter ? '保存修改' : '创建角色'}
								{/if}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{/if}
</div>
