import AppCard from "@/components/app-card";
import { render } from "@testing-library/react";
import { describe, expect, it, test } from "vitest";

describe("Card", () => {
      it("Should render the card component with text", () => {
            const text = "Hello World";
            const card = render(<AppCard text={text} />);

            expect(card.getByText(text)).toBeInTheDocument();
      });
});
