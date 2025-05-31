import AppDebouncedSearch from "@/components/app-debounced-search";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

describe("Debounced Search", () => {
      let mockOnSearch: Mock<(searchTerms: string) => void>;

      const setup = () => {
            render(<AppDebouncedSearch onSearch={mockOnSearch} />);
            const input = screen.getByTestId("search-input") as HTMLInputElement;
            return { input };
      };

      const fillInput = (input: HTMLInputElement, value: string, hasInteval: boolean, intervalTime?: number) => {
            fireEvent.change(input, { target: { value: value } });
            if (hasInteval && intervalTime) {
                  vi.advanceTimersByTime(intervalTime);
            }
      };

      beforeEach(() => {
            vi.useFakeTimers();
            mockOnSearch = vi.fn();
      });

      afterEach(() => {
            cleanup();
            vi.useRealTimers();
      });

      it("Should not call onSearch immediately", () => {
            const { input } = setup();

            fillInput(input, "test", false);
            expect(mockOnSearch).not.toHaveBeenCalled();
      });

      it("Should call onSearch after debounce time", () => {
            const { input } = setup();

            // fireEvent.change(input, { target: { value: "test" } });
            // vi.advanceTimersByTime(500);

            fillInput(input, "test", true, 500);

            expect(mockOnSearch).toHaveBeenCalledWith("test");
            expect(mockOnSearch).toHaveBeenCalledTimes(1);
            // expect(mockOnSearch).not.toHaveBeenCalled();
      });

      it("Should only call onSearch once if typed quickly", () => {
            const { input } = setup();

            fillInput(input, "t", true, 200);
            fillInput(input, "te", true, 200);
            fillInput(input, "test", true, 500);

            expect(mockOnSearch).toHaveBeenCalled();
            expect(mockOnSearch).toHaveBeenCalledWith("test");
      });

      it("Should not call onSearch if search term is empty", () => {
            const { input } = setup();

            fillInput(input, "", true, 500);

            expect(mockOnSearch).not.toHaveBeenCalled();
      });
});
