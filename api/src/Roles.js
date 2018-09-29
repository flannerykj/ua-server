const AccessControl = require('accesscontrol');

const ac = new AccessControl();

const ACTIONS = {
  CREATE_OWN: 'createOwn',
  READ_OWN: 'readOwn',
  UPDATE_OWN: 'updateOwn',
  DELETE_OWN: 'deleteOwn',
  CREATE_ANY: 'createAny',
  READ_ANY: 'readAny',
  UPDATE_ANY: 'updateAny',
  DELETE_ANY: 'deleteAny'
};

const RESOURCES = {
  POST: 'post',
  ARTIST: 'artist',
  USER: 'user',
  COMMENT: 'comment',
  APPLAUSE: 'applause',
  PHOTO: 'photo'
}

ac.grant('user')
  .resource(RESOURCES.USER)
    .createOwn()
    .readOwn()
    .updateOwn()
  .resource(RESOURCES.POST)
    .createOwn()
    .readOwn()
    .updateOwn()
    .deleteOwn()
  .resource(RESOURCES.COMMENT)
    .createOwn()
    .readOwn()
    .updateOwn()
    .deleteOwn()
  .resource(RESOURCES.APPLAUSE)
    .createOwn()
    .readOwn()
    .updateOwn()
    .deleteOwn()
  .resource(RESOURCES.PHOTO)
    .createOwn()
    .readOwn()
    .deleteOwn()

module.exports = ac;
module.exports.ACTIONS = ACTIONS;
module.exports.RESOURCES = RESOURCES;
