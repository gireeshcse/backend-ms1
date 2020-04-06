'use strict';


var mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.get_all_users = function(req, res) {
  User.find({}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.create_a_user = function(req, res) {
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.authenticate_a_user = function(req,res){
  console.log(req.body);
  User.findByEmail(req.body.email, function(err, user) {
    if (err)
      res.send(err);
    else
    {
      console.log(user);
      if(User.verifyPasswordWithHash(req.body.password,user.password))
      {
        var data = {
          email:user.email,
          id:user._id,
          name:user.firstname + ' ' + user.lastname
        };

        res.send({token:User.generateTokenWithData(data),user:user});  
      }else{
        res.send({error: 'Invalid password'})
      }
    }
  });

};

exports.get_a_user = function(req, res) {
  if(req.query.email !== undefined)
  {
    User.findByEmail(req.query.email, function(err, user) {
      if (err)
        res.send(err);
      console.log(user);
      if(user !== null)
      {
        var result = user.toJSON();
        delete result._id;
        delete result.__v;
        delete result.password;
        res.json(user);
      }else{
        res.status(500);
        res.send({error:'No record found'});
      }
      
    });
  }
  else if(req.query.username !== undefined)
  {
    User.findByUsername(req.query.username, function(err, user) {
      if (err)
        res.send(err);
      console.log(user);
      var result = user.toJSON();
      delete result._id;
      delete result.__v;
      delete result.password;
      res.json(user);
    });
  }
  else if(req.params.userId !== undefined)
  {
      User.findById(req.params.userId, function(err, user) {
        if (err)
          res.send(err);
        var result = user.toJSON();
        delete result._id;
        delete result.__v;
        delete result.password;
        res.json(user);
      });
  }
  else{
    res.statusCode = 404;
    res.send({'error':'route not found'});
  }
 
};


exports.update_a_user = function(req, res) {
  User.updateOne({_id: req.params.userId}, req.body, {upsert: true}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};


exports.delete_a_user = function(req, res) {

  User.deleteOne({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted' });
  });
};