<script lang="ts">
	import { 
		getProjects, 
		getProjectById, 
		deleteProject, 
		searchProjects, 
		filterProjects, 
		getProjectTypes, 
		importProject, 
		type Project 
	} from '$lib/utils/project';
	import { goto } from '$app/navigation';

	let searchQuery = $state('');
	let filterType = $state('');
	let sortBy = $state<'created_at' | 'updated_at' | 'name'>('updated_at');
	let sortOrder = $state<'asc' | 'desc'>('desc');
	let deleteProjectId = $state<string | null>(null);
	let showImportDialog = $state(false);
	let importFormat = $state<'json' | 'markdown'>('json');
	let importContent = $state('');
	let importSuccess = $state(false);
	
	let allProjectTypes = $state<string[]>([]);
	
	$effect(() => {
		allProjectTypes = getProjectTypes();
	});
	
	let filteredProjects = $derived(() => {
		let projects: Project[];
		
		if (searchQuery) {
			projects = searchProjects(searchQuery);
		} else {
			projects = getProjects();
		}
		
		if (filterType) {
			projects = projects.filter(p => p.type === filterType);
		}
		
		projects.sort((a, b) => {
			let comparison = 0;
			
			if (sortBy === 'name') {
				comparison = a.name.localeCompare(b.name);
			} else {
				const dateA = new Date(a[sortBy]);
				const dateB = new Date(b[sortBy]);
				comparison = dateA.getTime() - dateB.getTime();
			}
			
			return sortOrder === 'asc' ? comparison : -comparison;
		});
		
		return projects;
	});
	
	function goToProject(project: Project) {
		goto(`/project/${project.id}`);
	}
	
	function goToCreateProject() {
		goto('/create');
	}
	
	function confirmDeleteProject(projectId: string) {
		deleteProjectId = projectId;
	}
	
	function cancelDelete() {
		deleteProjectId = null;
	}
	
	function executeDeleteProject() {
		if (deleteProjectId) {
			deleteProject(deleteProjectId);
			deleteProjectId = null;
		}
	}
	
	function clearFilters() {
		searchQuery = '';
		filterType = '';
		sortBy = 'updated_at';
		sortOrder = 'desc';
	}
	
	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				importContent = e.target?.result as string || '';
				
				// 根据文件扩展名设置格式
				if (file.name.endsWith('.json')) {
					importFormat = 'json';
				} else if (file.name.endsWith('.md')) {
					importFormat = 'markdown';
				}
			};
			reader.readAsText(file);
		}
	}
	
	function handleImport() {
		if (importContent) {
			const project = importProject(importContent, importFormat);
			if (project) {
				importSuccess = true;
				setTimeout(() => {
					importSuccess = false;
					showImportDialog = false;
					importContent = '';
				}, 1500);
			}
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<!-- 页面标题 -->
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-800 dark:text-white">项目列表</h1>
			<p class="text-gray-600 dark:text-gray-300 mt-2">管理你的小说创作项目</p>
		</div>
		<div class="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-4 md:mt-0">
			<button 
				onclick={() => showImportDialog = true} 
				class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
				</svg>
				<span>导入项目</span>
			</button>
			<button 
				onclick={goToCreateProject} 
				class="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span>创建项目</span>
			</button>
		</div>
	</div>

	<!-- 搜索和筛选栏 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<!-- 搜索框 -->
			<div class="md:col-span-2">
				<label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">搜索项目</label>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<input
						type="text"
						id="search"
						bind:value={searchQuery}
						class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
						placeholder="搜索项目名称、描述或类型..."
					/>
					{#if searchQuery}
						<button 
							onclick={() => searchQuery = ''} 
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							aria-label="清除搜索"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					{/if}
				</div>
			</div>

			<!-- 类型筛选 -->
			<div>
				<label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">项目类型</label>
				<select
					id="type"
					bind:value={filterType}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
				>
					<option value="">全部类型</option>
					{#each allProjectTypes as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
			</div>

			<!-- 排序 -->
			<div>
				<label for="sort" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">排序方式</label>
				<select
					id="sort"
					bind:value={sortBy}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
				>
					<option value="updated_at">最近更新</option>
					<option value="created_at">创建时间</option>
					<option value="name">名称</option>
				</select>
			</div>
		</div>

		<!-- 排序方向和清除筛选按钮 -->
		<div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div class="flex items-center space-x-4">
				<span class="text-sm text-gray-600 dark:text-gray-400">排序方向:</span>
				<div class="flex items-center space-x-2">
					<button
						onclick={() => sortOrder = 'asc'}
						class={`px-3 py-1 text-sm rounded-md transition-colors ${sortOrder === 'asc' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
					>
						升序
					</button>
					<button
						onclick={() => sortOrder = 'desc'}
						class={`px-3 py-1 text-sm rounded-md transition-colors ${sortOrder === 'desc' ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
					>
						降序
					</button>
				</div>
			</div>
			
			{#if searchQuery || filterType || sortBy !== 'updated_at' || sortOrder !== 'desc'}
				<button 
					onclick={clearFilters} 
					class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
				>
					清除筛选
				</button>
			{/if}
		</div>
	</div>

	<!-- 项目数量信息 -->
	<div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
		显示 {filteredProjects().length} 个项目，共 {getProjects().length} 个
	</div>

	<!-- 项目网格 -->
	{#if filteredProjects().length === 0}
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
				{searchQuery || filterType ? '没有找到匹配的项目' : '还没有项目'}
			</h3>
			<p class="text-gray-500 dark:text-gray-400 mb-4">
				{searchQuery || filterType ? '尝试调整搜索条件或筛选类型' : '点击上方按钮创建你的第一个小说项目'}
			</p>
			{#if !searchQuery && !filterType}
				<button 
					onclick={goToCreateProject} 
					class="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
				>
					创建项目
				</button>
			{/if}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredProjects() as project}
				<div 
					class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
				>
					<div class="p-6">
						<div class="flex justify-between items-start mb-4">
							<div>
								<span class="inline-block px-2 py-1 text-xs font-medium rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
									{project.type}
								</span>
							</div>
							<div class="opacity-0 group-hover:opacity-100 transition-opacity">
								<button 
									onclick={(e) => { e.stopPropagation(); confirmDeleteProject(project.id); }} 
									class="p-1 text-gray-400 hover:text-red-500 transition-colors"
									aria-label="删除项目"
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>
						
						<button 
							onclick={() => goToProject(project)}
							class="text-xl font-semibold text-gray-800 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left w-full"
						>
							{project.name}
						</button>
						
						<p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
							{project.description}
						</p>
						
						<div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
							<div>
								<span>创建: {new Date(project.created_at).toLocaleDateString('zh-CN')}</span>
							</div>
							<div>
								<span>更新: {new Date(project.updated_at).toLocaleDateString('zh-CN')}</span>
							</div>
						</div>
					</div>
					
					<div class="bg-gray-50 dark:bg-gray-700 px-6 py-3">
						<button 
							onclick={() => goToProject(project)} 
							class="w-full text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
						>
							查看项目 →
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- 删除确认弹窗 -->
{#if deleteProjectId}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
			<div class="p-6">
				<div class="flex items-center mb-4">
					<div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">确认删除</h3>
						<p class="text-gray-600 dark:text-gray-400">你确定要删除这个项目吗？此操作无法撤销。</p>
					</div>
				</div>
				
				<div class="flex justify-end space-x-3 mt-6">
					<button 
						onclick={cancelDelete} 
						class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					>
						取消
					</button>
					<button 
						onclick={executeDeleteProject} 
						class="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
					>
						删除
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- 导入对话框 -->
{#if showImportDialog}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
			<div class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white">导入项目</h3>
					<button 
							onclick={() => showImportDialog = false} 
							class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
							aria-label="关闭导入对话框"
						>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
				</div>
				
				{#if importSuccess}
					<div class="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg p-4 mb-4">
						<div class="flex items-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
							</svg>
							<span>项目导入成功！</span>
						</div>
					</div>
				{:else}
					<div class="space-y-4">
						<div>
							<label for="fileUpload" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">选择文件</label>
							<label for="fileUpload" class="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
								<div class="flex flex-col items-center text-gray-500 dark:text-gray-400">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
									</svg>
									<span class="text-sm">点击选择文件或拖放</span>
									<span class="text-xs text-gray-400 mt-1">支持 JSON 和 Markdown 格式</span>
								</div>
							</label>
							<input id="fileUpload" type="file" accept=".json,.md" onchange={handleFileUpload} class="hidden" />
						</div>
						
						{#if importContent}
							<div>
								<label for="importFormat" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">文件格式</label>
								<select
									id="importFormat"
									bind:value={importFormat}
									class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
								>
									<option value="json">JSON</option>
									<option value="markdown">Markdown</option>
								</select>
							</div>
							
							<div>
								<label for="importContent" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">文件内容</label>
								<textarea
									id="importContent"
									bind:value={importContent}
									rows={8}
									class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
								></textarea>
							</div>
						{/if}
					</div>
					
					<div class="flex justify-end space-x-3 mt-6">
						<button 
							onclick={() => showImportDialog = false} 
							class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						>
							取消
						</button>
						<button 
							onclick={handleImport} 
							disabled={!importContent}
							class="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							导入
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
