const { add, divide } = require("./math");

describe("Math Utils", () => {
  test("should add two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("should divide two numbers", () => {
    expect(divide(10, 2)).toBe(5);
  });

  test("should throw error when dividing by zero", () => {
    expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
  });
});
