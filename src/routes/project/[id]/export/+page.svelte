<script lang="ts">
	import { page } from '$app/stores';
	import { getProjectById, exportAndDownloadProject } from '$lib/utils/project';

	const projectId = $page.params.id;
	const safeProjectId = projectId || 'default';
	let project = $state({
		id: safeProjectId,
		name: '加载中...',
		type: '未知类型',
		description: '正在加载项目数据...'
	});
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);

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

	// 导出格式
	let exportFormat = $state<'markdown' | 'txt' | 'pdf' | 'epub'>('markdown');

	// 导出状态
	let isExporting = $state(false);

	// 执行导出
	async function handleExport() {
		isExporting = true;
		try {
			await exportAndDownloadProject(safeProjectId, exportFormat);
		} catch (error) {
			alert('导出失败，请重试');
			console.error('Error exporting project:', error);
		} finally {
			isExporting = false;
		}
	}

	// 初始化加载项目数据
	loadProject();
</script>

<div class="p-6 space-y-6">
	<!-- 项目导航 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
		<div class="flex space-x-4">
						<a href={`/project/${projectId}`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
							编辑内容
						</a>
						<a href={`/project/${projectId}/chapters`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
							章节管理
						</a>
						<a href={`/project/${projectId}/export`} class="px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
							导出项目
						</a>
						<a href={`/project/${projectId}/versions`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
							版本控制
						</a>
					</div>
	</div>

	{#if isLoading}
		<!-- 加载状态 -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center">
			<div class="flex flex-col items-center">
				<svg class="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<p class="mt-4 text-gray-600 dark:text-gray-400">正在加载项目数据...</p>
			</div>
		</div>
	{:else if loadError}
		<!-- 错误状态 -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
			<div class="flex items-center space-x-4">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
				<div>
					<h3 class="text-lg font-medium text-gray-900 dark:text-white">加载失败</h3>
					<p class="mt-1 text-gray-600 dark:text-gray-400">{loadError}</p>
					<button 
						onclick={loadProject} 
						class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						重试
					</button>
				</div>
			</div>
		</div>
	{:else}
		<!-- 导出设置 -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">导出项目</h2>
			
			<!-- 项目信息 -->
			<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
				<h3 class="font-medium text-gray-900 dark:text-white mb-2">项目信息</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-600 dark:text-gray-400">项目名称：</span>
						<span class="text-gray-900 dark:text-white">{project.name}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600 dark:text-gray-400">项目类型：</span>
						<span class="text-gray-900 dark:text-white">{project.type}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600 dark:text-gray-400">项目描述：</span>
						<span class="text-gray-900 dark:text-white truncate">{project.description}</span>
					</div>
				</div>
			</div>

			<!-- 导出格式选择 -->
			<div class="mb-6">
				<h3 class="font-medium text-gray-900 dark:text-white mb-3">选择导出格式</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<button 
							onclick={() => exportFormat = 'markdown'} 
							class={`p-4 border rounded-lg transition-colors ${exportFormat === 'markdown' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
						>
							<div class="flex items-center space-x-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<div>
									<h4 class="font-medium text-gray-900 dark:text-white">Markdown</h4>
									<p class="text-sm text-gray-500 dark:text-gray-400">支持格式化文本，适合在Markdown编辑器中查看</p>
								</div>
							</div>
						</button>
						<button 
							onclick={() => exportFormat = 'txt'} 
							class={`p-4 border rounded-lg transition-colors ${exportFormat === 'txt' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
						>
							<div class="flex items-center space-x-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<div>
									<h4 class="font-medium text-gray-900 dark:text-white">纯文本 (TXT)</h4>
									<p class="text-sm text-gray-500 dark:text-gray-400">纯文本格式，适合在任何文本编辑器中查看</p>
								</div>
							</div>
						</button>
						<button 
							onclick={() => exportFormat = 'pdf'} 
							class={`p-4 border rounded-lg transition-colors ${exportFormat === 'pdf' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
						>
							<div class="flex items-center space-x-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<div>
									<h4 class="font-medium text-gray-900 dark:text-white">PDF</h4>
									<p class="text-sm text-gray-500 dark:text-gray-400">PDF格式，适合打印和阅读</p>
								</div>
							</div>
						</button>
						<button 
							onclick={() => exportFormat = 'epub'} 
							class={`p-4 border rounded-lg transition-colors ${exportFormat === 'epub' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
						>
							<div class="flex items-center space-x-3">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<div>
									<h4 class="font-medium text-gray-900 dark:text-white">EPUB</h4>
									<p class="text-sm text-gray-500 dark:text-gray-400">EPUB格式，适合电子书阅读器</p>
								</div>
							</div>
						</button>
					</div>
			</div>

			<!-- 导出按钮 -->
			<div class="flex justify-center">
				<button 
					onclick={handleExport} 
					disabled={isExporting} 
					class="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
				>
					{#if isExporting}
						<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						导出中...
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						开始导出
					{/if}
				</button>
			</div>
		</div>

		<!-- 导出说明 -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
			<h3 class="font-medium text-gray-900 dark:text-white mb-3">导出说明</h3>
			<ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-5">
						<li>导出文件将包含项目的所有信息，包括项目信息、内容和章节</li>
						<li>纯文本格式适合在普通文本编辑器中查看</li>
						<li>PDF 格式适合打印和在PDF阅读器中查看</li>
						<li>EPUB 格式适合在电子书阅读器中查看</li>
						<li>导出的文件将自动下载到您的设备</li>
					</ul>
		</div>
	{/if}
</div>