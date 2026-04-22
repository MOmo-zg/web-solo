import { test, expect } from '@playwright/test';

test.describe('Main Application', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('http://localhost:5176');
    await expect(page.locator('h1')).toContainText('小说创作助手');
  });

  test('should have login button', async ({ page }) => {
    await page.goto('http://localhost:5176');
    await expect(page.locator('text=登录')).toBeVisible();
  });

  test('should have register button', async ({ page }) => {
    await page.goto('http://localhost:5176');
    await expect(page.locator('text=注册')).toBeVisible();
  });

  test('should have new task button', async ({ page }) => {
    await page.goto('http://localhost:5176');
    await expect(page.locator('text=New task')).toBeVisible();
  });

  test('should have novels section', async ({ page }) => {
    await page.goto('http://localhost:5176');
    await expect(page.locator('text=Novels')).toBeVisible();
  });

  test('should have AI chat interface', async ({ page }) => {
    await page.goto('http://localhost:5176');
    await expect(page.locator('.flex-1.overflow-y-auto.p-4.space-y-4')).toBeVisible();
    await expect(page.locator('textarea[placeholder="输入你的创作需求，如：帮我构思一个奇幻小说的开头"]')).toBeVisible();
    await expect(page.locator('button.bg-green-500')).toBeVisible();
  });
});
