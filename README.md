# E-Commerce REST API

## Summary
The goal of this project was to create a REST API for e-commerce website.

## Project Objectives
1. Build a functioning e-commerce REST API using Express, Node.js, and Postgres.
1. Allow users to register and log in via the API.
1. Allow CRUD operations on products.
1. Allow CRUD operations on user accounts.
1. Allow CRUD operations on user carts.
1. Allow a user to place an order.
1. Allow CRUD operations on orders.
1. Document the API using Swagger.

## Features
### User Authentication
For user registration. User's sent a post request to the /register endpoint and using bcrypt user passwords are hashed before they are then stored in the e-commerce databased. When a user logins in to e-commerce app, a post request is sent to /login endpoint. We then use passport.js with a Local strategy to authenticate the user.
### Products
All available products can be retrieved with a get request to the /products endpoint and individual products can be retrieved by get requests to the products/:id endpoint.
### Users
A user's information can be accessed by sending a get request to the endpoint /users/:id. User is checked to see if the id contained in req.user object matches id in the request. Then user information is returned if previous check passes. Users can also change user information by sending a put request to the same endpoint.
### Cart
A get request to /cart endpoint renders the user's cart. A post request to cart/:productId adds a product to the user's cart. If this is the first call to product endpoint the middleware for this route instantiates the user's cart as an empty array. This empty array is added to the req.session object created with express-session. Finally, a post request to the /cart/checkout endpoint converts all the products in the user's cart into order and this order is added to the store database.
### Orders
A get request to the /orders endpoint retrieves all orders made by the current logged in user. A get request to the /orders/:id enpoin retrieves a specific order the user has made which matches url parameter id.
### E-commerce Database
The databse consisted of 5 tables:
- orders
    - id
    - userid
    - total
- orders_products
    - order_id
    - product_id
    - quantity
- products
    - id
    - name
    - quantity
    - price
    - category
- session
    - sid
    - sess
    - expire
- users
    - id
    - name
    - password

## Future Work
- Add a column to users table which provides information on whether a user is an admin. Use this to add routes for allowing certain users to add/ remove products.
- Connect a real frontend to the application to create a full stack application.