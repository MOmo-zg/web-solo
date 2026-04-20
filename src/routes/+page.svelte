<script lang="ts">
	import AgentChat from '$lib/components/AgentChat.svelte';
	import { getTheme, applyTheme, setupThemeListener } from '$lib/utils/theme';

	// 初始化主题
	applyTheme(getTheme());
	setupThemeListener();
</script>

<!-- Agent聊天对话 -->
<div class="h-full w-full">
	<AgentChat />
</div>