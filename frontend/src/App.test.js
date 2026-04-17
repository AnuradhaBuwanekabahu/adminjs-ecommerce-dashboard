import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders project frontend title", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const homeLink = screen.getByText(/home/i);
  expect(homeLink).toBeInTheDocument();
});
