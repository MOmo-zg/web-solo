<script lang="ts">
	import { page } from '$app/stores';
	import { getProjectById, updateProject, type Project } from '$lib/utils/project';

	const projectId = $page.params.id;
	
	// 获取项目数据
	const safeProjectId = projectId || 'default';
	let project = $state<Project>({
		id: safeProjectId,
		name: '加载中...',
		type: '未知类型',
		description: '正在加载项目数据...',
		content: '',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
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
				projectName = data.name;
				projectType = data.type;
				projectDescription = data.description;
				projectContent = data.content || '';
			} else {
				loadError = '项目不存在';
				project = {
					id: safeProjectId,
					name: '未知项目',
					type: '未知类型',
					description: '项目不存在',
					content: '',
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				};
			}
		} catch (error) {
			loadError = '加载项目失败，请重试';
			console.error('Error loading project:', error);
		} finally {
			isLoading = false;
		}
	}

	// 编辑状态
	let projectName = $state(project.name);
	let projectType = $state(project.type);
	let projectDescription = $state(project.description);
	let projectContent = $state(project.content || '');
	let isSaving = $state(false);

	// 保存项目信息
	async function saveProject() {
		isSaving = true;
		try {
			// 更新项目信息
			await updateProject(safeProjectId, {
				name: projectName,
				type: projectType,
				description: projectDescription,
				content: projectContent
			});
			// 显示保存成功提示
			setTimeout(() => {
				isSaving = false;
				alert('项目保存成功！');
			}, 500);
		} catch (error) {
			isSaving = false;
			alert('保存失败，请重试');
			console.error('Error saving project:', error);
		}
	}

	// 初始化加载项目数据
	loadProject();

	// 模拟内容生成
	let isGenerating = $state(false);
	async function generateContent() {
		isGenerating = true;
		// 模拟生成过程
		await new Promise(resolve => setTimeout(resolve, 2000));
		projectContent += '\n\n很久很久以前，在一个遥远的国度，有一个勇敢的少年。他名叫亚瑟，从小就梦想成为一名伟大的勇者。一天，他收到了一封来自王国首都的信，信中说邪恶的黑龙正在威胁整个世界，只有收集五颗分散在各地的魔法宝石，才能打败黑龙...';
		isGenerating = false;
	}

	// 编辑工具函数
	function insertText(text: string) {
		const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
		if (textarea) {
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const selectedText = projectContent.substring(start, end);
			const newText = projectContent.substring(0, start) + text + projectContent.substring(end);
			projectContent = newText;
			// 聚焦并设置光标位置
			setTimeout(() => {
				textarea.focus();
				textarea.setSelectionRange(start + text.length, start + text.length);
			}, 0);
		}
	}

	function formatText(prefix: string, suffix: string) {
		const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
		if (textarea) {
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const selectedText = projectContent.substring(start, end);
			const newText = projectContent.substring(0, start) + prefix + selectedText + suffix + projectContent.substring(end);
			projectContent = newText;
			// 聚焦并设置光标位置
			setTimeout(() => {
				textarea.focus();
				textarea.setSelectionRange(start + prefix.length, end + prefix.length);
			}, 0);
		}
	}

	// 格式化工具
	function makeBold() {
		formatText('**', '**');
	}

	function makeItalic() {
		formatText('*', '*');
	}

	function makeUnderline() {
		formatText('<u>', '</u>');
	}

	function makeHeading(level: number) {
		insertText('\n' + '#'.repeat(level) + ' ');
	}

	function makeQuote() {
		insertText('\n> ');
	}

	function makeList(ordered: boolean) {
		insertText('\n' + (ordered ? '1. ' : '- '));
	}

	function insertLink() {
		const url = prompt('请输入链接地址:');
		const text = prompt('请输入链接文本:');
		if (url && text) {
			insertText(`[${text}](${url})`);
		}
	}

	function insertImage() {
		const url = prompt('请输入图片地址:');
		const alt = prompt('请输入图片描述:');
		if (url) {
			insertText(`![${alt || ''}](${url})`);
		}
	}

	function clearContent() {
		if (confirm('确定要清空内容吗？')) {
			projectContent = '';
		}
	}

	function copyContent() {
		navigator.clipboard.writeText(projectContent).then(() => {
			alert('内容已复制到剪贴板');
		});
	}

	function pasteContent() {
		navigator.clipboard.readText().then(text => {
			insertText(text);
		});
	}
</script>

<div class="p-6 space-y-6">
	<!-- 项目导航 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
		<div class="flex space-x-4">
			<a href={`/project/${projectId}`} class="px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
				编辑内容
			</a>
			<a href={`/project/${projectId}/chapters`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				章节管理
			</a>
			<a href={`/project/${projectId}/export`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				导出项目
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
		<!-- 项目信息编辑 -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">项目信息</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="projectName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目名称</label>
					<input 
						id="projectName"
						type="text" 
						bind:value={projectName} 
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 focus:scale-101"
						placeholder="输入项目名称"
					/>
				</div>
				<div>
					<label for="projectType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目类型</label>
					<select 
						id="projectType"
						bind:value={projectType} 
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 focus:scale-101"
					>
						<option value="奇幻">奇幻</option>
						<option value="科幻">科幻</option>
						<option value="现代">现代</option>
						<option value="武侠">武侠</option>
						<option value="历史">历史</option>
						<option value="爱情">爱情</option>
						<option value="悬疑">悬疑</option>
					</select>
				</div>
				<div class="md:col-span-2">
					<label for="projectDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">项目描述</label>
					<textarea 
						id="projectDescription"
						bind:value={projectDescription} 
						rows={3} 
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 focus:scale-101"
						placeholder="输入项目描述"
					></textarea>
				</div>
			</div>
		</div>

		<!-- 内容编辑区域 -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md">
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">小说内容</h2>
				<div class="flex gap-2">
					<button 
						onclick={generateContent} 
						disabled={isGenerating} 
						class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 active:scale-95"
					>
						{#if isGenerating}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							生成中...
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
							生成内容
						{/if}
					</button>
					<button 
						onclick={saveProject} 
						disabled={isSaving} 
						class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 active:scale-95"
					>
						{#if isSaving}
							<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							保存中...
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
							</svg>
							保存
						{/if}
					</button>
				</div>
			</div>

			<!-- 编辑工具栏 -->
			<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 mb-4 border border-gray-200 dark:border-gray-600">
				<div class="flex flex-wrap gap-2">
					<!-- 文本格式化 -->
					<button onclick={makeBold} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="加粗">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
						</svg>
					</button>
					<button onclick={makeItalic} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="斜体">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4h-9M14 14l-4-4m0 0l-4 4m4-4v12" />
						</svg>
					</button>
					<button onclick={makeUnderline} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="下划线">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h16M4 10h16M4 6h16" />
						</svg>
					</button>

					<!-- 段落格式 -->
					<div class="flex items-center space-x-1">
						<button onclick={() => makeHeading(1)} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="标题 1">
							<span class="font-bold text-lg">H1</span>
						</button>
						<button onclick={() => makeHeading(2)} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="标题 2">
							<span class="font-bold text-base">H2</span>
						</button>
						<button onclick={() => makeHeading(3)} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="标题 3">
							<span class="font-bold text-sm">H3</span>
						</button>
					</div>

					<!-- 列表和引用 -->
					<button onclick={() => makeList(false)} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="无序列表">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
						</svg>
					</button>
					<button onclick={() => makeList(true)} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="有序列表">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
						</svg>
					</button>
					<button onclick={makeQuote} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="引用">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</button>

					<!-- 链接和图片 -->
					<button onclick={insertLink} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="插入链接">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
						</svg>
					</button>
					<button onclick={insertImage} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="插入图片">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</button>

					<!-- 其他工具 -->
					<button onclick={copyContent} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="复制内容">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>
					</button>
					<button onclick={pasteContent} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="粘贴内容">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15h2a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</button>
					<button onclick={clearContent} class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="清空内容">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				</div>
			</div>

			<textarea 
				bind:value={projectContent} 
				rows={20} 
				class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-serif text-lg"
				placeholder="在这里开始编写你的小说..."
			></textarea>
			<div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
				{projectContent.length} 字
			</div>
		</div>

		<!-- 项目信息 -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-md">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">项目详情</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
				<div class="flex justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<span class="text-gray-600 dark:text-gray-400">项目ID：</span>
					<span class="text-gray-900 dark:text-white font-mono">{project.id}</span>
				</div>
				<div class="flex justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<span class="text-gray-600 dark:text-gray-400">创建时间：</span>
					<span class="text-gray-900 dark:text-white">{new Date(project.created_at).toLocaleString()}</span>
				</div>
				<div class="flex justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<span class="text-gray-600 dark:text-gray-400">更新时间：</span>
					<span class="text-gray-900 dark:text-white">{new Date(project.updated_at).toLocaleString()}</span>
				</div>
			</div>
		</div>
	{/if}
</div>