# Delete Image from post

Deletes an image from the post

**URL** : [`content/deletePostImage`](../API/routes/create.js#L153)

**Method** : `POST`

**Auth required** : Yes

**Data input** : `body : { postID, fileName }`

## Success Response

**Code** : `200 OK`

```json
{
    "message": "Post image deleted"
}
```