# Book API Spec

## Create Book API

Endpoint: POST /api/books

Request body : 
```json 
{
  "code": "JK-45",
  "title": "Harry Potter",
  "author": "J.K Rowling",
  "stock": 1
}
```

Response Body Success :
```json 
{
  "meta": {
    "success": true,
    "code": 200,
    "message": "Success to create book"
  },
  "data": {
    "code": "JK-45",
    "title": "Harry Potter",
    "author": "J.K Rowling",
    "stock": 1
  }
}
``` 

Response Body Error :
```json 
{
  "meta": {
    "success": false,
    "code": 400,
    "message": "Failed to create book"
  },
  "data": null
}
``` 

## Borrow Book API

Endpoint: POST /api/books/borrow

Request body : 
```json 
{
  "book_code": "JK-45",
  "member_code": "M001"
}
```

Response Body Success :
```json 
{
  "meta": {
    "success": true,
    "code": 200,
    "message": "Success to borrow book"
  },
  "data": {
    "book_code": "JK-45",
    "member_code": "M001"
  }
}
``` 

Response Body Error :
```json 
{
  "meta": {
    "success": false,
    "code": 400,
    "message": "Failed to borrow book"
  },
  "data": null
}
``` 

## Return Book API

Endpoint: POST /api/books/return

Request body : 
```json 
{
  "book_code": "JK-45",
  "member_code": "M001"
}
```

Response Body Success :
```json 
{
  "meta": {
    "success": true,
    "code": 200,
    "message": "Success to return book"
  },
  "data": {
    "book_code": "JK-45",
    "member_code": "M001"
  }
}
``` 

Response Body Error :
```json 
{
  "meta": {
    "success": false,
    "code": 400,
    "message": "Failed to return book"
  },
  "data": null
}
``` 


## List Books API

Endpoint: GET /api/books


Response Body Success :
```json 
{
  "meta": {
    "success": true,
    "code": 200,
    "message": "Success to list books"
  },
  "data": [
    {
        "code": "JK-45",
        "title": "Harry Potter",
        "author": "J.K Rowling",
        "stock": 1
    },
    {
        "code": "SHR-1",
        "title": "A Study in Scarlet",
        "author": "Arthur Conan Doyle",
        "stock": 1
    },
    {
        "code": "TW-11",
        "title": "Twilight",
        "author": "Stephenie Meyer",
        "stock": 1
    },
    {
        "code": "HOB-83",
        "title": "The Hobbit, or There and Back Again",
        "author": "J.R.R. Tolkien",
        "stock": 1
    },
    {
        "code": "NRN-7",
        "title": "The Lion, the Witch and the Wardrobe",
        "author": "C.S. Lewis",
        "stock": 1
    },
]
}
``` 

Response Body Error :
```json 
{
  "meta": {
    "success": false,
    "code": 400,
    "message": "Failed to list books"
  },
  "data": null
}
``` 

## List Borrowed Books API

Endpoint: GET /api/books/borrow


Response Body Success :
```json 
{
  "meta": {
    "success": true,
    "code": 200,
    "message": "Success to list borrowed books"
  },
  "data": [
    {
        "id": 1,
        "book_code": "JK-45",
        "member_code": "Harry Potter",
        "book": {
          "title": "Harry Potter",
          "code": "JK-45",
          "stock": 1
        },
        "member": {
          "code": "M001",
          "name": "Angga",
        }

    },
  ]
}
``` 

Response Body Error :
```json 
{
  "meta": {
    "success": false,
    "code": 400,
    "message": "Failed to list borrowed books"
  },
  "data": null
}
``` 