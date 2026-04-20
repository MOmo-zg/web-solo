<script lang="ts">
	import { page } from '$app/stores';

	const projectId = $page.params.id;
	
	// 模拟项目数据
	const project = {
		id: projectId,
		name: '奇幻冒险小说',
		type: '奇幻',
		description: '一个关于勇者拯救世界的故事',
		content: '很久很久以前，在一个遥远的国度，有一个勇敢的少年...'
	};

	// 代理配置
	let style = $state('奇幻');
	let language = $state('中文');
	let maxLength = $state(500);

	// 规则设置
	let rules = $state([
		'世界观：中世纪奇幻世界，存在魔法和各种种族',
		'主角：年轻的勇者，拥有特殊的魔法天赋',
		'情节：勇者需要收集五颗宝石来拯救世界'
	]);
	let newRule = $state('');

	// 技能选择
	const availableSkills = [
		{ id: '1', name: '对话生成', description: '生成自然的人物对话' },
		{ id: '2', name: '场景描述', description: '生成详细的场景描写' },
		{ id: '3', name: '人物塑造', description: '丰富人物性格和背景' },
		{ id: '4', name: '情节设计', description: '设计引人入胜的情节' },
		{ id: '5', name: '世界观构建', description: '构建完整的世界观' }
	];
	let selectedSkills = $state(['1', '2', '3']);

	// 内容生成
	let generatedContent = $state(project.content);
	let isGenerating = $state(false);

	function addRule() {
		if (newRule.trim()) {
			rules = [...rules, newRule.trim()];
			newRule = '';
		}
	}

	function removeRule(index: number) {
		rules = rules.filter((_, i) => i !== index);
	}

	function toggleSkill(skillId: string) {
		if (selectedSkills.includes(skillId)) {
			selectedSkills = selectedSkills.filter(id => id !== skillId);
		} else {
			selectedSkills = [...selectedSkills, skillId];
		}
	}

	async function generateContent() {
		isGenerating = true;
		// 模拟生成过程
		await new Promise(resolve => setTimeout(resolve, 2000));
		generatedContent = '很久很久以前，在一个遥远的国度，有一个勇敢的少年。他名叫亚瑟，从小就梦想成为一名伟大的勇者。一天，他收到了一封来自王国首都的信，信中说邪恶的黑龙正在威胁整个世界，只有收集五颗分散在各地的魔法宝石，才能打败黑龙...';
		isGenerating = false;
	}

	function saveContent() {
		// 这里应该调用 API 保存内容
		alert('内容已保存');
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
				<button class="flex items-center space-x-1 hover:text-[#ffd700] transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
					<span>退出登录</span>
				</button>
			</div>
		</div>
	</nav>

	<!-- 项目标题栏 -->
	<div class="bg-white shadow-sm border-b border-gray-200">
		<div class="container mx-auto px-4 py-4">
			<div class="flex justify-between items-center">
				<div>
					<h1 class="text-2xl font-bold text-gray-800">{project.name}</h1>
					<p class="text-gray-600">{project.type} • ID: {project.id}</p>
				</div>
				<div class="flex space-x-2">
					<a href={`/project/${projectId}/settings`} class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
						设置
					</a>
					<a href={`/project/${projectId}/versions`} class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
						版本
					</a>
					<a href={`/project/${projectId}/export`} class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
						导出
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- 主要内容 -->
	<div class="container mx-auto px-4 py-8">
		<div class="flex flex-col lg:flex-row gap-6">
			<!-- 左侧配置面板 -->
			<div class="lg:w-1/3 space-y-6">
				<!-- 代理配置 -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<h2 class="text-lg font-semibold text-gray-800 mb-4">代理配置</h2>
					
					<div class="mb-4">
						<label for="style" class="block text-sm font-medium text-gray-700 mb-2">创作风格</label>
						<select id="style" bind:value={style} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e]">
							<option value="奇幻">奇幻</option>
							<option value="言情">言情</option>
							<option value="科幻">科幻</option>
							<option value="悬疑">悬疑</option>
						</select>
					</div>
					
					<div class="mb-4">
						<label for="language" class="block text-sm font-medium text-gray-700 mb-2">语言类型</label>
						<select id="language" bind:value={language} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e]">
							<option value="中文">中文</option>
							<option value="英文">英文</option>
						</select>
					</div>
					
					<div class="mb-4">
						<label for="maxLength" class="block text-sm font-medium text-gray-700 mb-2">内容长度: {maxLength} 字</label>
						<input id="maxLength" type="range" min="100" max="2000" step="100" bind:value={maxLength} class="w-full" />
					</div>
				</div>

				<!-- 规则设置 -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<h2 class="text-lg font-semibold text-gray-800 mb-4">规则设置</h2>
					
					<div class="space-y-2 mb-4">
						{#each rules as rule, index}
							<div class="flex items-center justify-between p-2 bg-gray-50 rounded">
							<span>{rule}</span>
							<button onclick={() => removeRule(index)} class="text-red-500 hover:text-red-700" aria-label="删除规则">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>
						{/each}
					</div>
					
					<div class="flex">
						<input type="text" bind:value={newRule} placeholder="添加规则..." class="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e]" />
						<button onclick={addRule} class="bg-[#1a237e] text-white px-4 py-2 rounded-r-lg hover:bg-[#283593] transition-colors">
							添加
						</button>
					</div>
				</div>

				<!-- 技能选择 -->
				<div class="bg-white rounded-lg shadow-md p-6">
					<h2 class="text-lg font-semibold text-gray-800 mb-4">技能选择</h2>
					
					<div class="grid grid-cols-1 gap-2">
						{#each availableSkills as skill}
							<button type="button" onclick={() => toggleSkill(skill.id)} class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors w-full text-left {selectedSkills.includes(skill.id) ? 'bg-[#e8eaf6] border-[#1a237e]' : 'hover:bg-gray-50'}">
								<div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a237e] text-white mr-3">
									{selectedSkills.includes(skill.id) ? '✓' : ''}
								</div>
								<div>
									<h3 class="font-medium">{skill.name}</h3>
									<p class="text-sm text-gray-600">{skill.description}</p>
								</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- 生成按钮 -->
				<button onclick={generateContent} disabled={isGenerating} class="w-full bg-[#ffd700] text-[#1a237e] px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center space-x-2">
					{#if isGenerating}
						<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-[#1a237e]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						生成中...
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
						生成内容
					{/if}
				</button>
			</div>

			<!-- 右侧内容区域 -->
			<div class="lg:w-2/3">
				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-lg font-semibold text-gray-800">小说内容</h2>
						<button onclick={saveContent} class="bg-[#1a237e] text-white px-4 py-2 rounded-lg hover:bg-[#283593] transition-colors">
						保存
					</button>
					</div>
					
					<textarea bind:value={generatedContent} rows={20} class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a237e] focus:border-[#1a237e] font-serif text-lg" placeholder="小说内容将在这里生成..."></textarea>
				</div>
			</div>
		</div>
	</div>
</div>