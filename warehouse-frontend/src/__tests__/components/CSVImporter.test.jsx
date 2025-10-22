// __tests__/CSVImporter.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CSVImporter from "../components/CSVImporter";

describe("CSVImporter Component", () => {
  const mockOnImport = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders upload step initially", () => {
    render(<CSVImporter onImport={mockOnImport} onClose={mockOnClose} />);
    expect(screen.getByText("Upload CSV")).toBeInTheDocument();
    expect(screen.getByText("Select CSV File")).toBeInTheDocument();
  });

  test("shows error when wrong file type uploaded", () => {
    render(<CSVImporter />);
    const input = screen.getByLabelText("Select CSV File", { selector: "input" });

    const badFile = new File(["dummy"], "file.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [badFile] } });

    expect(screen.getByText("Import Errors")).toBeInTheDocument();
  });

  test("moves to step 2 after valid CSV parse", async () => {
    render(<CSVImporter />);
    const input = screen.getByLabelText("Select CSV File", { selector: "input" });

    // Simulate a valid CSV file
    const goodFile = new File(
      ["Name,Category,Stock Level,Warehouse\nItem 1,Electronics,5,Main Warehouse"],
      "test.csv",
      { type: "text/csv" }
    );

    // Mock FileReader
    const mockReadAsText = jest.fn(function () {
      this.onload({ target: { result: goodFile.text } });
    });
    window.FileReader = jest.fn(() => ({ readAsText: mockReadAsText }));

    fireEvent.change(input, { target: { files: [goodFile] } });

    // Step 2 should appear
    expect(await screen.findByText("Map Columns")).toBeInTheDocument();
  });

  test("clicking cancel calls onClose", () => {
    render(<CSVImporter onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
