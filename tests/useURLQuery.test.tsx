import { renderHook } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import useURLQuery from "../src/useURLQuery";

// Mock router and searchParams
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe("useURLQuery Hook", () => {
  let mockPush: jest.Mock;
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    // Mock router push function
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Mock searchParams
    mockSearchParams = new URLSearchParams();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should update the URL when queries change", () => {
    const onURLChange = jest.fn();

    const { rerender } = renderHook(
      ({ queries }) => useURLQuery({ onURLChange, queries }),
      { initialProps: { queries: { page: 1, search: "test" } } }
    );

    expect(mockPush).toHaveBeenCalledWith("?page=1&search=%22test%22", {
      scroll: false,
    });

    // Change query values
    rerender({ queries: { page: 2, search: "updated" } });

    expect(mockPush).toHaveBeenCalledWith("?page=2&search=%22updated%22", {
      scroll: false,
    });
  });

  test("should only store valid values and ignore empty ones", () => {
    const onURLChange = jest.fn();

    renderHook(() =>
      useURLQuery({
        onURLChange,
        queries: { page: 1, search: "", filter: {} },
      })
    );

    expect(mockPush).toHaveBeenCalledWith("?page=1", { scroll: false });
  });

  test("should store arrays correctly in the URL", () => {
    const onURLChange = jest.fn();

    renderHook(() =>
      useURLQuery({
        onURLChange,
        queries: { tags: ["apple", "banana"], page: 1 },
      })
    );

    expect(mockPush).toHaveBeenCalledWith(
      "?tags=%5B%22apple%22%2C%22banana%22%5D&page=1",
      { scroll: false }
    );
  });

  test("should parse arrays correctly from URL", () => {
    mockSearchParams.set("tags", JSON.stringify(["apple", "banana"]));

    const onURLChange = jest.fn();
    renderHook(() => useURLQuery({ onURLChange, queries: {} }));

    expect(onURLChange).toHaveBeenCalledWith({ tags: ["apple", "banana"] });
  });

  test("should ignore empty arrays and objects in queries", () => {
    const onURLChange = jest.fn();

    renderHook(() =>
      useURLQuery({
        onURLChange,
        queries: { page: 1, filter: { category: [] } },
      })
    );

    expect(mockPush).toHaveBeenCalledWith("?page=1", { scroll: false });
  });

  test("should remove keys from URL if values become empty", () => {
    const onURLChange = jest.fn();
    const { rerender } = renderHook(
      ({ queries }) => useURLQuery({ onURLChange, queries }),
      { initialProps: { queries: { page: 1, search: "test" } } }
    );

    expect(mockPush).toHaveBeenCalledWith("?page=1&search=%22test%22", {
      scroll: false,
    });

    // Update to remove search
    rerender({ queries: { page: 1, search: "" } });

    expect(mockPush).toHaveBeenCalledWith("?page=1", { scroll: false });
  });

  test("should handle nested objects and keep only valid values", () => {
    const onURLChange = jest.fn();

    renderHook(() =>
      useURLQuery({
        onURLChange,
        queries: {
          page: 1,
          filter: {
            category: "electronics",
            subCategory: [],
          },
        },
      })
    );

    expect(mockPush).toHaveBeenCalledWith(
      "?page=1&filter=%7B%22category%22%3A%22electronics%22%7D",
      { scroll: false }
    );
  });

  test("should not update URL if queries do not change", () => {
    const onURLChange = jest.fn();
    const { rerender } = renderHook(
      ({ queries }) => useURLQuery({ onURLChange, queries }),
      { initialProps: { queries: { page: 1, search: "test" } } }
    );

    // Re-render with the same queries
    rerender({ queries: { page: 1, search: "test" } });

    expect(mockPush).toHaveBeenCalledTimes(1); // No additional updates
  });

  test("should parse nested filter values correctly from URL", () => {
    mockSearchParams.set("filter", JSON.stringify({ category: "electronics" }));

    const onURLChange = jest.fn();
    renderHook(() => useURLQuery({ onURLChange, queries: {} }));

    expect(onURLChange).toHaveBeenCalledWith({
      filter: { category: "electronics" },
    });
  });
});
