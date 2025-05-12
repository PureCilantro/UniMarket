# Get token to consume API

With a valid `userKey` return a token to consume the api

**URL** : [`login/getToken`](../API/routes/login.js#L56)

**Method** : `GET`

**Auth required** : No

**Data input** : `headers : { userKey }`

## Success Response

**Code** : `200 OK`

```json
{
    "token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```