import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MyRepo from "./MyRepo";

jest.mock("axios");

const mockRepos = [
  { id: 1, name: "Repo 1", html_url: "http://repo1.com", isAnalyzed: true },
  { id: 2, name: "Repo 2", html_url: "http://repo2.com", isAnalyzed: false },
];

describe("MyRepo", () => {
  it("renders loading state initially", () => {
    const { getByText } = render(<MyRepo userID="testUser" />);
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches repos and renders them on mount", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRepos });

    render(<MyRepo userID="testUser" />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.github.com/users/testUser/repos",
      expect.anything(),
    );

    expect(screen.getByText("Repo 1")).toBeInTheDocument();
    expect(screen.getByText("Repo 2")).toBeInTheDocument();
  });

  it("handles mouse enter and leave events", async () => {
    axios.get.mockResolvedValueOnce({ data: mockRepos });

    render(<MyRepo userID="testUser" />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    const repoItem = screen.getByText("Repo 1");
    userEvent.hover(repoItem);
    expect(console.log).toHaveBeenCalledWith("Mouse Enter");

    userEvent.unhover(repoItem);
    expect(console.log).toHaveBeenCalledWith("Mouse Leave");
  });
});
