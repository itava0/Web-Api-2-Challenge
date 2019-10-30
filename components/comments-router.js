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

// GET all posts
router.get("/", (req, res) => {
    db.find()
    .then(posts => res.status(200).json(posts))
    .catch(err => {
        console.log("GET to root failed:", err)
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

// GET individual post by ID
router.get("/:id", (req, res) => {
    const id = req.params.id;

    db.findById(id)
    .then(post => {
        post.length
        ? res.status(200).json(post)
        : res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
    .catch(err => {
        console.log("GET by ID to root failed:", err)
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

// GET comments on an individual post
router.get("/:id/comments", (req, res) => {
    const id = req.params.id;

    db.findPostComments(id)
    .then(comments => {
        comments.length
        ? res.status(200).json(comments)
        : res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
    .catch(err => {
        console.log("GET comments on root failed:", err)
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

// DELETE post by ID
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.remove(id)
    .then(deleted => {
        deleted > 0
        ? res.status(200).json(deleted)
        : res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
    .catch(err => {
        console.log("DELETE on post failed:", err)
        res.status(500).json({ error: "The post could not be removed." })
    })
})

// PUT to edit a post
router.put("/:id", (req, res) => {
    const post = req.body;
    const id = req.params.id;

    if (!post.title || !post.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db.update(id, post)
    .then(updated => {
        // If updated exists, find that post by it's ID
        if (updated > 0) {
            db.findById(id)
            .then(post => res.status(200).json(post))
            .catch(err => res.status(500).json({ errorMessage: "The post with the specified ID does not exist." }))
        } else res.status(404).json({ errorMessage: "The post with the specified ID does not exist." })
    })
    .catch(err => {
        console.log("PUT request on post failed:", err)
        res.status(500).json({ error: "The post information could not be modified." })
    })
})

module.exports = router;