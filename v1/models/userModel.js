var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var userSchema = new Schema({
    username:  {
        type: String,
        lowercase:true,
        trim:true,
        required:true,
        unique:true
    }, 
    firstname: String, // String is shorthand for {type: String}
    lastname: String,
    email: {
        type: String,
        lowercase:true,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    lastLogin: [
        { 
            info: String,
             date: Date 
        }
    ],
    createdAt: { 
        type: Date,
         default: Date.now
    },
    active: Boolean
  },
  {
      collection:process.env.MONGO_DB_COLLECTION
  });

//Indexes
// schema level username ascending order & email descending order
userSchema.index({ username: 1, email: -1 }); 

userSchema.methods.savedInfo = function () {
  var message = 'Account Created with username '+this.username + " Whose ID is " + this._id + " at "+ this.createdAt;
  console.log(message);
}

userSchema.virtual('fullName').get(function () {
  if(this.lastname === undefined)
    this.lastname = '';
  return this.firstname + ' ' + this.lastname;
}).
set(function(v) {
  this.firstname = v.substr(0, v.indexOf(' '));
  this.lastname = v.substr(v.indexOf(' ') + 1);
});


userSchema.statics.findByUsername = function(username,callback){
  return this.findOne({username : username},callback);
}

userSchema.statics.searchByUsername = function(username,callback){
  return this.find({username : new RegExp(username,'i')},callback);
}

userSchema.statics.findByEmail = async function(email,callback){
  return this.findOne({email : email},callback);
}

userSchema.methods.verifyPassword = function(password){
  if(bcrypt.compareSync(password, this.password)) {
    // Passwords match
    return true;
   } else {
    // Passwords don't match
    return false;
   }
}

userSchema.statics.verifyPasswordWithHash = function(password,hash){
  if(bcrypt.compareSync(password, hash)) {
    // Passwords match
    return true;
   } else {
    // Passwords don't match
    return false;
   }
}

userSchema.methods.generateToken = function(){
  return jwt.sign({ email: this.email,id:this._id,name:this.fullName }, process.env.JWT_SECRET);
}

userSchema.statics.generateTokenWithData = function(data){
  return jwt.sign(data, process.env.JWT_SECRET);
}

userSchema.statics.generateTokenStatic = function(){
  return jwt.sign({ email: this.email,id:this._id,name:this.fullName }, process.env.JWT_SECRET);
}

userSchema.statics.verifyToken = function(token)
{
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch(err) {
    // err
    return false;
  }
}

userSchema.static('generatePassword',function(password){
  return bcrypt.hashSync(password, 10);
});

userSchema.pre('save', function(next) {
  // do stuff
//   console.log('New Record Error');
//   console.log(this);
//   throw new Error({error:'New Record Error',others:this});
    console.log('before save');
    console.log(this.password);
    this.password = User.generatePassword(this.password);
    console.log(this.password);
     next();
});

userSchema.static('findActiveUsers',function(active=true){
  return this.find({active:active});
});

var User = mongoose.model('User', userSchema);

module.exports = User;