# Edit Post

Edits all information of a post

**URL** : [`content/editPost`](../API/routes/create.js#L48)

**Method** : `POST`

**Auth required** : Yes

**Data input** : `body : { postID, title, description, quantity, price, availableFrom, availableTo }`

## Success Response

**Code** : `200 OK`

```json
{
    "message": "Post updated"
}
```