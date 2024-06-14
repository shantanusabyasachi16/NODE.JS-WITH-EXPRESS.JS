const express = require('express');
const bodyParser = require('body-parser');//for post request, to capture body in "post" request

const app = express();
const port = 3000

app.use(bodyParser.json());

let todos = [];//global variable to stores all datas


//The function findIndex searches for an object with a specific id within an array of objects and returns the index of that object.
// If the object is not found, it returns -1


function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}


//The removeAtIndex function creates a new array that is a copy of the input array, 
//but with the element at the specified index removed.
function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}


app.get('/todos', (req, res) => { ///This method defines a route handler for GET requests.
  res.json(todos);// it wiil send the json response
});

app.get('/todos/:id', (req, res) => {  
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    res.json(todos[todoIndex]);
  }
});

app.post('/todos', (req, res) => {   //This is the path or endpoint for the route. When a client makes a POST request to this path, the provided callback function will be executed.
  
  const newTodo = { //A new todo item is created as an object

    id: Math.floor(Math.random() * 1000000), // it wiil create a unique id for every new todo
   
    
    title: req.body.title,
    description: req.body.description

  };

  todos.push(newTodo);//This line adds the newly created todo(newtodo) item to the todos array (global array).

  res.status(201).json(newTodo);//Sends the newly created todo item as a JSON response to the client.

  //  res.status(201): Sets the HTTP status code to 201, which indicates that a new resource has been successfully created.
  
});

app.put('/todos/:id', (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos[todoIndex].title = req.body.title;
    todos[todoIndex].description = req.body.description;
    res.json(todos[todoIndex]);
  }
  
});

app.delete('/todos/:id', (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos = removeAtIndex(todos, todoIndex);
    res.status(200).send();
  }

});


// for all other routes, return 404
app.use((req, res, next) => {
  res.status(404).send();
});


app.listen(port,()=>{
  console.log(`Example app listening on port ${port}`)
});
