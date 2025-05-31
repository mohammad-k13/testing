import ThemeSwitcher from "@/components/app-theme-switcher";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

describe("ThemeSwitcher", () => {
      const localStorageMock = (() => {
            let store: any = {};
            return {
                  getItem: vi.fn((key) => store[key] || null),
                  setItem: vi.fn((key, value) => {
                        store[key] = value.toString();
                  }),
                  clear: vi.fn(() => {
                        store = {};
                  }),
                  removeItem: vi.fn((key) => {
                        delete store[key];
                  }),
            };
      })();

      let bodyClassSpy: ReturnType<typeof vi.spyOn>;

      beforeEach(() => {
            Object.defineProperty(window, "localStorage", { value: localStorageMock });
            localStorageMock.clear();
            localStorageMock.getItem.mockClear();
            localStorageMock.setItem.mockClear();

            bodyClassSpy = vi.spyOn(document.body, "className", "set");
      });

      afterEach(() => {
            cleanup();

            vi.restoreAllMocks();
            bodyClassSpy.mockRestore();
      });

      it("should read initial theme from localStorage", () => {
            localStorageMock.getItem.mockReturnValueOnce("dark");

            render(<ThemeSwitcher />);
            expect(localStorageMock.getItem).toHaveBeenCalledWith("user-theme");
      });

      it("should save the theme to localStorage and apply to body when toggled", () => {
            render(<ThemeSwitcher />);

            expect(screen.getByText("Current Theme: light")).toBeInTheDocument();
            expect(localStorageMock.setItem).toHaveBeenCalledWith("user-theme", "light");
            expect(bodyClassSpy).toHaveBeenCalledWith("light");

            const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
            fireEvent.click(toggleButton);

            expect(screen.getByText("Current Theme: dark")).toBeInTheDocument();
            expect(localStorageMock.setItem).toHaveBeenCalledWith("user-theme", "dark");
            expect(bodyClassSpy).toHaveBeenCalledWith("dark");
            expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      });
});
