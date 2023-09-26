import { render, screen } from "@testing-library/react";
import {
  BrowserRouter,
  Routes,
  Route,
  MemoryRouter,
  createMemoryRouter,
} from "react-router-dom";
import App from "../../App";
import HomePage from "../../Pages/HomePage";
import LoginPage from "../../Pages/LoginPage";
import Login from "../Login/Login";
import PrivateRoute from "./PrivateRoute";

jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: () => [{ user: false }],
}));

jest.mock("../../Pages/LoginPage");
jest.mock("../../Pages/HomePage");
jest.mock("../../Pages/SignupPage");

describe.skip("PrivateRoute", () => {
  it("should redirect to Login if no user", () => {
    (LoginPage as any).mockImplementation(() => <div>login test page</div>);
    (HomePage as any).mockImplementation(() => <div>home test page</div>);

    //rest of the test
    render(<App />, { wrapper: BrowserRouter });

    // screen.debug();
  });

  it("should redirect to Homepage if user present", () => {
    (LoginPage as any).mockImplementation(() => <div>login test page</div>);
    (HomePage as any).mockImplementation(() => <div>home test page</div>);

    //rest of the test
    render(
      <MemoryRouter initialEntries={["/", "/login"]}>
        <App />
      </MemoryRouter>
    );
  });
});
