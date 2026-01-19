import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";

vi.mock("../api/scooters", () => ({
    fetchStatus: vi.fn(async () => ({ status: "ok", version: "1.0.0" })),
    fetchScooters: vi.fn(async () => [
        { id: "1", city: "Stockholm", status: "Available" },
        { id: "2", city: "Göteborg", status: "Charging" },
        { id: "3", city: "Stockholm", status: "Available" },
    ]),
    }));

    vi.mock("../api/cities", () => ({
    fetchCities: vi.fn(async () => [
        { name: "Stockholm" },
        { name: "Göteborg" },
        { name: "Malmö" },
    ]),
    }));

    vi.mock("../api/useLiveScooters", () => ({
    useLiveScooters: (fallback) => ({
        scooters: fallback,
        meta: { connected: false, count: 0, error: "" },
        lastUpdateText: "—",
    }),
    }));

    describe("Dashboard", () => {
    it("renders summary cards with data", async () => {
        render(<Dashboard />);
        expect(await screen.findByText("Admin Dashboard")).toBeTruthy();
        expect(await screen.findByText("Uppe")).toBeTruthy();
        expect(await screen.findByText("Aktiva städer")).toBeTruthy();        expect(await screen.findByText(/Stockholm, Göteborg, Malmö/i)).toBeTruthy();
        expect(await screen.findByText("Totalt antal fordon")).toBeTruthy();
    });
});
