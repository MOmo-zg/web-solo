<script lang="ts">
	// 模拟对话数据
	const messages = [
		{
			id: '1',
			sender: 'agent',
			content: '你好！我是你的小说创作助手。我可以帮你生成小说内容、提供创作建议，或者回答关于写作的问题。',
			time: '17:46'
		},
		{
			id: '2',
			sender: 'user',
			content: '我想写一个奇幻小说，关于勇者拯救世界的故事',
			time: '17:47'
		},
		{
			id: '3',
			sender: 'agent',
			content: '这是一个很棒的主题！让我帮你构思一下：\n\n1. 世界观：中世纪奇幻世界，存在魔法和各种种族\n2. 主角：年轻的勇者，拥有特殊的魔法天赋\n3. 情节：勇者需要收集五颗宝石来拯救世界\n4. 反派：邪恶的黑龙，想要毁灭世界\n\n你觉得这个设定怎么样？',
			time: '17:48'
		}
	];

	let newMessage = $state('');
	let modelMenuOpen = $state(false);

	function sendMessage() {
		if (newMessage.trim()) {
			// 这里可以添加发送消息的逻辑
			newMessage = '';
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">

	<!-- 聊天内容 -->
	<div class="flex-1 overflow-y-auto p-4 space-y-4">
		{#each messages as message}
			<div class={`flex ${message.sender === 'agent' ? 'justify-start' : 'justify-end'}`}>
				<div class={`max-w-[80%] ${message.sender === 'agent' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-600'} rounded-lg p-3`}>
					<p class="text-gray-900 dark:text-gray-200">{message.content}</p>
					<div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{message.time}</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- 输入区域 -->
	<div class="border-t border-gray-200 dark:border-gray-700 p-4">
		<div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
			<!-- 输入框 -->
			<textarea
				bind:value={newMessage}
				placeholder="都发发顺丰"
				class="w-full bg-transparent text-gray-900 dark:text-gray-200 focus:outline-none mb-3 py-2 px-0 text-left resize-none align-top"
				onkeydown={handleKeyPress}
				rows={2}
			></textarea>
			
			<!-- 工具栏 -->
			<div class="flex items-center justify-between">
				<div class="flex space-x-2">
					<button class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
						</svg>
					</button>
					<button class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</button>
				</div>
				<div class="flex items-center space-x-3">
					<!-- 模型选择下拉列表 -->
					<div class="relative">
						<button onclick={() => modelMenuOpen = !modelMenuOpen} class="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
							<span>SOLO Auto Model</span>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						
						{#if modelMenuOpen}
							<div class="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 w-48">
								<div class="p-2 space-y-1">
									<button class="w-full text-left px-3 py-2 rounded-md text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
										SOLO Auto Model
									</button>
									<button class="w-full text-left px-3 py-2 rounded-md text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
										SOLO Creative Model
									</button>
									<button class="w-full text-left px-3 py-2 rounded-md text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
										SOLO Pro Model
									</button>
								</div>
							</div>
						{/if}
					</div>
					
					<button
						onclick={sendMessage}
						class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>