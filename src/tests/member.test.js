import supertest from "supertest";
import { prismaClient } from "../app/database";
import { server } from "../app/server";
import dayjs from "dayjs";

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
    await prismaClient.book.createMany({
      data: [
        {
            code: "JK-45",
            title: "Harry Potter",
            author: "J.K Rowling",
            stock: 1
        },
        {
            code: "SHR-1",
            title: "A Study in Scarlet",
            author: "Arthur Conan Doyle",
            stock: 1
        },
        {
            code: "TW-11",
            title: "Twilight",
            author: "Stephenie Meyer",
            stock: 1
        },
        {
            code: "HOB-83",
            title: "The Hobbit, or There and Back Again",
            author: "J.R.R. Tolkien",
            stock: 1
        },
        {
            code: "NRN-7",
            title: "The Lion, the Witch and the Wardrobe",
            author: "C.S. Lewis",
            stock: 1
        },
      ]
    })

    await prismaClient.member.createMany({
      data: [
        {
          code: "M001",
          name: "Angga",
        },
        {
          code: "M002",
          name: "Ferry",
        },
        {
          code: "M003",
          name: "Putri",
        },
      ]
    })

    await prismaClient.transaction.createMany({
      data: [
        {
          member_code: 'M001',
          book_code: 'JK-45',
          return_date: dayjs().add(7, 'days').toISOString()
        },
        {
          member_code: 'M001',
          book_code: 'SHR-1',
          return_date: dayjs().add(7, 'days').toISOString()
        },
      ]
    });

  })

  afterEach(async () => {
    await prismaClient.transaction.deleteMany({})
    await prismaClient.book.deleteMany({})
    await prismaClient.member.deleteMany({})
  })


  it('Should success to list the members', async () => {
    const req = await supertest(server)
      .get('/api/members')


    expect(req.status).toBe(200);
    expect(req.body.data).toBeTruthy();
    expect(req.body.data[0]).toHaveProperty('borrowed_book_count')
  });
});