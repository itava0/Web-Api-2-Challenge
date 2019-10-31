const express = require('express');
const commentsRouter = require('./components/comments-router.js');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<h2>Welcome to my website, please visit /api/posts to see a list of posts!</h2>`)
});

app.use('/api/posts', commentsRouter);

const port = process.env.PORT || 5000;
app.listen(port, ()=> {
  console.log(`\n*** Server Running on port ${port} ***\n`);
})