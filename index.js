const express = require('express');
const commentsRouter = require('./components/comments-router.js');
const app = express();

app.use(express.json());

app.use('/api/posts', commentsRouter);

app.listen(5000, ()=> {
  console.log('\n*** Server Running on http://localhost:5000 ***\n');
})