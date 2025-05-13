# Add image to post

Add an image to a post

**URL** : [`content/addPostImage`](../API/routes/create.js#L127)

**Method** : `POST`

**Auth required** : Yes

**Data input** : `body : { postID, file }`

## Success Response

**Code** : `200 OK`

```json
{
    "message": "Post image added"
}
```