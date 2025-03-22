const request = require("supertest");
const app = require("../server");
const { describe, it } = require("jest");

describe("Goals Route", () => {
  it("GET /api/goals/get/{userID}", async () => {
    await request(app).get("/api/goals/get/1").expect(401);
  });

  it("POST /api/goals/set", async () => {
    await request(app).post("/api/goals/set").expect(401);
  });
});
