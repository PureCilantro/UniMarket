# Update user info

Update full name of an user

**URL** : [`user/updateUser`](../API/routes/user.js#L40)

**Method** : `POST`

**Auth required** : Yes

**Data input** : `body : { name, lastname, email }`

## Success Response

**Code** : `200 OK`

```json
{
    "message": "User updated"
}
```