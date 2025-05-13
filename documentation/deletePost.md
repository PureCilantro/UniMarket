# Delete a post

Deletes a post

**URL** : [`content/deletePost`](../API/routes/create.js#L94)

**Method** : `POST`

**Auth required** : Yes

**Data input** : `body : { postID }`

## Success Response

**Code** : `200 OK`

```json
{
    "message": "Post deleted"
}
```