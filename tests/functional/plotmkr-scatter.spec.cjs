const { test, expect } = require("@playwright/test");

for (const theme of ["bright", "chalkboard"]) {
  test(`scatter axis labels appear in the preview and SVG export (${theme})`, async ({ page }) => {
    await page.goto("apps/plotmkr/");
    await page.locator("#level").selectOption("advanced");
    await page.locator("#quickType").selectOption("scatter");
    await page.locator("#quickData").fill("Site A,0,48\nSite B,50,38\nSite C,90,29");
    await page.locator("#title").fill("Campus Microclimates");
    await page.locator("#theme").selectOption(theme);
    await page.locator("#xLabel").fill("Shade & cover (%)");
    await page.locator("#yLabel").fill("Temp < 50 °C");
    const svg = page.locator("#canvas svg");
    const xLabel = svg.locator("text").filter({ hasText: /^Shade & cover \(%\)$/ });
    const yLabel = svg.locator("text").filter({ hasText: /^Temp < 50 °C$/ });
    await expect(xLabel).toBeVisible();
    await expect(yLabel).toBeVisible();
    await expect(yLabel).toHaveAttribute("transform", /rotate\(-90/);
    await expect(svg.locator("circle")).toHaveCount(3);
    // Both labels must be inside the exported canvas and use the theme's ink.
    for (const label of [xLabel, yLabel]) {
      const layout = await label.evaluate(el => {
        const box = el.getBoundingClientRect();
        const canvas = el.ownerSVGElement.getBoundingClientRect();
        return { inside: box.left >= canvas.left && box.right <= canvas.right &&
          box.top >= canvas.top && box.bottom <= canvas.bottom,
          fill: el.getAttribute("fill"),
          titleFill: el.ownerSVGElement.querySelector('text[font-weight="800"]').getAttribute("fill") };
      });
      expect(layout.inside).toBe(true);
      expect(layout.fill).toBe(layout.titleFill);
    }
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#downloadSvg").click();
    const stream = await (await downloadPromise).createReadStream();
    let exported = "";
    for await (const chunk of stream) exported += chunk.toString();
    expect(exported).toContain("Shade &amp; cover (%)");
    expect(exported).toContain("Temp &lt; 50 °C");
    await page.locator("#xLabel").fill("");
    await expect(xLabel).toHaveCount(0);
    await expect(yLabel).toBeVisible();
    await page.locator("#yLabel").fill("");
    await expect(yLabel).toHaveCount(0);
  });
}
