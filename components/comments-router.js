const router = require('express').Router();
const db = require("../data/db.js");

// POST to create a new post
router.post("/", (req, res) => {
    const newPost = req.body;

    if (!newPost.title || !newPost.contents){
      return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db.insert(newPost)
    .then(data => res.status(201).json(newPost))
    .catch(err => {
        res.status(500).json({ message: "There was an error while saving the post to the database." })
    })
})



module.exports = router;