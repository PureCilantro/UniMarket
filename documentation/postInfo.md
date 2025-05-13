# Get Post Info

Gets all information of a single post

**URL** : [`content/getPostInfo`](../API/routes/content.js#L53)

**Method** : `GET`

**Auth required** : Yes

**Data input** : `headers : { postID }`

## Success Response

**Code** : `200 OK`

```json
{
    "postID": 4,
    "userID": "ec229c8134407efd2a6c678e94234ab0",
    "title": "Cilantro",
    "description": "Manojito de cilantro",
    "quantity": 20,
    "price": 1,
    "availableFrom": 1000,
    "availableTo": 1400,
    "active": 1,
    "images": [
        "2a6c678e94234ab0-1747153781252.webp",
        "2a6c678e94234ab0-1747156293445.webp",
        "2a6c678e94234ab0-1747156354162.webp"
    ],
    "categories": [
        {
            "id": 1
        },
        {
            "id": 3
        },
        {
            "id": 5
        },
        {
            "id": 6
        }
    ]
}
```