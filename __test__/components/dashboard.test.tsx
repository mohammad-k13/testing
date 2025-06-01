import Dashboard from "@/components/dashboard";
import useAuth from "@/hooks/useAuth";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useAuth", () => ({
      default: vi.fn(() => ({ isAuthenticated: false, user: null, loading: false, login: vi.fn(), logout: vi.fn() })),
}));

describe("Dashboard", () => {
      const mockedUseAuth = useAuth as ReturnType<typeof vi.fn>;

      beforeEach(() => {
            mockedUseAuth.mockClear();
            mockedUseAuth.mockImplementation(() => ({
                  isAuthenticated: false,
                  user: null,
                  loading: false,
                  login: vi.fn(),
                  logout: vi.fn(),
            }));
      });

      afterEach(() => {
            cleanup();

            vi.restoreAllMocks();
      });

      it("should display loading state initially if useAuth returns loading", async () => {
            mockedUseAuth.mockImplementationOnce(() => ({
                  isAuthenticated: false,
                  user: null,
                  loading: true,
                  login: vi.fn(),
                  logout: vi.fn(),
            }));

            render(<Dashboard />);

            expect(screen.getByTestId("dashboard-loading")).toBeInTheDocument();
      });

      it("should display guest state if user NOT authenticate", async () => {
            render(<Dashboard />);

            expect(screen.queryByTestId("dashboard-loading")).not.toBeInTheDocument();
            expect(screen.getByTestId("dashboard-guest")).toBeInTheDocument();
      });

      it("should display user name state if user authenticate", async () => {
            const user = { name: "Mohamamd", id: "abc" };

            mockedUseAuth.mockImplementationOnce(() => ({
                  isAuthenticated: true,
                  user,
                  loading: false,
                  login: vi.fn(),
                  logout: vi.fn(),
            }));

            render(<Dashboard />);

            expect(screen.queryByTestId("dashboard-loading")).not.toBeInTheDocument();
            expect(screen.queryByTestId("dashboard-guest")).not.toBeInTheDocument();
            expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
            expect(screen.getByRole("heading")).toHaveTextContent(`Welcome, ${user.name}`);
      });
});
