const userRouter = require('./UserRouter');
const postController = require('../controllers/posts');

module.exports = (app) => {
  app.get('/api', (req, res) => {
    res.send('Wecome to the Urban Applause API')
  });

  app.use('/api', userRouter)
}
