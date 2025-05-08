## Notes



### users

|field|type|description|
|-----|-----|-----|
|userID|VARCHAR(32)|unique ID for the user|
|userKey|VARCHAR(32)|changing key for authentication|
|name|VARCHAR(50)|first name of the user|
|lastname|VARCHAR(50)|last name of the user|
|email|VARCHAR(50)|institutional email of the user|
|password|VARCHAR(64)|bcrypt hash of the password|

### userImageDetails

|field|type|description|
|-----|-----|-----|
|userID|VARCHAR(32)|ID of the owner user|
|fileName|VARCHAR(50)|type of image and hash|

### posts

|field|type|description|
|-----|-----|-----|
postID|INT|incrementing ID|
userID|VARCHAR(32)|ID of the owner user|
title|VARCHAR(50)|title of the post|
description|VARCHAR(100)|description of the post|
quantity|TINYINT|quantity of the items posted|
price|INT|price of the item|
availableFrom|SMALLINT|24hr format number|
availableTo|SMALLINT|24hr format number|
active|TINYINT(1)|bool value for post serving|

### postImageDetails

|field|type|description|
|-----|-----|-----|
|postID|INT|ID of the owner post|
|fileName|VARCHAR(50)|type of image and hash|


### categories

|field|type|description|
|-----|-----|-----|
categoryID|SMALLINT|unique ID if the category|
name|VARCHAR(25)|name of the category|

### postCategoryDetails

|field|type|description|
|-----|-----|-----|
postID|INT|ID of the owner post|
categoryID|SMALLINT|ID of the category|