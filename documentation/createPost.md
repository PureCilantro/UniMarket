# Post a post

Posts a post, returns `postID`

**URL** : [`content/postPost`](../API/routes/create.js#L17)

**Method** : `POST`

**Auth required** : Yes

**Data input** : `body : { title, description, quantity, price, availableFrom, availableTo, categories, files }`

**Note** : `availableFrom` and `availableTo` are 4 digit numbers that represent time in 24hr format `1130`, `2300`, `1256`.
`categories` is a string of one or more `categoryID`'s : `1`, `11,6,9`. 
`files` is an array of files corresponding to the images of the post.

## Success Response

**Code** : `201 Created`

```json
{
    "message": "Post created",
    "ID": "5"
}
```