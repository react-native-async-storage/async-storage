import { commands as cmd } from "./commands";
import testCases from "../examples/tests";

describe("Async Storage functional tests", () => {
  it("should be visible", async () => {
    // wait until content loads, as android's waitForSelectorTimeout setting does not seem to work
    await new Promise((r) => setTimeout(r, 3000));
    const el = await cmd.elementByLabel("functional-view");
    await expect(await el.isExisting()).toEqual(true);
  });

  const testNames = Object.keys(testCases);
  describe("storing / reading values", () => {
    for (const name of testNames) {
      it(name, async () => {
        const el = await cmd.elementByLabel(`test:${name}`);
        await expect(await el.getText()).toEqual("Pass");
      });
    }
  });

  describe("storing / reading values with delegate", () => {
    for (const currentName of testNames) {
      const name = currentName + " with delegate";
      it(name, async () => {
        const el = await cmd.elementByLabel(`test:${name}`);
        const label = await el.getText();
        if (label === "Skip") {
          return;
        }

        expect(label).toEqual("Pass");
      });
    }
  });
});
