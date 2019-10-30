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

// POST to add a new comment on a post
router.post("/:id/comments", (req, res) => {
    const id = req.params.id;
    const comment = {...req.body, post_id: id};

    !comment.text && res.status(400).json({ errorMessage: "Please provide text for the comment." })

    // Check if ID exists
    db.findById(id)
    .then(post => {
        // IF ID exists, then add the comment
        if (post.length) {
            db.insertComment(comment)
            .then(data => res.status(201).json(comment))
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the comment to the database." })
            })
        // Otherwise, return error that the post doesn't exist
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } 
    })

})



module.exports = router;