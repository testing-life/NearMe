import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChangeEvent } from "react";
import Input from "./Input";

describe("Input component", () => {
  it("should render", () => {
    render(
      <Input
        id="email"
        required
        label="Email"
        type="email"
        placeholder="email"
        value=""
        onChange={(e: ChangeEvent<HTMLInputElement>) => jest.fn()}
      />
    );

    const label = screen.getByText("Email");
    const field = screen.getByPlaceholderText("email");
    expect(label).toBeInTheDocument();
    expect(field).toBeInTheDocument();
    expect((field as HTMLInputElement).value).toBe("");
    expect((field as HTMLInputElement).type).toBe("email");
  });

  it("should be optional", () => {
    render(
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="email"
        value=""
        onChange={(e: ChangeEvent<HTMLInputElement>) => jest.fn()}
      />
    );

    const field = screen.getByPlaceholderText("email");
    expect((field as HTMLInputElement).required).toBeFalsy();
  });

  it("should trigger handler on change", async () => {
    const changeHandler = jest.fn();
    render(
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="email"
        value=""
        onChange={changeHandler}
      />
    );
    const user = userEvent;
    const field = screen.getByPlaceholderText("email");
    await user.type(field, "Test");
    expect(changeHandler).toHaveBeenCalled();
  });
});
