import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("UsersController", () => {
  
  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } });
  });

  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({ name: "Testy", email: "t@t.com", password: "222222" })
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Testy");
    expect(response.body.email).toBe("t@t.com");
    user_id = response.body.id;
  });

  it("should not create a user with an existing email", async () => {
    const response = await request(app).post("/users").send({ name: "Duplicated Testy", email: "t@t.com", password: "222222" });
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Email is already in use");
  });

  it("should throw a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({ name: "Testy", email: "invalid-email", password: "222222" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("Validation Error");
  });

});