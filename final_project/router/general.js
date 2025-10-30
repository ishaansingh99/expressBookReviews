const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require("axios");


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
public_users.get('/',async function (req, res) {
  // Task 1 and 10
  axios.get("http://localhost:5000/books").then(
    (responseBooks) => {
        return res.status(200).send(JSON.stringify(responseBooks.data,null,4));
    }
  ).catch(error => res.status(404).send("Can't get list of books"))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  // Task 2 and 11
  const isbn = req.params.isbn;

  try {
    const response = await axios.get("http://localhost:5000/books");

    if (response.data[isbn])
    {
        return res.status(200).send(JSON.stringify(response.data[isbn],null,4));
    } else 
    {
        return res.status(404).send("Book not found");
    }
 } catch (errror) {
    return res.status(500).send("Error");
 }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  // Task 3 and 12
  const author = req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/books");
    
    let filtered_books = Object.values(response.data).filter((book) => book.author === author);
    if (filtered_books.length === 0) {
      return res.status(404).send("No books found for the given author");
    } else {
      return res.status(200).send(JSON.stringify(filtered_books,null,4));
    }
  } catch (error) {
    return res.status(500).send("Error");
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  // Task 4 and 13
  const title = req.params.title;
  try {

    const response = await axios.get("http://localhost:5000/books");
    let filtered_books = Object.values(response.data).filter((book) => book.title === title);
    if (filtered_books.length === 0) {
        return res.status(404).send("No books found for the given title");
    } else {
        return res.status(200).send(JSON.stringify(filtered_books,null,4));
    }  
  } catch (error) {
    return res.status(500).send("Error");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Task 5
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).send("No books found for the given author");
  } else {
    return res.status(200).send(books[isbn].reviews);
  }
});

module.exports.general = public_users;
