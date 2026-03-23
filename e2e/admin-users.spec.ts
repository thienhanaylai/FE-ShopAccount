import { test, expect, Page } from '@playwright/test';

async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  if (page.url().endsWith('/')) {
    return;
  }

  await expect(page.locator('form')).toBeVisible();
  await page.fill('input[type="email"]', 'admin@shopaccount.local');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
}

test.describe('Admin Users Management', () => {
  async function openUsersPage(page: Page) {
    await loginAsAdmin(page);
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.getByRole('heading', { name: 'Quản lý người dùng' })).toBeVisible();
  }

  async function ensureUsersRows(page: Page) {
    const rows = page.locator('tbody tr').filter({ has: page.locator('button[title="Xem chi tiết"]') });
    const rowCount = await rows.count();
    test.skip(rowCount === 0, 'Không có dữ liệu user để test thao tác modal.');
  }

  async function getNonAdminRow(page: Page) {
    const rows = page.locator('tbody tr').filter({ has: page.locator('button[title="Xem chi tiết"]') });
    const count = await rows.count();

    for (let index = 0; index < count; index += 1) {
      const row = rows.nth(index);
      const text = (await row.innerText()).toLowerCase();
      if (!text.includes('admin@shopaccount.local')) {
        return row;
      }
    }

    return rows.first();
  }

  test('Can open users page and see table data', async ({ page }) => {
    await openUsersPage(page);

    const usersTable = page.locator('table');
    const errorBanner = page.getByText('Tài khoản hiện tại không có quyền ADMIN để xem danh sách người dùng.');

    await expect(usersTable.or(errorBanner)).toBeVisible();
  });

  test('Can filter/search users UI without crash', async ({ page }) => {
    await openUsersPage(page);

    const searchInput = page.getByPlaceholder('Tìm kiếm theo tên, email...');
    await searchInput.fill('admin');
    await page.getByRole('button', { name: 'Tìm' }).click();

    await expect(page.getByRole('heading', { name: 'Quản lý người dùng' })).toBeVisible();

    await page.locator('select').filter({ has: page.locator('option[value="BLOCKED"]') }).selectOption('BLOCKED');
    await expect(page.getByRole('heading', { name: 'Quản lý người dùng' })).toBeVisible();
  });

  test('Can open and close user detail modal', async ({ page }) => {
    await openUsersPage(page);
    await ensureUsersRows(page);

    await page.locator('button[title="Xem chi tiết"]').first().click();
    await expect(page.getByRole('heading', { name: 'Chi tiết người dùng' })).toBeVisible();
    await page.getByRole('button', { name: 'Đóng' }).click();
    await expect(page.getByRole('heading', { name: 'Chi tiết người dùng' })).not.toBeVisible();
  });

  test('Edit modal validates balance reason when adjusting wallet', async ({ page }) => {
    await openUsersPage(page);
    await ensureUsersRows(page);

    await page.locator('button[title="Chỉnh sửa"]').first().click();
    await expect(page.getByRole('heading', { name: 'Chỉnh sửa người dùng' })).toBeVisible();

    await page.getByPlaceholder('Ví dụ: 100000').fill('100000');
    await page.getByRole('button', { name: 'Lưu thay đổi' }).click();

    await expect(page.getByText('Vui lòng nhập lý do điều chỉnh số dư.')).toBeVisible();
    await page.getByRole('button', { name: 'Hủy' }).click();
  });

  test('Can open delete confirmation and cancel', async ({ page }) => {
    await openUsersPage(page);
    await ensureUsersRows(page);

    await page.locator('button[title="Xóa"]').first().click();
    await expect(page.getByRole('heading', { name: 'Xóa người dùng' })).toBeVisible();
    await page.getByRole('button', { name: 'Hủy' }).click();
    await expect(page.getByRole('heading', { name: 'Xóa người dùng' })).not.toBeVisible();
  });

  test('Edit user save success shows success dialog', async ({ page }) => {
    await openUsersPage(page);
    await ensureUsersRows(page);

    const row = await getNonAdminRow(page);
    await row.locator('button[title="Chỉnh sửa"]').click();
    await expect(page.getByRole('heading', { name: 'Chỉnh sửa người dùng' })).toBeVisible();

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Đã cập nhật người dùng!');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Lưu thay đổi' }).click();
    await expect(page.getByRole('heading', { name: 'Chỉnh sửa người dùng' })).not.toBeVisible();
  });

  test('Ban and unban user from detail modal', async ({ page }) => {
    let forcedStatus: 'ACTIVE' | 'BLOCKED' | null = null;

    await page.route('http://localhost:3000/users*', async (route) => {
      const response = await route.fetch();
      const contentType = response.headers()['content-type'] || '';

      if (!contentType.includes('application/json')) {
        await route.fulfill({ response });
        return;
      }

      const data = await response.json();

      if (forcedStatus && Array.isArray(data?.data)) {
        const targetUser = data.data.find(
          (item: { email?: string }) => item?.email !== 'admin@shopaccount.local',
        );
        if (targetUser) {
          targetUser.status = forcedStatus;
        }
      }

      await route.fulfill({ response, json: data });
    });

    await page.route('http://localhost:3000/users/*/admin-update', async (route) => {
      const body = route.request().postDataJSON() as { status?: 'ACTIVE' | 'BLOCKED' } | null;
      if (body?.status === 'BLOCKED' || body?.status === 'ACTIVE') {
        forcedStatus = body.status;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await openUsersPage(page);
    await ensureUsersRows(page);

    const row = await getNonAdminRow(page);
    await row.locator('button[title="Xem chi tiết"]').click();
    await expect(page.getByRole('heading', { name: 'Chi tiết người dùng' })).toBeVisible();

    const banButton = page.getByRole('button', { name: 'Khóa tài khoản' });
    const unbanButton = page.getByRole('button', { name: 'Mở khóa tài khoản' });

    if (await banButton.isVisible()) {
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Đã khóa tài khoản');
        await dialog.accept();
      });
      await banButton.click();

      await row.locator('button[title="Xem chi tiết"]').click();
      await expect(page.getByRole('heading', { name: 'Chi tiết người dùng' })).toBeVisible();
    }

    const canUnban = await unbanButton.isVisible();
    test.skip(!canUnban, 'Không tìm thấy trạng thái có thể mở khóa để hoàn tất kịch bản unban.');

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Đã mở khóa tài khoản');
      await dialog.accept();
    });
    await unbanButton.click();
  });
});
