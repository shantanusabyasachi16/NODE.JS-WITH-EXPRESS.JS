/*
Database software refers to software applications designed to store, manage, and retrieve data efficiently.
These software solutions provide mechanisms for creating, querying, updating, and deleting data, ensuring data integrity,
security, and reliability.
 Databases are crucial for various applications, ranging from simple to complex systems,
*/

//MongoDB is a NoSQL, document-oriented database designed for high performance, high availability, and easy scalability.
// It stores data in flexible, JSON-like documents, which means fields can vary from document to document and data structure can change over time.
const bodyParser = require('body-parser');
const express = require('express');
//const bodyparser = require('body-parser')
//const cors = require('cors')
const jwt = require('jsonwebtoken');//library helps to encrypt and dicrypt the objects or strings
const mongoose = require('mongoose');//mongoose is a library helps to connect to mongo db databses ...its privides an API which helps to store ,access and delete data from the databses
const app = express();

app.use(express.json());
//app.use (bodyParser.json());
// app.use(cors());

const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

// Define mongoose schemas
//mongoose.Schema lets you defina a schema,what is the shape of the data which gets in the datbases
const userSchema = new mongoose.Schema({
  username: {type: String},
  password: String,

  // it stores a refrence of the courses not the copy  becauses in future if admin will update anything in this course,it will be also upadted here
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

// Define mongoose models
const User = mongoose.model('User', userSchema);//this is user collections
const Admin = mongoose.model('Admin', adminSchema);//this is admin collections
const Course = mongoose.model('Course', courseSchema);//this is courses collections


//middleware function
//
const authenticateJwt = (req, res, next) => {

  const authHeader = req.headers.authorization;//This line extracts the authorization header from the incoming request's headers
  if (authHeader) {

    //The split(' ') method is called on the authHeader string
    //The authorization header typically follows the format: Bearer <token>
   
   //[1]:In the Authorization header "Bearer <token>", the token is the second part of the split string.
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose.connect('mongodb+srv://shantanuswain23:*****@cluster0.eksny7k.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body;
  function callback(admin) {
    if (admin) {
      res.status(403).json({ message: 'Admin already exists' });
    } else {
      const obj = { username: username, password: password };
      const newAdmin = new Admin(obj);
      newAdmin.save();
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Admin created successfully', token });
    }

  }
  Admin.findOne({ username }).then(callback);
});
 
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({published: true});
  res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
