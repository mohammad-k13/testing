import { describe, it, expect } from 'vitest'
import {render, screen} from '@testing-library/react'
import AppButton from '@/components/app-button';

describe('AppButton Component', () => {
      it("Should render text", () => {
            const text = "Click Me!"
            render(<AppButton text={text} />);

            const button = screen.getByRole("button");
            const buttonText = button.textContent;

            expect(buttonText).toBe(text);
      })
});
