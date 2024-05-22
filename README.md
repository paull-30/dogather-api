# API Routes For Dogather

## Authentication Routes

### Register a New User
- Route: `/api/auth/register`
- Method: `POST`
- Description: Registers a new user in the application.
- Request Body:
 ```json
 {
   "username":"string",
   "email":"string",
   "password":"string",
   "confirmPassword":"string"
 }
```
### User Login
- Route: `/api/auth/login`
- Method: `POST`
- Description: Allows an existing user to log in to the application.
- Request Body:
```json
{
    "username":"string",
    "password":"string"
}
```
### User Logout
- Route: `/api/auth/logout`
- Method: `POST`
- Description: Logs out the currently authenticated user from the application.

## User Routes

### Get All Users
- Route: `/api/users`
- Method: `GET`
- Description: Retrieves a list of all users in the application.
- Authentication: Requires a valid JSON Web Token (JWT).

### Display Recommended Posts Based on User Skills
- Route: `/api/users/recommended`
- Method: `GET`
- Description: Displays a list of recommended posts based on the authenticated user's skills.
- Authentication: Requires a valid JSON Web Token (JWT).

### Get Accepted Posts
- Route: `/api/users/accepted`
- Method: `GET`
- Description: Retrieves a list of posts that the authenticated user has joined.
- Authentication: Requires a valid JSON Web Token (JWT).

### Display Invitations
- Route: `/api/users/invitations`
- Method: `GET`
- Description: Displays a list of invitations for the authenticated user to join posts.
- Authentication: Requires a valid JSON Web Token (JWT).

### Accept Post
- Route: `/api/users/accept/:postId`
- Method: `POST`
- Description: Allows the authenticated user to accept an invitation to join a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Reject Post Invitation
- Route: `/api/users/reject/:postId`
- Method: `POST`
- Description: Allows the authenticated user to reject an invitation to join a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Update User
- Route: `/api/users/:userId`
- Method: `PUT`
- Request Body :
```json
{
    "username":"string",
    "email":"string",
    "bio":"string",
    "role":"string",
    "skills":["string"],
    "password":"string",
}
```
- Description: Updates the profile information of a specific user.
- Authentication: Requires a valid JSON Web Token (JWT).

### Delete User
- Route: `/api/users/:userId`
- Method: `DELETE`
- Description: Deletes a specific user from the application.
- Authentication: Requires a valid JSON Web Token (JWT).

## Post Routes

### Get All Posts
- Route: `/api/posts`
- Method: `GET`
- Description: Retrieves a list of all posts in the application.
- Authentication: Requires a valid JSON Web Token (JWT).

### Display Users Who Applied to a Post
- Route: `/api/posts/:id/applicants`
- Method: `GET`
- Description: Displays a list of users who have applied to a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Display Users Working on a Post
- Route: `/api/posts/:id/accepted`
- Method: `GET`
- Description: Displays a list of users who have been accepted to work on a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Display Recommended Users Based on Skills
- Route: `/api/posts/:id/recommended`
- Method: `GET`
- Description: Displays a list of recommended users based on their skills for a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Get Post by ID
- Route: `/api/posts/:id`
- Method: `GET`
- Description: Retrieves a specific post by its ID.
- Authentication: Requires a valid JSON Web Token (JWT).

### Create New Post
- Route: `/api/posts/create`
- Method: `POST`
- Description: Creates a new post in the application.
- Request Body :
```json
{
    "title":"string",
    "description":"string",
    "searching_for_skills": ["string"]
}
```
- Authentication: Requires a valid JSON Web Token (JWT).

### Invite User to Post
- Route: `/api/posts/:id/invite/:username`
- Method: `POST`
- Description: Invites a user to join a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Apply to Post
- Route: `/api/posts/:id/apply`
- Method: `POST`
- Description: Allows a user to apply to join a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Accept User Application
- Route: `/api/posts/:id/accept/:userId`
- Method: `POST`
- Description: Accepts a user's application to join a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Reject User Application
- Route: `/api/posts/:id/reject/:userId`
- Method: `POST`
- Description: Rejects a user's application to join a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Update Post
- Route: `/api/posts/:id`
- Method: `PUT`
- Description: Updates a specific post.
- Request Body: 
```json
{
    "title":"string",
    "description":"string",
    "searching_for_skills": ["string"],
    "status": enum("OPEN","CLOSED")
}
```
- Authentication: Requires a valid JSON Web Token (JWT).

### Delete Post
- Route: `/api/posts/:id`
- Method: `DELETE`
- Description: Deletes a specific post from the application.
- Authentication: Requires a valid JSON Web Token (JWT).

## Task Routes

### Display Tasks
- Route: `/api/posts/:id/tasks`
- Method: `GET`
- Description: Retrieves a list of tasks associated with a specific post.
- Authentication: Requires a valid JSON Web Token (JWT).

### Get Task
- Route: `/api/posts/:id/tasks/:taskId`
- Method: `GET`
- Description: Retrieves a specific task by its ID.
- Authentication: Requires a valid JSON Web Token (JWT).

### Create Task
- Route: `/api/posts/:id/tasks/new`
- Method: `POST`
- Description: Creates a new task associated with a specific post.
- Request Body: 
```json
{
    "title":"string",
    "description":"string",
    "deadline": "date",
    "assigned":"string"
    
}
```
- Authentication: Requires a valid JSON Web Token (JWT).

### Update Task
- Route: `/api/posts/:id/tasks/update/:taskId`
- Method: `PUT`
- Description: Updates a specific task.
- Request Body: 
```json
{
    "title":"string",
    "description":"string",
    "deadline": "date",
    "assigned":"string",
    "status": enum("not_started","in_progress","completed")
    
}
```
- Authentication: Requires a valid JSON Web Token (JWT).

### Update Task Status
- Route: `/api/posts/:id/tasks/update/:taskId/status`
- Method: `PUT`
- Description: Updates the status of a specific task.
- Request Body: 
```json
{
    "status": enum("not_started","in_progress","completed")
}
```
- Authentication: Requires a valid JSON Web Token (JWT).

### Delete Task
- Route: `/api/posts/:id/tasks/delete/:taskId`
- Method: `DELETE`
- Description: Deletes a specific task.
- Authentication: Requires a valid JSON Web Token (JWT).
