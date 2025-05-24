import { describe, expect, test, vi } from "vitest";

describe("Mock", () => {
      describe("vi.fn()", () => {
            test("Can track calls", () => {
                  const mockfn = vi.fn();

                  mockfn();
                  mockfn(1, 2);

                  expect(mockfn).toHaveBeenCalledTimes(2);
                  expect(mockfn).toHaveBeenCalledWith(1, 2);
                  expect(mockfn.mock.calls).toEqual([[], [1, 2]]);
            });

            test(" Always returns a specific value.", () => {
                  const greet = vi.fn().mockReturnValue("Hello World");

                  expect(greet()).toBe("Hello World");
            });

            test("Returns a specific value for the next call", () => {
                  const nextCall = vi.fn().mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValue(3);

                  expect(nextCall()).toBe(1);
                  expect(nextCall()).toBe(2);
                  expect(nextCall()).toBe(3);
                  expect(nextCall()).toBe(3);
                  expect(nextCall()).toBe(3);
            });

            test("Provides a custom implementation for the mock function.", () => {
                  const add = vi.fn().mockImplementation((a, b) => a + b);

                  expect(add(1, 2)).toBe(3);
            });

            test(" Provides a custom implementation for the next call. Can be chained.", () => {
                  const processData = vi
                        .fn()
                        .mockImplementationOnce((data) => `Processed: ${data}`)
                        .mockImplementationOnce((data) => `Result: ${data}`);

                  expect(processData("Users")).toBe("Processed: Users");
                  expect(processData("Raw")).toBe("Result: Raw");
            });

            test("For async functions, resolves the promise with the given value.", async () => {
                  const fetchData = vi.fn().mockResolvedValue({ id: 1, name: "Mohammad" });

                  expect(await fetchData()).toEqual({ id: 1, name: "Mohammad" });
            });

            test("Resolves the promise with the given value for the next call.", async () => {
                  const fetchData = vi
                        .fn()
                        .mockResolvedValueOnce({ id: 1, name: "Mohammad" })
                        .mockResolvedValueOnce({ id: 2, name: "Ali" });

                  expect(await fetchData()).toEqual({ id: 1, name: "Mohammad" });
                  expect(await fetchData()).toEqual({ id: 2, name: "Ali" });
            });

            test("For async functions, rejects the promise with the given error.", async () => {
                  const fetchData = vi.fn().mockRejectedValue(new Error("Network error"));

                  await expect(fetchData()).rejects.toThrow("Network error");
            });

            test("Rejects the promise with the given error for the next call.", async () => {
                  const fetchData = vi
                        .fn()
                        .mockRejectedValueOnce(new Error("First error"))
                        .mockRejectedValueOnce(new Error("Second error"));

                  await expect(fetchData()).rejects.toThrow("First error");
                  await expect(fetchData()).rejects.toThrow("Second error");
            });
      });

});
