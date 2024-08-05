# Member API Spec

## List Members API

Endpoint: GET /api/members


Response Body Success :
```json 
{
  "meta": {
    "success": true,
    "code": 200,
    "message": "Success to list members"
  },
  "data": [
     {
        "code": "M001",
        "name": "Angga",
    },
    {
        "code": "M002",
        "name": "Ferry",
    },
    {
        "code": "M003",
        "name": "Putri",
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
    "message": "Failed to list members"
  },
  "data": null
}
```

## Create Member API

Endpoint: POST /api/members


Response Body Success :
```json 
{
  "meta": {
    "success": true,
    "code": 200,
    "message": "Success to create a member"
  },
  "data": {
    "code": "M001",
    "name": "Angga",
  },
}
``` 

Response Body Error :
```json 
{
  "meta": {
    "success": false,
    "code": 400,
    "message": "Failed to create a member"
  },
  "data": null
}
``` 