const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});


// Internal endpoint for book data
public_users.get('/books', function (req, res) {
    res.json(books);
});


// Get the book list available in the shop
// Implemented using Axios and Async/Await
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/books');

        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books"
        });
    }
});


// Internal endpoint for individual book data
public_users.get('/books/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.json(books[isbn]);
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});


// Get book details based on ISBN
// Implemented using Axios and Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/books/${isbn}`);

        res.json(response.data);
    } catch (error) {
        res.status(404).json({
            message: "Book not found"
        });
    }
});
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
    const booksByAuthor = {};

    Object.keys(books).forEach(function (isbn) {
        if (books[isbn].author === author) {
            booksByAuthor[isbn] = books[isbn];
        }
    });

    res.send(JSON.stringify(booksByAuthor, null, 4));
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
    const booksByTitle = {};

    Object.keys(books).forEach(function (isbn) {
        if (books[isbn].title === title) {
            booksByTitle[isbn] = books[isbn];
        }
    });

    res.send(JSON.stringify(booksByTitle, null, 4));
});


// Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;