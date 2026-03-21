import { test, expect, Page } from '@playwright/test';

test.describe('Authentication Flow', () => {
  async function loginAsAdmin(page: Page) {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
    await page.fill('input[type="email"]', 'admin@shopaccount.local');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  }

  test('Login with valid credentials', async ({ page }) => {
    await loginAsAdmin(page);
    await page.screenshot({ path: 'screenshots/login-success.png' });
  });

  test('Register new account', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('form')).toBeVisible();
    const suffix = Date.now();
    const testEmail = `testuser_${suffix}@example.com`;
    await page.fill('#fullName', `TestUser_${suffix}`);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('#password', 'Password123');
    await page.fill('#confirmPassword', 'Password123');
    await page.check('#terms');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await page.screenshot({ path: 'screenshots/register-success.png' });
  });

  test('Forgot password flow', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('form')).toBeVisible();
    await page.fill('input[type="email"]', 'admin@shopaccount.local');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Kiểm tra email')).toBeVisible();
    await page.screenshot({ path: 'screenshots/forgot-password-success.png' });
  });

  test('Logout flow', async ({ page }) => {
    await loginAsAdmin(page);

    await page.getByRole('button', { name: /admin/i }).click();
    await page.getByRole('button', { name: 'Đăng xuất' }).click();

    await expect(page.getByRole('link', { name: 'Đăng nhập', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Đăng ký', exact: true })).toBeVisible();
  });

  test('Reset password invalid link should show friendly error', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.locator('form')).toBeVisible();

    await page.fill('#password', 'Password123!');
    await page.fill('#confirmPassword', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')).toBeVisible();
  });
});
