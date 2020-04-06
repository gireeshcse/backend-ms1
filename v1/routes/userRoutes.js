'use strict';
module.exports = function(app) {
  var user = require('../controllers/userController');

  // user Routes
  app.route('/api/v1/users')
    .get(user.get_all_users)
    .post(user.create_a_user);

  app.route('/api/v1/authenticate')
    .post(user.authenticate_a_user);


  app.route('/api/v1/user/:userId')
    .get(user.get_a_user)
    .put(user.update_a_user)
    .delete(user.delete_a_user);

  app.get('/api/v1/user/',user.get_a_user);

};