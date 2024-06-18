//Dependencies and Initialization

const express = require('express');
const app = express();

app.use(express.json());

//Arrays to store data about admins, users, and courses.
let ADMINS = [];
let USERS = [];
let COURSES = [];

//ADMIN AUTHENTICATION
// let us see what does adminAunthentication middlewere function does
const adminAuthentication = (req, res, next) => {

  
  const { username, password } = req.headers;
  // the above line is equal to write the below lines of code

  //  const username = req.headers.username
  //  const password = req.headers.password
  
  //Checks if the provided username and password (in headers) match an admin.

  //a is the parameter representing each element (admin object) in the ADMINS array as the .find() method iterates through it.
  //basically means admins aobject is equal to the object created it chekis it is presents or not 
  //if it is true then route handlers wiil go to admin otherwise it will show Admin authentication failed
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
};
//USER AUNTHEICATION

//same as   adminAunthentication middlewere
const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {

    //req.user = user; stores the authenticated user's info in the request object.
   //Other functions or pieces of code that run after this middleware can easily get the user info from req.user without needing to re-check the username and password.
    req.user = user;  // Add user object to the request
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  } 
};

app.post('/admin/signup', (req, res) => {
  const admin = req.body;

  //to find the admin is already exist or not.
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    res.json({ message: 'Admin created successfully' });
  }
});


// let us just use a some simple middlewere function to pass in the request method routing

// function fn1 (rq,res,next){
//   console.log("fn1 is now called");
// }


// app.post('/admin/login', adminAuthentication,fn1, (req, res) => {
//   res.json({ message: 'Logged in successfully' });
// });


// here adminAunthentication is the middlewere function 

app.post('/admin/login', adminAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
 });


app.post('/admin/courses', adminAuthentication, (req, res) => {
  const course = req.body;

  course.id = Date.now(); // use timestamp as course ID or math.Random
  COURSES.push(course);//new courses
  res.json({ message: 'Course created successfully', courseId: course.id });
});

//to update and add new courses

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId); // converts it from a string to an integer using parseInt
  const course = COURSES.find(c => c.id === courseId);
  if (course) {

    //Object.assign(course, req.body);: This updates the course object with the properties from req.body. req.body contains the new course data sent by the client.
    // Object.assign merges the properties of req.body into the course object, updating any existing properties and adding any new ones.
   
   //Object.assign takes each key-value (title or price etc) pair from req.body and adds it to course
    //it will replace original instance present in couses to add updated courses
   Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});


//to check the upadted courses it will return all courses present
app.get('/admin/courses', adminAuthentication, (req, res) => {
  res.json({ courses: COURSES });
});

app.post('/users/signup', (req, res) => {

  // const user = {...req.body, purchasedCourses: []};
  //++or we can write this way it is same
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: [] //as the user buys course it will updated here
  }
  USERS.push(user);
  res.json({ message: 'User created successfully' });
});

app.post('/users/login', userAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // COURSES.filter(c => c.published)
  let filteredCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (COURSES[i].published) {  //published is true or false  (course is published or not)
      filteredCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: filteredCourses });  
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);//to covert it to interger
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseId); 
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
  // We need to extract the complete course object from COURSES
  // which have ids which are present in req.user.purchasedCourses
  var purchasedCourseIds = req.user.purchasedCourses; [1, 4];
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});