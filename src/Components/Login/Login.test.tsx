import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";

describe("Login component", () => {
  it("should render", () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
    const emailLabel = screen.getByText("Email");
    const passLabel = screen.getByText("Password");
    const emailField = screen.getByPlaceholderText("email");
    const passField = screen.getByPlaceholderText("password");
    const button = screen.getByRole("button");
    expect(emailLabel).toBeInTheDocument();
    expect(passLabel).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(passField).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect((emailField as HTMLInputElement).value).toBe("");
    expect((passField as HTMLInputElement).value).toBe("");
  });

  it("should validate email field", async () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
    const user = userEvent;
    const emailField = screen.getByPlaceholderText("email");
    await user.type(emailField, "Test");
    expect((emailField as HTMLInputElement).checkValidity()).toBeFalsy();
  });
});
