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

			// 模拟AI回复
			isLoading = true;
			await simulateAIResponse(userMessage.content);
			isLoading = false;
		}
	}

	// 模拟AI回复
	async function simulateAIResponse(userInput: string) {
		// 模拟网络延迟
		await new Promise(resolve => setTimeout(resolve, 1500));

		// 简单的回复逻辑
		let responseContent = '';

		if (userInput.includes('奇幻') || userInput.includes('勇者') || userInput.includes('世界')) {
			responseContent = '这是一个很棒的主题！让我帮你构思一下：\n\n1. 世界观：中世纪奇幻世界，存在魔法和各种种族\n2. 主角：年轻的勇者，拥有特殊的魔法天赋\n3. 情节：勇者需要收集五颗宝石来拯救世界\n4. 反派：邪恶的黑龙，想要毁灭世界\n\n你觉得这个设定怎么样？';
		} else if (userInput.includes('科幻') || userInput.includes('未来')) {
			responseContent = '科幻题材很有潜力！考虑以下设定：\n\n1. 世界观：2150年的未来世界，人类已经殖民火星\n2. 主角：年轻的科学家，发现了一个神秘的外星信号\n3. 情节：主角必须解开信号的秘密，拯救人类文明\n4. 反派：一个试图控制信号的邪恶组织\n\n你想深入探索哪个方面？';
		} else if (userInput.includes('帮助') || userInput.includes('怎么写')) {
			responseContent = '写作技巧建议：\n\n1. 设定清晰的世界观和人物动机\n2. 创造有冲突的情节\n3. 注重细节描写，让读者有代入感\n4. 保持情节的连贯性和逻辑性\n5. 定期修改和完善你的作品\n\n你需要具体哪方面的帮助？';
		} else if (userInput.includes('爱情') || userInput.includes('感情')) {
			responseContent = '爱情故事是永恒的主题！考虑以下元素：\n\n1. 角色设定：性格互补的男女主角\n2. 相遇场景：独特而自然的初次相遇\n3. 冲突：来自外界或内心的阻碍\n4. 发展：情感的递进和变化\n5. 结局：符合故事基调的收尾\n\n你想写什么样的爱情故事？';
		} else if (userInput.includes('恐怖') || userInput.includes('悬疑')) {
			responseContent = '恐怖悬疑题材需要营造紧张氛围：\n\n1. 场景设定：封闭或孤立的环境\n2. 谜团：逐步揭示的秘密\n3. 氛围：通过细节描写制造紧张感\n4. 转折：出人意料的情节发展\n5. 结局：合理且令人回味的解答\n\n你想探索什么类型的恐怖悬疑故事？';
		} else if (userInput.includes('历史') || userInput.includes('古代')) {
			responseContent = '历史题材需要真实感和想象力的结合：\n\n1. 时代背景：详细的历史时期设定\n2. 人物：真实或虚构的历史人物\n3. 事件：基于历史事件的改编或创造\n4. 细节：符合时代特征的生活描写\n5. 主题：通过历史反映现实\n\n你对哪个历史时期感兴趣？';
		} else if (userInput.includes('开头') || userInput.includes('开始')) {
			responseContent = '一个好的开头能吸引读者：\n\n1. 引人入胜的场景描写\n2. 神秘的事件或问题\n3. 主角的独特之处\n4. 暗示故事的核心冲突\n5. 营造适合故事基调的氛围\n\n你希望开头呈现什么样的效果？';
		} else if (userInput.includes('结尾') || userInput.includes('结局')) {
			responseContent = '一个好的结尾能让读者回味无穷：\n\n1. 解决主要冲突\n2. 角色的成长或变化\n3. 留给读者思考的空间\n4. 呼应开头的元素\n5. 符合故事整体风格\n\n你希望结局是圆满的还是开放式的？';
		} else {
			responseContent = '谢谢你的分享！我很喜欢这个想法。你可以告诉我更多关于你的故事设定，比如世界观、人物或者情节，我会给你提供更具体的建议。';
		}

		// 添加AI回复
		const aiMessage: Message = {
			id: (Date.now() + 1).toString(),
			sender: 'agent',
			content: responseContent,
			time: getCurrentTime()
		};
		messages = [...messages, aiMessage];
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
