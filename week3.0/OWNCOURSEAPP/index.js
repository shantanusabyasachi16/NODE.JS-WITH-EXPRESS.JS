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

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const userSchema = new mongoose.Schema({
  username: {type: String},
  password: String,

  // it stores a refrence of the courses not the copy  becauses in future if admin will update anything in this course,it will be also upadted here
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]

// here, purchasedCourses: This is a field in the userSchema that stores an array
        // type: mongoose.Schema.Types.ObjectId: Specifies that each element in the purchasedCourses array will be of type ObjectId, which is a unique identifier automatically generated by MongoDB for each document.
        // ref: 'Course': Indicates that these ObjectId references are related to documents in the 'Course' collection.


});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

// Define mongoose models
// In Mongoose, a model is a constructor function that corresponds to a specific collection in your MongoDB database.
// so we need to pass the collection's name and the defined  schema to create the data model

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
      req.user = user;//. This makes the user's information available to subsequent middleware and route handlers.
      next();//This line calls the next function to pass control to the next middleware function in the stack.
    });
  } else {
    res.sendStatus(401);
  } 
};   

// Connect to MongoDB 
// DONT MISUSE THIS THANKYOU!!
mongoose.connect('mongodb+srv://shantanuswain23:tZNzGDYCQywwZ9vi@cluster0.eksny7k.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });


  // now let us define routes for Admin 
  // for signup

app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body; //  
  //const username = req.body.username
 // const password = req.body.password

 // This line uses the Admin model to search for an existing admin user with the same username.
 const admin = await Admin.findOne({username})

    if (admin) {
      res.status(403).json({ message: 'Admin already exists' });
    } else {

        // This line creates an object containing the retrieved username and password to be used for the new admin user.
      const obj = { username: username, password: password };

       // This line creates a new instance of the Admin model using the userObj as data.
      const newAdmin = new Admin(obj);
       // This line saves the new admin user to the database. await is used because newAdmin.save likely returns a Promise.
       await newAdmin.save();

       // It creates a token containing the username and sets the role to "admin".
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Admin created successfully', token });
    }  
});
 
  // now let us define routes for the logging of the admin

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token});
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

  // now let us define routes to create courses

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
});

// now let us create routes to edit an existing course

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
 
  /* Course.findByIdAndUpdate(req.params.courseId, req.body) is likely a function (from a Mongoose) that retrieves a course document from the database based on the provided courseId.
       The req.body object contains the new course data sent in the request body (usually in JSON format).
       findByIdAndUpdate attempts to find the course and update its properties with the values from req.body. It returns the updated course document if successful, or null if not found.
       The await keyword pauses the execution of the route handler until findByIdAndUpdate finishes its operation.
*/

   if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});
 
  // let us create a route to get all the courses

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
 
  // The empty {} object as an argument specifies no filtering criteria, meaning all courses are returned.
   // The await keyword pauses the execution of the route handler until Course.find finishes its operation.
 
  res.json({ courses });
});



// User routes

  // ok let us make routes for the user signin
  
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

// now create routes on user login

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

//now create routes on courses
app.get('/users/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({published: true}); //{published: true} it indicates only when the course is published it will show the user
  res.json({ courses });
});


//now let us define routes to purchase the course

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


//let us make routes to show the user  purchased course

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {

  // here .findOne({username: req.user.username}): This calls the findOne method on the User model. It searches for a single user document where the username field matches the value of req.user.username.
  // .populate('purchasedCourse'): This method is specific to Mongoose and performs population. It fetches the data referenced by the purchasedCourse field (assuming it's an object id referencing another collection) in the user document and includes it in the final result.
const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }

  // If user.purchasedCourse exists and has a value (truthy), that value is used.
  // If user.purchasedCourse is missing or falsy (e.g., null or empty array), an empty array [] is used as the default value. This ensures a purchasedCourse property is always present in the response even if the user hasn't purchased any courses.
  
});

app.listen(3000, () =>{
   console.log('Server running on port 3000')
  });
