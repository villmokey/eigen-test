import supertest from "supertest"
import { server } from "../app/server"
import { prismaClient } from "../app/database"
import dayjs from "dayjs"

describe('POST /api/books', () => {

  afterEach(async () => {
    await prismaClient.book.deleteMany({
      where: {
        code: 'JK-45'
      }
    })
  })

  it('Should success to create a book', async () => {
    const req = await supertest(server)
      .post('/api/books')
      .send({
        "code": "JK-45",
        "title": "Harry Potter",
        "author": "J.K Rowling",
        "stock": 1
      })
    
    expect(req.status).toBe(200);
    expect(req.body.data.code).toBe('JK-45')
  });

  it('Should failed to create a book', async () => {
    const req = await supertest(server)
      .post('/api/books')
      .send({
        "code": "",
        "title": "",
        "author": "",
        "stock": 1
      })
    
    expect(req.status).toBe(400);
    expect(req.error).toBeTruthy();
  });

})

describe('POST /api/books/borrow', () => {

  beforeEach(async () => {
    await prismaClient.book.create({
      data: {
        "code": "JK-45",
        "title": "Harry Potter",
        "author": "J.K Rowling",
        "stock": 1
      }
    })

    await prismaClient.member.create({
      data: {
        "code": "M001",
        "name": "Angga"
      }
    })

  })

  afterEach(async () => {
    await prismaClient.transaction.deleteMany({
      where: {
        book_code: 'JK-45',
        member_code: 'M001'
      }
    })

    await prismaClient.book.deleteMany({
      where: {
        code: 'JK-45',
      }
    })

    await prismaClient.member.deleteMany({
      where: {
        code: 'M001',
      }
    })
  })

  it('Should success to borrow a book', async () => {
    const req = await supertest(server)
      .post('/api/books/borrow')
      .send({
        "book_code": "JK-45",
        "member_code": "M001",
      })

    expect(req.status).toBe(200);
    expect(req.body.data.book_code).toBe('JK-45');
    expect(req.body.data.member_code).toBe('M001');
    expect(dayjs(req.body.data.borrowed_date).format('YYYY-MM-DD HH:mm')).toBe(dayjs().format('YYYY-MM-DD HH:mm'));
    expect(dayjs(req.body.data.return_date).format('YYYY-MM-DD HH:mm')).toBe(dayjs().add(7, 'days').format('YYYY-MM-DD HH:mm'));

  });

  it('Should failed to borrow a book', async () => {
    const req = await supertest(server)
      .post('/api/books/borrow')
      .send({
        "book_code": "",
        "member_code": "",
      })
    
    expect(req.status).toBe(400);
    expect(req.error).toBeTruthy();
  });
})

describe('GET /api/books', () => {

  beforeEach(async () => {
    await prismaClient.book.create({
      data: {
        "code": "JK-45",
        "title": "Harry Potter",
        "author": "J.K Rowling",
        "stock": 1
      }
    })
  })

  afterEach(async () => {
    await prismaClient.book.deleteMany({
      where: {
        code: 'JK-45'
      }
    })
  })

  it('Should success to list the books', async () => {
    const req = await supertest(server)
      .get('/api/books')
      
    expect(req.status).toBe(200);
    expect(req.body.data).toBeTruthy();
    expect(req.body.data[0]).toHaveProperty('code')
  });
});