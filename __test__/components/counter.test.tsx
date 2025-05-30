import AppCounter from "@/components/app-counter";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { type ReactNode } from "react";

function setup(component: ReactNode) {
      return {
            user: userEvent.setup(),
            component: render(component),
      };
}

describe("Counter", () => {
      const { user, component } = setup(<AppCounter />);
      it("Should render the counter component and show count: 0", () => {
            const button = component.getByRole("button");

            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent(/Count: 0/);
      });

      it("Should render increament count", async () => {
            await user.click(component.getByRole("button"));
            expect(component.getByRole("button")).toHaveTextContent(/Count: 1/);
      });
});
