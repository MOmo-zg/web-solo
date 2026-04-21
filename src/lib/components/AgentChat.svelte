<script lang="ts">
	import { onMount } from 'svelte';

	// 消息类型定义
	interface Message {
		id: string;
		sender: 'agent' | 'user';
		content: string;
		time: string;
	}

	// 检查是否在浏览器环境中
	function isBrowser() {
		return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
	}

	// 从本地存储加载消息
	function loadMessages(): Message[] {
		if (isBrowser()) {
			const storedMessages = localStorage.getItem('chatMessages');
			if (storedMessages) {
				return JSON.parse(storedMessages);
			}
		}
		// 默认消息
		return [
			{
				id: '1',
				sender: 'agent',
				content: '你好！我是你的小说创作助手。我可以帮你生成小说内容、提供创作建议，或者回答关于写作的问题。',
				time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
			}
		];
	}

	// 保存消息到本地存储
	function saveMessages(msg: Message[]) {
		if (isBrowser()) {
			localStorage.setItem('chatMessages', JSON.stringify(msg));
		}
	}

	// 消息历史
	let messages = $state<Message[]>(loadMessages());

	let newMessage = $state('');
	let modelMenuOpen = $state(false);
	let isLoading = $state(false);

	// 当消息变化时保存到本地存储
	$effect(() => {
		saveMessages(messages);
	});

	// 获取当前时间
	function getCurrentTime() {
		return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
	}

	// 发送消息
	async function sendMessage() {
		if (newMessage.trim()) {
			// 添加用户消息
			const userMessage: Message = {
				id: Date.now().toString(),
				sender: 'user',
				content: newMessage.trim(),
				time: getCurrentTime()
			};
			messages = [...messages, userMessage];
			newMessage = '';

			// 调用 AI 回复
			isLoading = true;
			await getAIResponse(userMessage.content);
			isLoading = false;
		}
	}

	// 调用后端 API 获取 AI 回复
	async function getAIResponse(userInput: string) {
		try {
			// 调用后端 API
			const response = await fetch('http://localhost:3001/api/ai/generate-content', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					prompt: userInput,
					options: {
						model: 'gpt-3.5-turbo',
						temperature: 0.7,
						maxTokens: 500
					}
				})
			});

			if (!response.ok) {
				throw new Error('API 请求失败');
			}

			const data = await response.json();
			const responseContent = data.content || '抱歉，我无法生成内容。请稍后再试。';

			// 添加AI回复
			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				sender: 'agent',
				content: responseContent,
				time: getCurrentTime()
			};
			messages = [...messages, aiMessage];
		} catch (error) {
			console.error('获取 AI 回复失败:', error);
			// 添加错误回复
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				sender: 'agent',
				content: '抱歉，我暂时无法响应。请稍后再试。',
				time: getCurrentTime()
			};
			messages = [...messages, errorMessage];
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="h-full flex flex-col">

	<!-- 聊天内容 -->
	<div class="flex-1 overflow-y-auto p-4 space-y-4">
		{#each messages as message}
			<div class={`flex ${message.sender === 'agent' ? 'justify-start' : 'justify-end'}`}>
				<div class={`max-w-[80%] ${message.sender === 'agent' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-500'} rounded-lg p-3`}>
					<p class="text-gray-900 dark:text-gray-200 whitespace-pre-line">{message.content}</p>
					<div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{message.time}</div>
				</div>
			</div>
		{/each}
		
		<!-- 加载状态 -->
		{#if isLoading}
			<div class="flex justify-start">
				<div class="max-w-[80%] bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
					<div class="flex space-x-2">
						<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
						<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
						<div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- 输入区域 -->
	<div class="border-t border-gray-200 dark:border-gray-700 p-4">
		<div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
			<!-- 输入框 -->
			<textarea
				bind:value={newMessage}
				placeholder="输入你的创作需求，如：帮我构思一个奇幻小说的开头"
				class="w-full bg-transparent text-gray-900 dark:text-gray-200 focus:outline-none mb-3 py-2 px-0 text-left resize-none align-top"
				onkeydown={handleKeyPress}
				rows={2}
			></textarea>
			
			<!-- 工具栏 -->
			<div class="flex items-center justify-between">
				<div class="flex space-x-2">
					<button class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1" aria-label="撤销">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
							</svg>
						</button>
						<button class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1" aria-label="设置">
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
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7 7" />
							</svg>
						</button>
						
						{#if modelMenuOpen}
							<div class="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 w-48 py-1">
								<button class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
									SOLO Auto Model
								</button>
								<button class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
									SOLO Creative Model
								</button>
								<button class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
									SOLO Pro Model
								</button>
							</div>
						{/if}
					</div>
					
					<button
						onclick={sendMessage}
						class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
						aria-label="发送消息"
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
