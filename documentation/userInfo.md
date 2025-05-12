# Get user info

Get editable user info

**URL** : [`user/getUserInfo`](../API/routes/user.js#L18)

**Method** : `GET`

**Auth required** : Yes

**Data input** : `headers : { userID }`

## Success Response

**Code** : `200 OK`

```json
{
    "info": {
        "name": "Alan",
        "lastname": "Espinosa",
        "email": "dev@examp.com",
        "avatar": "some link for 2a6c678e94234ab0-1747074521186.webp",
        "auth": "some link for auth2a6c678e94234ab0-1747075597455.webp"
    }
}
```
If the user has no avatar then:
```json
{
    "info": {
        "name": "Alan",
        "lastname": "Espinosa",
        "email": "dev@examp.com",
        "avatar": "",
        "auth": "some link for auth2a6c678e94234ab0-1747075597455.webp"
    }
}
```