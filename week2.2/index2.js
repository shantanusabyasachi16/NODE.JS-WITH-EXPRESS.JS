const express = require('express')
const app = express()
const port = 3000

function calculatedsum(counter){
    let sum = 0;
    for (let i = 0; i < counter; i++) {
 sum = sum +i
    }
    return sum;
 }

// now create a callback function with two parameters such as req,res
// handlefirstRequest ia aysnchronous callback ()

function handlefirstRequest(req,res){
 let counter = req.query.counter;//user can input the value
   let finalsum = calculatedsum(counter)
    console.log(finalsum);
    let answer = "the sum is"+ finalsum;

    // res.send() is an Express method used to send a response back to the client who made the HTTP request. It takes one parameter, which is the data that will be sent as the response body.
    // here the body is "answer"
    res.send(answer)
}

//app.get() is an Express method used to define a route for handling HTTP GET requests. It takes two parameters:
// The first one is The route path: It specifies the URL path for which the middleware function (or request handler) will be invoked. In this case, the route path is '/handle'.
// and the second one is The request handler function: This function is called when a GET request is made to the specified route path. It takes two parameters,
// They are req (the request object) and res (the response object), and contains the logic to handle the request and send back a response. In the provided code, the handleRequest function is the request handler function.
// So, app.get('/handle', handleRequest) means that when a GET request is made to the '/handle' route, the handleRequest function will be invoked to handle the request.


app.get('/handle',handlefirstRequest )
// /handle :this is the route where we want the handlefirstReques () to  be showed

//app.get('/handle' anytime there is a request then it triggers or calls  the handlefirstRequesfunction


function started(){
    console.log(`Example app listening on port ${port}`)
}

app.listen(port, started)


