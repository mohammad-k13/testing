import LoginForm from "@/components/form/app-login";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

describe("LoginForm", () => {
      let mockOnSubmit: Mock<({ username, password }: { username: string; password: string }) => Promise<void>>;
      let user: UserEvent;

      beforeEach(() => {
            mockOnSubmit = vi.fn();
            user = userEvent.setup();
      });

      afterEach(() => {
            cleanup();
      });

      // --- Test Case 1: Initial Render ---
      it("should render username, password fields and login button", () => {
            render(<LoginForm onSubmit={mockOnSubmit} />);

            // Assert: Check if elements are in the document
            expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
      });

      // --- Test Case 2: User Input ---
      it("should allow users to type into username and password fields", async () => {
            render(<LoginForm onSubmit={mockOnSubmit} />);

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);

            // Act: Simulate typing
            await user.type(usernameInput, "testuser");
            await user.type(passwordInput, "password123");

            // Assert: Check if input values are updated
            expect(usernameInput).toHaveValue("testuser");
            expect(passwordInput).toHaveValue("password123");
      });

      // --- Test Case 3: Validation (Empty Fields) ---
      it("should display validation errors for empty fields on submit", async () => {
            render(<LoginForm onSubmit={mockOnSubmit} />);

            const loginButton = screen.getByRole("button", { name: /login/i });

            // Act: Click submit without typing anything
            await user.click(loginButton);

            // Assert: Check for validation error messages
            expect(screen.getByText(/username is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
            // Assert: onSubmit should NOT have been called
            expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      // --- Test Case 4: Successful Submission ---
      it("should call onSubmit with correct data when form is valid", async () => {
            render(<LoginForm onSubmit={mockOnSubmit} />);

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole("button", { name: /login/i });

            // Act: Type valid data and submit
            await user.type(usernameInput, "validuser");
            await user.type(passwordInput, "validpass");
            await user.click(loginButton);

            // Assert: Check if onSubmit was called with the expected data
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            expect(mockOnSubmit).toHaveBeenCalledWith({
                  username: "validuser",
                  password: "validpass",
            });
            // Assert: No validation errors should be present
            expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
      });

      // --- Test Case 5: Asynchronous Submission ---
      it("should show loading state during submission and hide after success", async () => {
            // Arrange: Mock onSubmit to return a resolved Promise (simulating success)
            mockOnSubmit.mockResolvedValueOnce(); // Or any success response

            render(<LoginForm onSubmit={mockOnSubmit} />);

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole("button", { name: /login/i });

            // Act: Type data and submit
            await user.type(usernameInput, "asyncuser");
            await user.type(passwordInput, "asyncpass");
            await user.click(loginButton);

            // Assert: Check loading state while Promise is pending
            expect(loginButton).toHaveTextContent(/logging in.../i);
            expect(loginButton).toBeDisabled();

            // Act: Wait for the mock promise to resolve (simulating API response)
            // We don't explicitly call `mockOnSubmit.mockResolveValue` here,
            // as we already set it with `mockResolvedValueOnce` in Arrange.
            // The `await user.click` already makes sure the promise is started.
            // The `waitFor` is for the state update *after* the promise resolves.
            await waitFor(() => {
                  // Assert: Check if loading state is gone and button is re-enabled after submission
                  expect(loginButton).toHaveTextContent(/login/i);
                  expect(loginButton).not.toBeDisabled();
            });

            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      // --- Test Case 6: Asynchronous Submission Failure ---
      it("should display a form-level error on submission failure", async () => {
            // Arrange: Mock onSubmit to return a rejected Promise (simulating failure)
            const errorMessage = "Invalid credentials";
            mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage));

            render(<LoginForm onSubmit={mockOnSubmit} />);

            const usernameInput = screen.getByLabelText(/username/i);
            const passwordInput = screen.getByLabelText(/password/i);
            const loginButton = screen.getByRole("button", { name: /login/i });

            // Act: Type data and submit
            await user.type(usernameInput, "baduser");
            await user.type(passwordInput, "badpass");
            await user.click(loginButton);

            // Assert: Loading state during submission
            expect(loginButton).toHaveTextContent(/logging in.../i);
            expect(loginButton).toBeDisabled();

            await waitFor(() => {
                  // Assert: Check for error message after submission fails
                  expect(screen.getByText(errorMessage)).toBeInTheDocument();
                  // Button should be re-enabled
                  expect(loginButton).toHaveTextContent(/login/i);
                  expect(loginButton).not.toBeDisabled();
            });

            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
});
