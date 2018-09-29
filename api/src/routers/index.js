const userRouter = require('./UserRouter');

module.exports = (app) => {

  app.get('/api', (req, res) => {
    res.send('Welcome to the Urban Applause API')
  });

  app.use('/api', userRouter)
}
