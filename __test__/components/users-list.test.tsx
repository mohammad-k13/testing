import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import * as api from "@/services/users";
import { render, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import AppUsers from "@/components/app-users-list";
import AppCard from "@/components/app-card";

vi.mock("@/services/users", () => ({
      getUsers: vi.fn(),
}));

vi.mock("@/components/app-card", () => ({
      default: vi.fn(({ text }) => <div data-testid="app-card">{text}</div>),
}));

const appUsersTestIds = {
      loading: "loading-state",
      notFound: "empty-state",
      usersList: "user-list",
};

describe("Users", () => {
      const mockedFetchUsers = api.getUsers as Mock;

      beforeEach(() => {
            mockedFetchUsers.mockClear(); // this will clear calls
      });

      afterEach(() => {
            vi.resetAllMocks(); // reset mocks to their original implementaion
      });

      it("Should render loading state", () => {
            mockedFetchUsers.mockImplementation(() => new Promise(() => {}));

            const { getByTestId, queryByTestId } = render(<AppUsers />);

            expect(getByTestId(appUsersTestIds.loading)).toBeInTheDocument();
            expect(queryByTestId(appUsersTestIds.notFound)).not.toBeInTheDocument();
            expect(queryByTestId(appUsersTestIds.usersList)).not.toBeInTheDocument();
      });

      it("Should display users after successfull fetch", async () => {
            const mockedUsers: api.IUser[] = [
                  { avatar: "", id: "1", createdAt: "", name: "mohammad", username: "mk13" },
                  { avatar: "", id: "2", createdAt: "", name: "ali", username: "ali12" },
            ];

            mockedFetchUsers.mockResolvedValue(mockedUsers);
            mockedFetchUsers.mockResolvedValue(mockedUsers);

            const { getByTestId, getByText } = render(<AppUsers />);

            waitFor(
                  () => {
                        console.log("callback runed");

                        expect(getByTestId(appUsersTestIds.usersList)).toBeInTheDocument();
                        expect(getByText("mohammad")).toBeInTheDocument();
                        expect(getByText("ali")).toBeInTheDocument();

                        expect(getByTestId(appUsersTestIds.loading)).not.toBeInTheDocument();
                        expect(getByTestId(appUsersTestIds.notFound)).not.toBeInTheDocument();
                  },
                  { interval: 500, timeout: 1000 }
            );

            // expect(mockedAppCard).toHaveBeenCalledTimes(mockedUsers.length); // todo: try to catch uneccessry re-renders
      });
});
