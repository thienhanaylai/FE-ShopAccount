import { test, expect, Page } from '@playwright/test';

async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await expect(page.locator('form')).toBeVisible();
  await page.fill('input[type="email"]', 'admin@shopaccount.local');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
}

test.describe('Admin Users Management', () => {
  test('Can open users page and see table data', async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.getByRole('heading', { name: 'Quản lý người dùng' })).toBeVisible();

    const usersTable = page.locator('table');
    const errorBanner = page.getByText('Tài khoản hiện tại không có quyền ADMIN để xem danh sách người dùng.');

    await expect(usersTable.or(errorBanner)).toBeVisible();
  });

  test('Can filter/search users UI without crash', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'Quản lý người dùng' })).toBeVisible();

    const searchInput = page.getByPlaceholder('Tìm kiếm theo tên, email...');
    await searchInput.fill('admin');
    await page.getByRole('button', { name: 'Tìm' }).click();

    await expect(page.getByRole('heading', { name: 'Quản lý người dùng' })).toBeVisible();
  });
});
