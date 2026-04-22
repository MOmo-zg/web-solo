<script lang="ts">
	import { Component } from 'svelte';
	
	// 懒加载 AgentChat 组件
	let AgentChatComponent: Component | null = $state(null);
	let isLoading = $state(true);
	
	async function loadAgentChat() {
		try {
			const module = await import('$lib/components/AgentChat.svelte');
			AgentChatComponent = module.default;
		} catch (error) {
			console.error('加载 AgentChat 组件失败:', error);
		} finally {
			isLoading = false;
		}
	}
	
	// 组件挂载时加载 AgentChat
	loadAgentChat();
</script>

<!-- Agent聊天对话 -->
<div class="h-full w-full">
	{#if isLoading}
		<div class="flex items-center justify-center h-full">
			<div class="flex space-x-2">
				<div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
				<div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
				<div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
			</div>
		</div>
	{:else if AgentChatComponent}
		<AgentChatComponent />
	{:else}
		<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
			加载聊天组件失败，请刷新页面重试
		</div>
	{/if}
</div>