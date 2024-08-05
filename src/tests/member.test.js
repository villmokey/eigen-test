import supertest from "supertest";
import { prismaClient } from "../app/database";
import { server } from "../app/server";

describe('POST /api/members', () => {
  afterEach(async () => {
    await prismaClient.member.deleteMany({
      where: {
        code: 'M001'
      }
    })
  })

  it('Should success to create a member', async () => {
    const req = await supertest(server)
      .post('/api/members')
      .send({
        "code": "M001",
        "name": "Angga"
      })
    
    expect(req.status).toBe(200);
    expect(req.body.data.code).toBe('M001')
  });

  it('Should failed to create a member', async () => {
    const req = await supertest(server)
      .post('/api/members')
      .send({
        "code": "",
        "name": ""
      })
    
    expect(req.status).toBe(400);
    expect(req.error).toBeTruthy();
  });
})

describe('GET /api/members', () => {

  beforeEach(async () => {
    await prismaClient.member.create({
      data: {
        "code": "M001",
        "name": "Angga"
      }
    })
  })

  afterEach(async () => {
    await prismaClient.member.deleteMany({
      where: {
        code: 'M001'
      }
    })
  })

  it('Should success to list the members', async () => {
    const req = await supertest(server)
      .get('/api/members')
      
    expect(req.status).toBe(200);
    expect(req.body.data).toBeTruthy();
    expect(req.body.data[0]).toHaveProperty('code')
  });
});