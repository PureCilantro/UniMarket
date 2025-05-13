# Get post IDs

Gets all available post IDs

**URL** : [`content/getPostIDs`](../API/routes/content.js#L29)

**Method** : `GET`

**Auth required** : Yes

**Data input** : `headers : { time, categories }`

**Note** : `categories` can be not sent to get all post, or sent with category IDs separated by commas `1,15,4`

## Success Response

**Code** : `200 OK`

```json
[
    {
        "postID": 1
    },
    {
        "postID": 4
    },
    {
        "postID": 5
    }
]
```