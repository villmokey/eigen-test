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

describe('GET /api/books', () => {
  
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

  it('Should success to list the books that not being borrowed', async () => {

    const req = await supertest(server)
      .get('/api/books')

    expect(req.status).toBe(200);
    expect(req.body.data).toBeTruthy();
  });
});

describe('POST /api/books/borrow', () => {

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

  })

  afterEach(async () => {
    await prismaClient.transaction.deleteMany({})
    await prismaClient.book.deleteMany({})
    await prismaClient.member.deleteMany({})
  })

  it('Should success to borrow a book if a member have never borrow before', async () => {
    const req = await supertest(server)
      .post('/api/books/borrow')
      .send({
            "member_code": "M001",
            "book_codes": ["JK-45"],
          })

    expect(req.status).toBe(200);
    expect(req.body.data[0].book_code).toBe('JK-45');
    expect(req.body.data[0].member_code).toBe('M001');
    expect(dayjs(req.body.data[0].borrowed_date).format('YYYY-MM-DD HH:mm')).toBe(dayjs().format('YYYY-MM-DD HH:mm'));
    expect(dayjs(req.body.data[0].return_date).format('YYYY-MM-DD HH:mm')).toBe(dayjs().add(7, 'days').format('YYYY-MM-DD HH:mm'));

  });

  it('Should success to borrow 2 books if a member have never borrow before and the book stocks should decreased', async () => {
    const borrowReq = await supertest(server)
      .post('/api/books/borrow')
      .send({
            "member_code": "M001",
            "book_codes": ["JK-45", "SHR-1"],
          })
    
    expect(borrowReq.status).toBe(200);
    expect(borrowReq.body.data[0].book_code).toBe('JK-45');
    expect(borrowReq.body.data[0].member_code).toBe('M001');
    expect(dayjs(borrowReq.body.data[0].borrowed_date).format('YYYY-MM-DD HH:mm')).toBe(dayjs().format('YYYY-MM-DD HH:mm'));
    expect(dayjs(borrowReq.body.data[0].return_date).format('YYYY-MM-DD HH:mm')).toBe(dayjs().add(7, 'days').format('YYYY-MM-DD HH:mm'));
  });

  it('Should success to borrow a book if a member have borrowed a book and want to borrow another book with a different title', async () => {
    await prismaClient.transaction.create({
      data: {
        book_code: 'JK-45',
        member_code: 'M001',
        return_date: dayjs().add(7, 'days').toISOString()
      }
    })

    const req = await supertest(server)
    .post('/api/books/borrow')
    .send({
      "member_code": "M001",
      "book_codes": ["SHR-1"],
    })

    expect(req.status).toBe(200);
    expect(req.body.data[0].book_code).toBe('SHR-1');
    expect(req.body.data[0].member_code).toBe('M001');
    expect(dayjs(req.body.data[0].borrowed_date).format('YYYY-MM-DD HH:mm')).toBe(dayjs().format('YYYY-MM-DD HH:mm'));
    expect(dayjs(req.body.data[0].return_date).format('YYYY-MM-DD HH:mm')).toBe(dayjs().add(7, 'days').format('YYYY-MM-DD HH:mm'));
  })

  it('Should failed to borrow more than 2 books', async () => {
    const req = await supertest(server)
      .post('/api/books/borrow')
      .send({
            "member_code": "M001",
            "book_codes": ["JK-45", "SHR-1", "TW-11", "HOB-83"],
          })
  
      expect(req.status).toBe(400);
      expect(req.error).toBeTruthy();
  });

  it('Should failed to borrow if member borrow the same 2 books in a row', async () => {
    const req = await supertest(server)
      .post('/api/books/borrow')
      .send({
            "member_code": "M001",
            "book_codes": ["JK-45", "JK-45"],
          })
  
      expect(req.status).toBe(400);
      expect(req.error).toBeTruthy();
  });

  it('Should failed to borrow a book if a member have borrowed 2 books and want to borrow another book', async () => {
    await prismaClient.transaction.createMany({
      data: [
        {
          book_code: 'JK-45',
          member_code: 'M001',
          return_date: dayjs().add(7, 'days').toISOString()
        },
        {
          book_code: 'SHR-1',
          member_code: 'M001',
          return_date: dayjs().add(7, 'days').toISOString()
        }
      ]
    })

    const req = await supertest(server)
    .post('/api/books/borrow')
    .send({
      "member_code": "M001",
      "book_codes": ["TW-11"],
    })

    expect(req.status).toBe(400);
    expect(req.error).toBeTruthy();
  })

  it('Should failed to borrow a book if a member is being penalized', async () => {
    await prismaClient.member.update({
      where: {
        code: 'M001'
      },
      data: {
        is_penalize: true
      }
    })

    const req = await supertest(server)
      .post('/api/books/borrow')
      .send({
        "member_code": "M001",
        "book_codes": ["JK-45"],
      })

    expect(req.status).toBe(400);
    expect(req.error).toBeTruthy();

  });

  it('Should failed to borrow a book if the book is out of stock', async () => {
    await prismaClient.book.update({
      where: {
        code: 'JK-45'
      },
      data: {
        stock: 0
      }
    })

    const req = await supertest(server)
      .post('/api/books/borrow')
      .send({
        "member_code": "M001",
        "book_codes": ["JK-45"],
      })

    expect(req.status).toBe(400);
    expect(req.error).toBeTruthy();

  });

  it('Should failed to borrow a book if field is empty', async () => {
    const req = await supertest(server)
      .post('/api/books/borrow')
      .send({
        "member_code": "",
        "book_codes": [],
      })
    
    expect(req.status).toBe(400);
    expect(req.error).toBeTruthy();
  });
})

describe('GET /api/books/return', () => {
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

  })

  afterEach(async () => {
    await prismaClient.transaction.deleteMany({})
    await prismaClient.book.deleteMany({})
    await prismaClient.member.deleteMany({})
  })

  it('Should success to return book if a member borrowed 2 books', async () => {
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

    const req = await supertest(server)
      .post('/api/books/return')
      .send({
        "member_code": "M001",
        "book_codes": ["JK-45", "SHR-1"],
      })

    expect(req.status).toBe(200);
    expect(req.body.data.count).toBe(2);

  })

  it('Should success to return but member got penalized', async () => {
    await prismaClient.transaction.createMany({
      data: [
        {
          member_code: 'M001',
          book_code: 'JK-45',
          borrowed_date: dayjs('2024-07-13').toISOString(),
          return_date: dayjs('2024-07-20').toISOString()
        },
        {
          member_code: 'M001',
          book_code: 'SHR-1',
          return_date: dayjs().add(7, 'days').toISOString()
        },
      ]
    });

    const req = await supertest(server)
      .post('/api/books/return')
      .send({
        "member_code": "M001",
        "book_codes": ["JK-45", "SHR-1"],
      })

    expect(req.status).toBe(200);
    expect(req.body.data.count).toBe(2);
    expect(req.body.data.penalize_until).toBeDefined()
  })

  it('Should failed to return if the book is not the book that being borrowed', async () => {
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

    const req = await supertest(server)
      .post('/api/books/return')
      .send({
        "member_code": "M001",
        "book_codes": ["HOB-83"],
      })

      expect(req.status).toBe(400);
      expect(req.error).toBeTruthy();
  })

  it('Should failed to return book if the field is empty', async () => {
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

    const req = await supertest(server)
      .post('/api/books/return')
      .send({
        "member_code": "",
        "book_codes": [],
      });

      expect(req.status).toBe(400);
      expect(req.error).toBeTruthy();
  })


})