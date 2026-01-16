# User Registration Endpoint Documentation

## POST `/users/register`

### Description

Registers a new user in the system. This endpoint validates the input, creates a user, hashes the password, and returns the created user object along with an authentication token.

### Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `fullname.firstname`: String, required, minimum 3 characters
- `fullname.lastname`: String, required, minimum 3 characters
- `email`: String, required, must be a valid email address
- `password`: String, required, minimum 6 characters

### Responses

| Status Code | Description                                      | Response Body Example                |
|-------------|--------------------------------------------------|--------------------------------------|
| 201         | User registered successfully                     | `{ "user": { ... }, "token": "..." }`|
| 400         | Validation error (invalid or missing fields)      | `{ "errors": [ ... ] }`              |

### Example Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }'
```

### Example Successful Response (`201 Created`)

```json
{
  "user": {
    "_id": "664a1b2c3d4e5f6789012345",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": ""
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Example Error Response (`400 Bad Request`)

```json
{
  "errors": [
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    },
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
    // ...other errors
  ]
}
```
