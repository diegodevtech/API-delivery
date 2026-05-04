import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@/database/prisma';

describe("SessionsController", () => {

  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } });
  });

  it("Should authenticate a user and return a token", async () => {
    const createUserResponse = await request(app).post("/users").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123"
    });

    user_id = createUserResponse.body.id;

    const loginResponse = await request(app).post("/sessions").send({
      email: "john@example.com",
      password: "password123"
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty("token")
    expect(loginResponse.body.token).toEqual(expect.any(String));
  });
});