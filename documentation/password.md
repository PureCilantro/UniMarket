# Update password

Change old password with new one

**URL** : [`user/updatePass`](../API/routes/user.js#L58)

**Method** : `POST`

**Auth required** : Yes

**Data input** : `body : { name, lastname, email }`

## Success Response

**Code** : `200 OK`

```json
{
    "message": "Password updated"
}
```