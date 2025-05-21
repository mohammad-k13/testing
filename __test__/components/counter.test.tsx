import AppCounter from "@/components/app-counter";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("Counter", () => {
      it("Should render the counter component", () => {
            const screen = render(<AppCounter />);
            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
            expect(button.textContent).toBe(/Count:/);
      });
      it("Should render increament count", () => {});
});
