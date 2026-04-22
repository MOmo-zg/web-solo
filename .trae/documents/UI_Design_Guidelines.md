# UI 设计指南

## 1. 核心设计原则

### 1.1 一致性
- 所有可交互元素使用统一的视觉反馈模式
- 保持跨页面的设计一致性
- 遵循 Tailwind CSS 的设计系统

### 1.2 反馈性
- 所有可交互元素在悬停、点击时提供明确的视觉反馈
- 操作执行时提供加载状态反馈
- 操作完成后提供成功/失败反馈

## 2. 交互反馈规则

### 2.1 按钮反馈
- **默认状态**：清晰的背景色和文字对比
- **悬停状态**：背景色变深或变亮，添加轻微的阴影效果
- **点击状态**：背景色进一步变化，按钮轻微收缩
- **禁用状态**：降低透明度，鼠标指针变为禁用状态

### 2.2 链接反馈
- **默认状态**：蓝色文字，无下划线
- **悬停状态**：文字颜色变浅，添加下划线
- **点击状态**：文字颜色进一步变化

### 2.3 卡片反馈
- **默认状态**：轻微的边框和背景色
- **悬停状态**：边框颜色变化，添加轻微的阴影和上浮效果
- **点击状态**：轻微的收缩效果

### 2.4 表单元素反馈
- **默认状态**：清晰的边框和背景
- **聚焦状态**：边框颜色变化，添加轻微的发光效果
- **错误状态**：红色边框和错误提示
- **成功状态**：绿色边框和成功提示

### 2.5 导航元素反馈
- **默认状态**：标准文字颜色
- **悬停状态**：文字颜色变为主题色
- **激活状态**：背景色变化，文字颜色变为白色

## 3. 实现规范

### 3.1 按钮样式
```html
<!-- 主要按钮 -->
<button class="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:shadow-md transition-all duration-200 active:scale-95">
  按钮文字
</button>

<!-- 次要按钮 -->
<button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 hover:shadow-sm transition-all duration-200 active:scale-95">
  按钮文字
</button>

<!-- 禁用按钮 -->
<button class="bg-gray-300 text-gray-500 px-4 py-2 rounded-md font-medium cursor-not-allowed opacity-70">
  按钮文字
</button>
```

### 3.2 卡片样式
```html
<div class="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
  卡片内容
</div>
```

### 3.3 链接样式
```html
<a href="#" class="text-blue-600 hover:text-blue-400 hover:underline transition-colors duration-200">
  链接文字
</a>
```

### 3.4 表单输入样式
```html
<input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
```

### 3.5 导航项样式
```html
<a href="#" class="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
  导航项
</a>

<!-- 激活状态 -->
<a href="#" class="px-4 py-2 bg-blue-600 text-white rounded-md">
  导航项
</a>
```

## 4. 动画效果

### 4.1 过渡动画
- 使用 `transition-all duration-200` 为所有交互元素添加平滑过渡
- 对于更重要的元素，使用 `duration-300` 或 `duration-500`

### 4.2 微动画
- 卡片悬停时的上浮效果：`hover:-translate-y-1`
- 按钮点击时的缩放效果：`active:scale-95`
- 加载状态的旋转动画：`animate-spin`

### 4.3 状态变化
- 颜色变化：使用 `transition-colors`
- 阴影变化：使用 `transition-shadow`
- 变换效果：使用 `transition-transform`

## 5. 响应式设计

### 5.1 断点设计
- 移动端：< 640px
- 平板：640px - 1024px
- 桌面：> 1024px

### 5.2 交互调整
- 移动端：增大触摸目标，最小尺寸 44px
- 平板：适当调整间距和字体大小
- 桌面：保持标准交互元素尺寸

## 6. 无障碍性

### 6.1 键盘导航
- 所有可交互元素支持键盘导航
- 提供清晰的焦点状态

### 6.2 屏幕阅读器
- 为所有交互元素添加适当的 `aria-*` 属性
- 确保颜色对比度符合 WCAG AA 标准

### 6.3 鼠标与键盘
- 确保所有交互可以通过鼠标和键盘完成
- 为所有按钮和链接添加适当的 `aria-label`

## 7. 性能考虑

### 7.1 动画性能
- 使用 CSS transitions 而非 JavaScript 动画
- 优先使用 transform 和 opacity 属性
- 避免使用会触发重排的属性

### 7.2 加载优化
- 为大型交互元素添加适当的加载状态
- 实现渐进式交互反馈

## 8. 实施计划

1. **审计现有代码**：检查所有交互元素的反馈效果
2. **统一样式**：应用统一的反馈规则
3. **测试**：在不同设备和浏览器上测试交互效果
4. **文档**：更新开发文档，确保团队成员了解反馈规则
5. **维护**：定期审查和更新反馈规则

## 9. 示例实现

### 9.1 按钮示例
```svelte
<button 
  class="bg-blue-600 text-white px-6 py-2 rounded-md font-medium 
         hover:bg-blue-700 hover:shadow-md 
         transition-all duration-200 
         active:scale-95"
>
  点击我
</button>
```

### 9.2 卡片示例
```svelte
<div 
  class="bg-gray-800 border border-gray-700 rounded-md p-6 
         hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 
         transition-all duration-300"
>
  卡片内容
</div>
```

### 9.3 导航项示例
```svelte
<a 
  href="/" 
  class="flex items-center space-x-2 text-gray-300 
         hover:text-white 
         transition-colors duration-200"
>
  <svg><!-- 图标 --></svg>
  <span>导航项</span>
</a>
```

## 10. 结论

统一的 UI 反馈规则可以提高用户体验，使界面更加直观和专业。通过遵循本指南，我们可以确保所有交互元素都提供一致、清晰的视觉反馈，从而提升整体用户体验。