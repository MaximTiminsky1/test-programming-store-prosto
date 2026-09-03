import { expect, test } from "@playwright/test";

test.describe("Список постов", () => {
  test("рендерится на сервере и фильтруется через URL", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("list", { name: "Список постов" }).getByRole("listitem")).toHaveCount(3);

    await page.getByRole("searchbox", { name: "Поиск по постам" }).fill("Zod");
    await page.getByRole("button", { name: "Найти" }).click();

    await expect(page).toHaveURL(/\?q=Zod/);
    await expect(page.getByRole("listitem")).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Валидация на границах/ })).toBeVisible();

    await page.getByRole("link", { name: "Сбросить" }).click();
    await expect(page.getByRole("listitem")).toHaveCount(3);
  });

  test("показывает пустое состояние, когда ничего не найдено", async ({ page }) => {
    await page.goto("/?q=graphql");

    await expect(page.getByText("Ничего не найдено")).toBeVisible();
  });

  test("открывает страницу поста", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Поиск через URL/ }).click();

    await expect(page).toHaveURL(/\/posts\/3$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Поиск через URL");
  });

  test("отдаёт 404 для несуществующего поста", async ({ page }) => {
    const response = await page.goto("/posts/999");

    expect(response?.status()).toBe(404);
    await expect(page.getByText("Страница не найдена")).toBeVisible();
  });
});

test.describe("Создание поста", () => {
  test("валидирует форму на сервере и создаёт пост", async ({ page }) => {
    await page.goto("/posts/new");

    await page.getByRole("button", { name: "Создать пост" }).click();
    await expect(page.getByText("Заголовок должен содержать минимум 3 символа")).toBeVisible();
    await expect(page.getByText("Текст поста должен содержать минимум 10 символов")).toBeVisible();

    await page.getByLabel("Заголовок").fill("   ");
    await page.getByLabel("Текст поста").fill("Достаточно длинный текст поста.");
    await page.getByRole("button", { name: "Создать пост" }).click();
    await expect(page.getByText("Заголовок должен содержать минимум 3 символа")).toBeVisible();
    await expect(page.getByLabel("Текст поста")).toHaveValue("Достаточно длинный текст поста.");

    await page.getByLabel("Заголовок").fill("Пост из E2E-теста");
    await page.getByRole("button", { name: "Создать пост" }).click();

    await expect(page.getByRole("status")).toContainText("Пост создан (id: 101)");
    await expect(page.getByLabel("Заголовок")).toHaveValue("");
    await expect(page.getByLabel("Текст поста")).toHaveValue("");
  });
});
