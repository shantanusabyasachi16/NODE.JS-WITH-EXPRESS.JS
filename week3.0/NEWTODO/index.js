//cors error =

//A CORS (Cross-Origin Resource Sharing) error occurs when a web application makes a request to a different domain (origin) than its own, and the server at that different domain does not explicitly allow the request. 
//This is a security feature implemented in web browsers to prevent malicious websites from making unauthorized requests to other domains.

const express = require('express');
const bodyParser = require('body-parser');//for post request, to capture body in "post" request
const path = require('path')
const app = express();
const cors =require('cors')

const port = 3000 // tom listen http request

app.use(bodyParser.json());
app.use(cors());

let todos = [];//global variable to stores all datas


//The function findIndex searches for an object with a specific id within an array of objects and returns the index of that object in array
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

  let newArray = [];//A new empty array called newArray is created to store the elements that are not being removed.

  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray; //it will return the new array or the array which is not removed
}


app.get('/todos', (req, res) => { ///This method defines a route handler for GET requests.
  res.json(todos);// it wiil send the json response
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



app.delete('/todos/:id', (req, res) => {
  //1st find the index (findIndex)we have with the given id (req.params.id)then
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {  //if it is not present send this
    res.status(404).send();
  } else { //if it is there then send this
    //remove the index from todos
    todos = removeAtIndex(todos, todoIndex);
    res.status(200).send();
  }

});



// for all other routes, return 404`
app.use((req, res, next) => {
  res.status(404).send();
});


app.listen(port,()=>{
  console.log(`Example app listening on port ${port}`)
});

//we can also install cors to avoid path directory

