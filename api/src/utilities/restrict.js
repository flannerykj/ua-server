const accessControl = require('../Roles');
const logger = require('../utilities/logger');
const { AccessDeniedError, BadRequestError, NotFoundError } = require('../utilities/errors');

function access (action, resource) {
  return (req, res, next) => {
    const user = req.admin || req.user;
    const permission = accessControl.can(req.decoded.role.toLowerCase())[action](resource);
    if (permission.granted) {
      logger.info(`UA_ACCESS: User ${user.id} permitted to ${action} ${resource} as ${req.decoded.role}` +
        ` ${JSON.stringify(req.params)}, ${JSON.stringify(req.query)}`);
      req.permission = permission;
      next();
    } else {
      next(new AccessDeniedError(`User ${user.id} cannot ${action} ${resource} as ${req.decoded.role}`));
    }
  };
}

module.exports = {
  access
}
