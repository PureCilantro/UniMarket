# API documentation

This API runs on `http://localhost:3200/`.

All endpoints will return a code `400` with the message `Invalid Data` when the input data values are not met exactly
And return a code `500` with message `Internal server error` when there was a backend error.

## Open endpoints

Open endpoints that require no Authentication.

### Platform access `login/`

* [Register](register.md) : [`POST login/register`](../API/routes/login.js#L10)
* [Login](login.md) : [`POST login/`](../API/routes/login.js#L36)
* [Get API token](token.md) : [`GET login/getToken`](../API/routes/login.js#L56)

<br>

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header `authorization` of the
request with the format:
```json
"authorization" : "bearer XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```
A Token can be acquired from the getToken endpoint above and **one is needed per operation**, their expTime will be 5 seconds.

## Error Responses

**Condition** : The token provided was invalid.

**Code** : `401 Unauthorized`

```json
{
    "message": "Invalid token"
}
```
<br>

**Condition** : No token was provided.

**Code** : `401 Unauthorized`

```json
{
    "message": "No token provided"
}
```

<br>

### User information and edition `user/`

#### Error Responses

**Condition** : The information requested doesn't match the token owner.

**Code** : `401 Unauthorized`

```json
{
    "message": "Invalid credentials"
}
```

<br>

* [Get user info](userInfo.md) : [`GET user/getUserInfo`](../API/routes/user.js#L18)
* [Update user info](updateUser.md) : [`POST user/updateUser`](../API/routes/user.js#L40)
* [Update user password](password.md) : [`POST user/updatePass`](../API/routes/user.js#L58)
* [Update user avatar](avatar.md) : [`POST user/updateAvatar`](../API/routes/user.js#L77)
* [Update user authentication image](auth.md) : [`POST user/updateAuth`](../API/routes/user.js#L102)

### Content access

### Post creation

### Post edition

