import { test, expect } from "@playwright/test";

// Mobil açılır menü native <details>/<summary> ile çalışır (bkz.
// src/components/layout/CategoryNav.tsx yorumu): açma/kapama JavaScript'e
// bağlı değildir. Bu testler tam olarak bildirilen hatayı kilitler: aç,
// Escape ile kapat, dışarı tıklayınca kapat -- ve ayrıca JS tamamen devre
// dışıyken bile açılabildiğini doğrular (kök nedenin hydration/JS zamanlaması
// olabileceği ihtimaline karşı en güçlü garanti).
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});

const TOGGLE = 'summary[aria-controls="kategori-listesi"]';
const LIST = "#kategori-listesi";

test.describe("Mobil kategori menüsü (≤800px)", () => {
  test("düğmeye tıklayınca açılır", async ({ page }) => {
    await page.goto("/tr");

    await expect(page.locator(LIST)).toBeHidden();
    await page.locator(TOGGLE).click();
    await expect(page.locator(LIST)).toBeVisible();
  });

  test("Escape ile kapanır", async ({ page }) => {
    await page.goto("/tr");

    await page.locator(TOGGLE).click();
    await expect(page.locator(LIST)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator(LIST)).toBeHidden();
  });

  test("menü dışına tıklayınca kapanır", async ({ page }) => {
    await page.goto("/tr");

    await page.locator(TOGGLE).click();
    await expect(page.locator(LIST)).toBeVisible();

    // Menünün kesinlikle dışında bir nokta: sayfanın sol üst köşesi.
    await page.mouse.click(5, 5);
    await expect(page.locator(LIST)).toBeHidden();
  });

  test("sayfa değişince otomatik kapanır", async ({ page }) => {
    await page.goto("/tr");

    await page.locator(TOGGLE).click();
    await expect(page.locator(LIST)).toBeVisible();

    // Henüz yalnızca ana sayfa (/tr, /en) inşa edildiği için rota değişimini
    // dil değiştiriciyle tetikliyoruz (/tr -> /en); lig/kategori sayfaları
    // gelecek aşamalarda eklenecek.
    await page.getByRole("link", { name: "EN", exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator(LIST)).toBeHidden();
  });

  test("JavaScript devre dışıyken bile açılır (native <details> davranışı)", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    await page.goto("/tr");

    await expect(page.locator(LIST)).toBeHidden();
    await page.locator(TOGGLE).click();
    await expect(page.locator(LIST)).toBeVisible();

    await context.close();
  });
});
