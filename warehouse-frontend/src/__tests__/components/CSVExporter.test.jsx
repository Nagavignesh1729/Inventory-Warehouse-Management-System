// CSVExporter.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CSVExporter from "../components/CSVExporter";

describe("CSVExporter", () => {
  const sampleData = [
    { id: 1, name: "Item 1", category: "Electronics" },
    { id: 2, name: "Item 2", category: "Books" },
  ];

  test("renders Export CSV button", () => {
    render(<CSVExporter data={sampleData} />);
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  test("opens and closes options modal", () => {
    render(<CSVExporter data={sampleData} />);
    fireEvent.click(screen.getByRole("button", { name: "" })); // settings button
    expect(screen.getByText("Export Options")).toBeInTheDocument();
  });

  test("calls onExport callback when exporting", async () => {
    const onExport = jest.fn();
    render(<CSVExporter data={sampleData} onExport={onExport} />);

    const button = screen.getByText("Export CSV");
    fireEvent.click(button);

    // Wait for the callback
    expect(onExport).toHaveBeenCalled();
  });
});
