<script lang="ts">
	import { page } from '$app/stores';
	import { getProjectById, getProjectMembers, inviteProjectMember, updateMemberRole, removeProjectMember, type ProjectMember } from '$lib/utils/project';

	const projectId = $page.params.id;
	const safeProjectId = projectId || 'default';

	// 项目数据
	let project = $state({
		id: safeProjectId,
		name: '加载中...',
		type: '未知类型',
		description: '正在加载项目数据...'
	});

	// 成员列表
	let members = $state<ProjectMember[]>([]);

	// 加载状态
	let isLoading = $state(true);
	let loadError = $state<string | null>(null);

	// 邀请成员的表单数据
	let inviteForm = $state({
		email: '',
		role: 'editor' as 'owner' | 'editor' | 'viewer'
	});

	// 邀请成员的状态
	let isInviting = $state(false);
	let inviteError = $state<string | null>(null);

	// 更新成员角色的状态
	let isUpdatingRole = $state(false);
	let updateRoleError = $state<string | null>(null);

	// 移除成员的状态
	let isRemovingMember = $state(false);
	let removeMemberError = $state<string | null>(null);

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

	// 加载成员列表
	async function loadMembers() {
		isLoading = true;
		loadError = null;
		try {
			const data = await getProjectMembers(safeProjectId);
			members = data;
		} catch (error) {
			loadError = '加载成员列表失败，请重试';
			console.error('Error loading members:', error);
		} finally {
			isLoading = false;
		}
	}

	// 邀请成员
	async function handleInviteMember() {
		if (!inviteForm.email.trim()) {
			inviteError = '请填写邮箱地址';
			return;
		}

		isInviting = true;
		inviteError = null;
		try {
			const result = await inviteProjectMember(safeProjectId, inviteForm.email.trim(), inviteForm.role);
			if (result) {
				// 重置表单
				inviteForm = {
					email: '',
					role: 'editor'
				};
				// 重新加载成员列表
				await loadMembers();
			} else {
				inviteError = '邀请成员失败，请重试';
			}
		} catch (error) {
			inviteError = error instanceof Error ? error.message : '邀请成员失败，请重试';
			console.error('Error inviting member:', error);
		} finally {
			isInviting = false;
		}
	}

	// 更新成员角色
	async function handleUpdateRole(memberId: string, role: 'owner' | 'editor' | 'viewer') {
		isUpdatingRole = true;
		updateRoleError = null;
		try {
			const result = await updateMemberRole(safeProjectId, memberId, role);
			if (result) {
				// 重新加载成员列表
				await loadMembers();
			} else {
				updateRoleError = '更新角色失败，请重试';
			}
		} catch (error) {
			updateRoleError = error instanceof Error ? error.message : '更新角色失败，请重试';
			console.error('Error updating role:', error);
		} finally {
			isUpdatingRole = false;
		}
	}

	// 移除成员
	async function handleRemoveMember(memberId: string) {
		if (!confirm('确定要移除这个成员吗？')) {
			return;
		}

		isRemovingMember = true;
		removeMemberError = null;
		try {
			const result = await removeProjectMember(safeProjectId, memberId);
			if (result) {
				// 重新加载成员列表
				await loadMembers();
			} else {
				removeMemberError = '移除成员失败，请重试';
			}
		} catch (error) {
			removeMemberError = error instanceof Error ? error.message : '移除成员失败，请重试';
			console.error('Error removing member:', error);
		} finally {
			isRemovingMember = false;
		}
	}

	// 初始化加载数据
	async function init() {
		await loadProject();
		await loadMembers();
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
			<a href={`/project/${projectId}/versions`} class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
				版本控制
			</a>
			<a href={`/project/${projectId}/collaboration`} class="px-4 py-2 rounded-md bg-blue-500 text-white font-medium">
				协作管理
			</a>
		</div>
	</div>

	<!-- 页面标题 -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">协作管理</h1>
		<p class="text-gray-600 dark:text-gray-400">邀请其他用户参与项目协作，管理成员角色和权限</p>
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

	<!-- 邀请成员 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">邀请成员</h2>
		{#if inviteError}
			<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
				<p>{inviteError}</p>
			</div>
		{/if}
		<form onsubmit={e => { e.preventDefault(); handleInviteMember(); }} class="space-y-4">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱地址</label>
					<input
						type="email"
						id="email"
						bind:value={inviteForm.email}
						placeholder="输入要邀请的用户邮箱"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
					/>
				</div>
				<div>
					<label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">角色</label>
					<select
						id="role"
						bind:value={inviteForm.role}
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
					>
						<option value="owner">所有者</option>
						<option value="editor">编辑者</option>
						<option value="viewer">查看者</option>
					</select>
				</div>
			</div>
			<button
				type="submit"
				disabled={isInviting}
				class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
			>
				{#if isInviting}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					邀请中...
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					邀请成员
				{/if}
			</button>
		</form>
	</div>

	<!-- 成员列表 -->
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
		<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">成员列表</h2>
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
		{:else if members.length === 0}
			<div class="text-center py-8">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
				<p class="mt-2 text-gray-500 dark:text-gray-400">还没有邀请任何成员</p>
				<p class="mt-1 text-sm text-gray-400 dark:text-gray-500">邀请其他用户参与项目协作</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each members as member}
					<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
						<div class="flex justify-between items-start mb-3">
							<div class="flex items-center space-x-3">
								<div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
									{member.user.username.charAt(0).toUpperCase()}
								</div>
								<div>
									<h3 class="font-medium text-gray-900 dark:text-white">{member.user.username}</h3>
									<p class="text-sm text-gray-500 dark:text-gray-400">{member.user.email}</p>
								</div>
							</div>
							<div class="flex flex-col items-end">
								<div class="mb-2">
									<select
										value={member.role}
										onchange={(e) => {
                                    const target = e.target as HTMLSelectElement;
                                    handleUpdateRole(member.id, target.value as 'owner' | 'editor' | 'viewer');
                                }}
										disabled={isUpdatingRole || member.role === 'owner'}
										class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
									>
										<option value="owner">所有者</option>
										<option value="editor">编辑者</option>
										<option value="viewer">查看者</option>
									</select>
								</div>
								<p class="text-xs text-gray-500 dark:text-gray-400">加入于: {new Date(member.created_at).toLocaleString()}</p>
							</div>
						</div>
						{#if member.role !== 'owner'}
							<div class="flex justify-end">
								<button
									onclick={() => handleRemoveMember(member.id)}
									disabled={isRemovingMember}
									class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
								>
									{#if isRemovingMember}
										移除中...
									{:else}
										移除
									{/if}
								</button>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>