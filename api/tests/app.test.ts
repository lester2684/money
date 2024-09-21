import { describe, expect, it, afterAll } from "@jest/globals";
import request from "supertest";
import { app, server } from "../app";

afterAll(() => {
  server.close();
});

describe("API Endpoints", () => {
  describe("GET /api/balanceSheet", () => {
    it("should return the report", async () => {
      const response = await request(app).get("/api/balanceSheet");
      expect(response.status).toBe(200);
    });
  });
});
