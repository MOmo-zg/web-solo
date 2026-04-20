<script lang="ts">
	import { getTheme, setTheme } from '../utils/theme';
	import type { Theme } from '../utils/theme';
	import { getLanguage, setLanguage, getTranslations } from '../utils/i18n';
	import type { Language } from '../utils/i18n';

	let isOpen = false;
	let theme = getTheme();
	let language = getLanguage();
	const t = getTranslations();

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function changeTheme(newTheme: Theme) {
		setTheme(newTheme);
		theme = newTheme;
		isOpen = false;
	}

	function changeLanguage(newLanguage: Language) {
		setLanguage(newLanguage);
		language = newLanguage;
		// 重新加载页面以应用语言变更
		window.location.reload();
	}
</script>

<div class="relative">
	<button
		onclick={toggleDropdown}
		class="flex items-center space-x-1 hover:text-blue-400 transition-colors"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
		</svg>
		<span>Settings</span>
	</button>

	{#if isOpen}
		<div class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
			<div class="p-4">
				<h3 class="text-sm font-medium text-gray-300 mb-2">{t.theme}</h3>
				<div class="space-y-1">
					<button
						onclick={() => changeTheme('light')}
						class={`w-full text-left px-3 py-2 rounded-md text-sm ${theme === 'light' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
					>
						{t.light}
					</button>
					<button
						onclick={() => changeTheme('dark')}
						class={`w-full text-left px-3 py-2 rounded-md text-sm ${theme === 'dark' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
					>
						{t.dark}
					</button>
					<button
						onclick={() => changeTheme('system')}
						class={`w-full text-left px-3 py-2 rounded-md text-sm ${theme === 'system' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
					>
						{t.system}
					</button>
				</div>
				
				<div class="mt-4">
					<h3 class="text-sm font-medium text-gray-300 mb-2">{t.language}</h3>
					<div class="space-y-1">
						<button
							onclick={() => changeLanguage('zh')}
							class={`w-full text-left px-3 py-2 rounded-md text-sm ${language === 'zh' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
						>
							{t.chinese}
						</button>
						<button
							onclick={() => changeLanguage('en')}
							class={`w-full text-left px-3 py-2 rounded-md text-sm ${language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
						>
							{t.english}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>