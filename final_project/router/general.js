const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Task 6
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered."});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "No username and/or password provided"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Task 1
  res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Returned list of books"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Task 2
  const isbn = req.params.isbn;
  if (books[isbn])
  {
    return res.status(200).send(JSON.stringify(books[isbn],null,4));
  } else 
  {
    return res.status(404).send("Book not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Task 3
  const author = req.params.author;
  let filtered_books = Object.values(books).filter((book) => book.author === author);
  if (filtered_books.length === 0) {
    return res.status(404).send("No books found for the given author");
  } else {
    return res.status(200).send(JSON.stringify(filtered_books,null,4));
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Task 4
  const title = req.params.title;
  let filtered_books = Object.values(books).filter((book) => book.title === title);
  if (filtered_books.length === 0) {
    return res.status(404).send("No books found for the given title");
  } else {
    return res.status(200).send(JSON.stringify(filtered_books,null,4));
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Task 5
  const isbn = req.params.isbn;
  let filtered_books = Object.values(books).filter((book) => book.author === author);
  if (!books[isbn]) {
    return res.status(404).send("No books found for the given author");
  } else {
    return res.status(200).send(books[isbn].reviews);
  }
});

module.exports.general = public_users;
