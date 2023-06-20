describe('Async Storage', () => {
  describe('functional tests', () => {
    it('should pass', () => {
      expect(2).toEqual(3);
    });
    // it('should be visible', async () => {
    //   await expect(element(by.id('functional-view'))).toExist();
    // });
    //
    // const testNames = Object.keys(tests);
    // for (const name of testNames) {
    //   it(name, async () => {
    //     await expect(element(by.id(`test:${name}`))).toHaveLabel('Pass');
    //   });
    // }
    //
    // // Re-run tests with native delegate set
    // for (const currentName of testNames) {
    //   const name = currentName + ' with delegate';
    //   it(name, async () => {
    //     const el = await element(by.id(`test:${name}`)).getAttributes();
    //     if (el.label === 'Skip') {
    //       return;
    //     }
    //
    //     await expect(element(by.id(`test:${name}`))).toHaveLabel('Pass');
    //   });
    // }
  });
});
