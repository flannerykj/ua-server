const express = require('express');
const authController = require('../controllers/auth');
const postController = require('../controllers/posts');
const artistController = require('../controllers/artists');
const photoController = require('../controllers/images');

const { access } = require('../utilities/restrict');
const { RESOURCES, ACTIONS } = require('../Roles');

const router = express.Router({ mergeParams: true });

router.route('/register')
  .post(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    authController.register
  );

router.route('/login')
  .post(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    authController.login
  );

router.route('/posts')
  .get(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    postController.findAll
  )
  .post(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    postController.submitNew
  );
router.route('/posts/:id')
  .get(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    postController.findById
  )
  .delete(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    postController.deletePost
  );

router.route('/uploads')
  .post(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    photoController.uploadFiles
  );

router.route('/uploads/:filename')
  .get(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    photoController.getFile
  );

router.route('/artists')
  .get(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    postController.findAll
  )
  .post(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    postController.submitNew
  );
router.route('/artists/:id')
  .get(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    artistController.findById
  )
  .put(
    access(ACTIONS.UPDATE_OWN, RESOURCES.USER),
    artistController.updateById
  );

module.exports = router;

/*
  app.post('/api/register', auth.register);
  app.post('/api/login', auth.login);

  app.get('/api/posts', posts.findAll);
  app.get('/api/posts/:id', posts.findById);
  app.post('/api/posts/:id/applaud', posts.applaudPost);
  app.post('/api/posts', [jwtauth], posts.submitNew);
  app.delete('/api/posts/:id', [jwtauth], posts.deletePost);

  app.post("/api/upload", images.uploadFiles);
  app.get("/api/uploads/:filename",  images.getFile);

  app.get('/api/comments/:post_id', comments.findByPostId);
  app.post('/api/comments', [jwtauth], comments.submitNew);
  app.delete('/api/comments/:id', [jwtauth], comments.deleteComment);

  app.get('/api/artists', artists.findAll);
  app.get('/api/artists/:id', artists.findById);
  app.post('/api/artists', [jwtauth], artists.submitNew);
  app.put('/api/artists/:id', [jwtauth], artists.updateById);

  app.get('/api/users', users.findAll);
  app.get('/api/users/:id', users.findById);
  app.post('/api/users', users.submitNew);
  app.put('/api/users/:id', [jwtauth], users.updateById);
}
*/
