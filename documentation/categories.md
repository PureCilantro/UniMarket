# Get all categories

Gets all categories and their IDs

**URL** : [`content/getCategories`](../API/routes/content.js#L17)

**Method** : `GET`

**Auth required** : Yes

**Data input** : None

## Success Response

**Code** : `200 OK`

```json
[
    {
        "categoryID": 1,
        "name": "Libros de texto"
    },
    {
        "categoryID": 2,
        "name": "Papelería"
    },
    ...
    {
        "categoryID": n,
        "name": "Electrónica"
    }
]
```