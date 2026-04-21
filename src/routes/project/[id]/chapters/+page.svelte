<script lang="ts">
	import { page } from '$app/stores';
	import { getProjectById, addChapter, updateChapter, deleteChapter, reorderChapters, type Chapter } from '$lib/utils/project';

	const projectId = $page.params.id;
	const safeProjectId = projectId || 'default';
	const project = getProjectById(safeProjectId) || {
		id: safeProjectId,
		name: '未知项目',
		chapters: []
	};

	// 章节列表
	let chapters = $state<Chapter[]>(project.chapters || []);

	// 编辑状态
	let isAddingChapter = $state(false);
	let newChapterTitle = $state('');
	let newChapterContent = $state('');
	let editingChapter: Chapter | null = $state(null);
	let editTitle = $state('');
	let editContent = $state('');

	// 刷新章节列表
	function refreshChapters() {
		const updatedProject = getProjectById(safeProjectId);
		if (updatedProject) {
			chapters = updatedProject.chapters || [];
		}
	}

	// 打开添加章节表单
	function openAddChapterForm() {
		isAddingChapter = true;
		newChapterTitle = '';
		newChapterContent = '';
	}

	// 关闭添加章节表单
	function closeAddChapterForm() {
		isAddingChapter = false;
	}

	// 添加章节
	function handleAddChapter() {
		if (newChapterTitle.trim()) {
				addChapter(safeProjectId, {
					title: newChapterTitle.trim(),
					content: newChapterContent.trim()
				});
			refreshChapters();
			closeAddChapterForm();
		}
	}

	// 打开编辑章节表单
	function openEditChapterForm(chapter: Chapter) {
		editingChapter = chapter;
		editTitle = chapter.title;
		editContent = chapter.content;
	}

	// 关闭编辑章节表单
	function closeEditChapterForm() {
		editingChapter = null;
	}

	// 保存章节编辑
	function handleSaveChapter() {
		if (editingChapter && editTitle.trim()) {
				updateChapter(safeProjectId, editingChapter.id, {
					title: editTitle.trim(),
					content: editContent.trim()
				});
			refreshChapters();
			closeEditChapterForm();
		}
	}

	// 删除章节
	function handleDeleteChapter(chapterId: string) {
		if (confirm('确定要删除这个章节吗？')) {
				deleteChapter(safeProjectId, chapterId);
				refreshChapters();
		}
	}

	// 章节排序
	let draggedChapter: Chapter | null = $state(null);

	function onDragStart(chapter: Chapter) {
		draggedChapter = chapter;
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function onDrop(targetChapter: Chapter) {
		if (draggedChapter && draggedChapter.id !== targetChapter.id) {
			// 重新排序章节
			const newOrder = chapters.map(c => c.id);
			const draggedIndex = newOrder.indexOf(draggedChapter.id);
			const targetIndex = newOrder.indexOf(targetChapter.id);

			newOrder.splice(draggedIndex, 1);
			newOrder.splice(targetIndex, 0, draggedChapter.id);

			reorderChapters(safeProjectId, newOrder);
			refreshChapters();
		}
		draggedChapter = null;
	}
</script>

<div class="p-6 space-y-6">
	<!-- 项目导航 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
		<div class="flex space-x-4">
			<a href={`/project/${projectId}`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				编辑内容
			</a>
			<a href={`/project/${projectId}/chapters`} class="px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
				章节管理
			</a>
			<a href={`/project/${projectId}/export`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				导出项目
			</a>
		</div>
	</div>

	<!-- 页面标题 -->
	<div class="flex justify-between items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">章节管理</h1>
		<button 
			onclick={openAddChapterForm} 
			class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
			</svg>
			添加章节
		</button>
	</div>

	<!-- 章节列表 -->
	<div class="space-y-4">
		{#if chapters.length === 0}
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无章节</h3>
				<p class="text-gray-500 dark:text-gray-400">点击上方"添加章节"按钮开始创建章节</p>
			</div>
		{:else}
			{#each chapters as chapter}
				<div 
		draggable="true"
		{...{ dragstart: () => onDragStart(chapter), dragover: onDragOver, drop: () => onDrop(chapter) } as any}
		class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
	>
					<div class="flex justify-between items-start">
						<div class="flex items-center space-x-3">
							<div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
								{chapter.order + 1}
							</div>
							<div>
								<h3 class="font-medium text-gray-900 dark:text-white">{chapter.title}</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400">{chapter.content.length} 字 • {new Date(chapter.updated_at).toLocaleString()}</p>
							</div>
						</div>
						<div class="flex space-x-2">
							<button 
								onclick={() => openEditChapterForm(chapter)} 
								class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
								aria-label="编辑章节"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
								</svg>
							</button>
							<button 
								onclick={() => handleDeleteChapter(chapter.id)} 
								class="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
								aria-label="删除章节"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- 添加章节表单 -->
	{#if isAddingChapter}
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">添加新章节</h2>
			<div class="space-y-4">
				<div>
							<label for="newChapterTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">章节标题</label>
							<input 
								id="newChapterTitle"
								type="text" 
								bind:value={newChapterTitle} 
								class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
								placeholder="输入章节标题"
							/>
						</div>
						<div>
							<label for="newChapterContent" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">章节内容</label>
							<textarea 
								id="newChapterContent"
								bind:value={newChapterContent} 
								rows={6} 
								class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
								placeholder="输入章节内容"
							></textarea>
						</div>
				<div class="flex justify-end space-x-2">
					<button 
						onclick={closeAddChapterForm} 
						class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						取消
					</button>
					<button 
						onclick={handleAddChapter} 
						class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						添加
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- 编辑章节表单 -->
	{#if editingChapter}
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">编辑章节</h2>
			<div class="space-y-4">
				<div>
							<label for="editTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">章节标题</label>
							<input 
								id="editTitle"
								type="text" 
								bind:value={editTitle} 
								class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
								placeholder="输入章节标题"
							/>
						</div>
						<div>
							<label for="editContent" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">章节内容</label>
							<textarea 
								id="editContent"
								bind:value={editContent} 
								rows={6} 
								class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
								placeholder="输入章节内容"
							></textarea>
						</div>
				<div class="flex justify-end space-x-2">
					<button 
						onclick={closeEditChapterForm} 
						class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						取消
					</button>
					<button 
						onclick={handleSaveChapter} 
						class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						保存
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>