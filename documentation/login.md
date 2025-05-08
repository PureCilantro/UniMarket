# Login into the platform

Checks credentials and returns temporal password bool, role id and user key.

**URL** : [`/login`](../API/routes/login.js#L36)

**Method** : `POST`

**Auth required** : No

**Data input** : `body : { email, password }`

## Success Response

**Condition** : Data provided is valid and User is Authenticated.

**Code** : `200 OK`

```json
{
    "userKey": "10fca505e95290554d4b85deb0e90b12"
}
```

## Error Response

**Condition** : Data provided is not valid.

**Code** : `401 Unauthorized`

```json
{
    "message": "Invalid credentials"
}
```