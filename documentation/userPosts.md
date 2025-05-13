# Get user posts

Gets all posts from a user

**URL** : [`content/getUserPosts`](../API/routes/content.js#L76)

**Method** : `GET`

**Auth required** : Yes

**Data input** : `headers : { userID }`

## Success Response

**Code** : `200 OK`

```json
[
    {
        "postID": 1,
        "title": "Cilantro",
        "description": "Manojito de cilantro",
        "quantity": 20,
        "price": 1,
        "availableFrom": 1000,
        "availableTo": 1400,
        "active": 1,
        "images": [
            "2a6c678e94234ab0-1747153488971.webp"
        ],
        "categories": [
            {
                "id": 4
            }
        ]
    },
    {
        "postID": 4,
        "title": "Cilantro viejo",
        "description": "Manojito de cilantro",
        "quantity": 20,
        "price": 1,
        "availableFrom": 1000,
        "availableTo": 1400,
        "active": 1,
        "images": [
            "2a6c678e94234ab0-1747153781252.webp"
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
    },
    {
        "postID": 5,
        "title": "Cilantro muy viejo",
        "description": "Manojito de cilantro",
        "quantity": 20,
        "price": 1,
        "availableFrom": 1000,
        "availableTo": 1400,
        "active": 1,
        "images": [
            "2a6c678e94234ab0-1747153978497.webp"
        ],
        "categories": [
            {
                "id": 15
            },
            {
                "id": 3
            },
            {
                "id": 7
            },
            {
                "id": 11
            }
        ]
    }
]
```