# Register a new user

Registers user information.

**URL** : [`/login/register`](../API/routes/login.js#L10)

**Method** : `POST`

**Auth required** : No

**Data input** : `body : { name, lastname, email, password }`

## Success Response

**Condition** : Data provided is valid and User is Authenticated.

**Code** : `201 Created`

```json
{
    "message": "User registered"
}
```

## Error Response

**Condition** : Data provided is not valid.

**Code** : `400 Bad Request`

```json
{
    "message": "User already exists"
}
```