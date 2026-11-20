import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  ["/", "Vodor — Premium Linen Menswear"],
  ["/the-signature-collection", "The Signature Collection – Linen & Tailored Menswear | Vodor — Vodor"],
  ["/the-signature-collection/accessories", "Accessories — The Signature Collection – Linen & Tailored Menswear | Vodor — Vodor"],
  ["/the-signature-collection/p/clair-linen-trousers", "Clair Linen Trousers – Tailored Linen Pants for Men | Vodor — Vodor"],
  ["/our-policy", "OUR POLICY — Vodor"],
  ["/cart", "Vodor"],
] as const;

// Fails the test on any page error or console error (hydration mismatches show up here).
const watchErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && !m.text().includes("youtube") && errors.push(m.text()));
  return errors;
};

const isPhone = (page: Page) => page.viewportSize()!.width < 768;

for (const [path, title] of ROUTES) {
  test(`${path} renders without errors`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("footer.ftr")).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("adds a product with options and shows it in the cart", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/the-signature-collection/p/clair-linen-trousers");
  const add = page.getByRole("button", { name: "Add To Cart" });

  await add.click();
  await expect(page.getByRole("alertdialog")).toContainText("Please select the Color and Size options.");
  await page.getByRole("button", { name: "Okay" }).click();
  await expect(page.getByRole("alertdialog")).toBeHidden();

  await page.locator("label", { hasText: "Clair" }).first().click();
  await page.locator("label", { hasText: "Medium" }).click();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await add.click();

  const panel = page.getByRole("dialog", { name: "Added to cart!" });
  await expect(panel).toContainText("Clair Linen Trousers");
  await expect(panel).toContainText("$240.00");
  await expect(panel).toContainText("Medium Clair · 2x");
  await expect(page.locator(".hdr .cart")).toHaveAccessibleName("Cart, 2 items");

  await panel.getByRole("link", { name: "View Cart (2)" }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.locator(".crow")).toHaveCount(1);
  await expect(page.locator(".crow")).toContainText("Size: Medium");
  await expect(page.locator(".crow")).toContainText("Color: Clair");
  await expect(page.locator(".csub b")).toHaveText("$240.00");

  // The cart survives a reload.
  await page.reload();
  await expect(page.locator(".csub b")).toHaveText("$240.00");
  expect(errors).toEqual([]);
});

test("respects the stock limit on one-of-a-kind items", async ({ page }) => {
  await page.goto("/the-signature-collection/p/clair-suede-belt");
  const add = page.getByRole("button", { name: "Add To Cart" });
  await expect(page.locator(".qty")).toHaveCount(0);
  await add.click();
  await page.getByRole("dialog", { name: "Added to cart!" }).getByRole("button", { name: "Close" }).click();
  await expect(add).toHaveText("Add To Cart");
  await add.click();
  await expect(page.getByRole("alertdialog")).toContainText("Sorry, we only have 1 of that item available.");
});

test("changes quantities and empties the cart", async ({ page }) => {
  await page.goto("/the-signature-collection/p/rive-linen-shirt");
  await page.locator("label", { hasText: "Large" }).click();
  await page.getByRole("button", { name: "Add To Cart" }).click();
  await expect(page.getByRole("dialog", { name: "Added to cart!" })).toBeVisible();

  await page.goto("/cart");
  const row = page.locator(".crow");
  await row.getByRole("button", { name: "Increase quantity" }).click();
  await expect(row.locator("input")).toHaveValue("2");
  await expect(page.locator(".csub b")).toHaveText("$160.00");
  await row.getByRole("button", { name: "Decrease quantity" }).click();
  await expect(row.getByRole("button", { name: "Decrease quantity" })).toBeDisabled();
  await row.getByRole("button", { name: "Remove Rive Linen Shirt" }).click();
  await expect(page.getByText("You have nothing in your shopping cart.")).toBeVisible();
  await expect(page.locator(".hdr .cart")).toHaveAccessibleName("Cart, 0 items");
});

test("checkout validates the email and stops at delivery", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/cart$/); // empty cart goes back

  await page.goto("/the-signature-collection/p/brun-leather-card-holder");
  await page.getByRole("button", { name: "Add To Cart" }).click();
  await page.getByRole("dialog", { name: "Added to cart!" }).getByRole("link", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page).toHaveTitle("Vodor | Secure Checkout");
  await expect(page.locator(".ckitems")).toContainText("Brun Leather Card Holder");
  await expect(page.locator(".cksum .cktot")).toHaveText("$50.00");

  const email = page.getByLabel("Email", { exact: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator("#ck-err")).toHaveText("Enter your email address.");
  await email.fill("not-an-email");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator("#ck-err")).toHaveText("Enter a valid email address.");
  await email.fill("buyer@example.com");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator(".ckemv")).toHaveText("buyer@example.com");
  await expect(page.getByLabel("First Name")).toBeFocused();

  await page.getByRole("button", { name: "Discount or gift card" }).click();
  await page.getByPlaceholder("Gift or Discount Code").fill("SAVE10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.locator(".ckdmsg")).toHaveText("This code is not valid.");

  await page.getByRole("button", { name: "Remove Brun Leather Card Holder" }).click();
  await expect(page).toHaveURL(/\/cart$/);
});

test("FAQ answers open and close", async ({ page }) => {
  await page.goto("/the-signature-collection");
  const q = page.getByRole("button", { name: "What materials does Vodor use?" });
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("full-grain leather")).toBeVisible();
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "false");
});

test("phone menu and category picker navigate", async ({ page }) => {
  test.skip(!isPhone(page), "phone layout only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open Menu" }).click();
  await expect(page.locator("body")).toHaveClass(/menu-open/);
  await page.locator(".menu").getByRole("link", { name: "THE SIGNATURE COLLECTION" }).click();
  await expect(page).toHaveURL(/\/the-signature-collection$/);
  await expect(page.locator("body")).not.toHaveClass(/menu-open/);

  await page.getByLabel("Categories").selectOption({ label: "Accessories" });
  await expect(page).toHaveURL(/\/the-signature-collection\/accessories$/);
  await expect(page.locator(".grid .card")).toHaveCount(4);
});
