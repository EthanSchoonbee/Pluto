import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ShelterNavbar from "../ShelterNavbar";

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe("ShelterNavbar", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders correctly", () => {
    const { getByTestId } = render(<ShelterNavbar />);
    expect(getByTestId("home-icon")).toBeTruthy();
    expect(getByTestId("settings-icon")).toBeTruthy();
  });

  it("navigates to ShelterHome when home icon is pressed", () => {
    const { getByTestId } = render(<ShelterNavbar />);
    fireEvent.press(getByTestId("home-icon"));
    expect(mockNavigate).toHaveBeenCalledWith("ShelterHome");
  });

  it("navigates to ShelterSettings when settings icon is pressed", () => {
    const { getByTestId } = render(<ShelterNavbar />);
    fireEvent.press(getByTestId("settings-icon"));
    expect(mockNavigate).toHaveBeenCalledWith("ShelterSettings");
  });
});
