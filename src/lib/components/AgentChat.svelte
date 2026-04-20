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

	let newMessage = '';

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

<div class="bg-gray-800 rounded-lg border border-gray-700 h-full flex flex-col">
	<!-- 聊天头部 -->
	<div class="border-b border-gray-700 p-4">
		<h2 class="text-lg font-semibold text-blue-400">小说创作助手</h2>
		<p class="text-sm text-gray-400">随时为你提供创作灵感和建议</p>
	</div>

	<!-- 聊天内容 -->
	<div class="flex-1 overflow-y-auto p-4 space-y-4">
		{#each messages as message}
			<div class={`flex ${message.sender === 'agent' ? 'justify-start' : 'justify-end'}`}>
				<div class={`max-w-[80%] ${message.sender === 'agent' ? 'bg-gray-700' : 'bg-blue-600'} rounded-lg p-3`}>
					<p class="text-gray-200">{message.content}</p>
					<div class="text-xs text-gray-400 mt-1 text-right">{message.time}</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- 输入区域 -->
	<div class="border-t border-gray-700 p-4">
		<div class="flex space-x-2">
			<textarea
				bind:value={newMessage}
				placeholder="输入你的创作想法或问题..."
				class="flex-1 bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-blue-500"
				rows={2}
				onkeydown={handleKeyPress}
			></textarea>
			<button
				onclick={sendMessage}
				class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-end"
			>
				发送
			</button>
		</div>
	</div>
</div>