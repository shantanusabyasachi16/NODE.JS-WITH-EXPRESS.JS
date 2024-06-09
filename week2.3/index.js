//middleware refers to software components that sit between the client requests and the server's responses.
// Middleware processes incoming requests before they reach the main application logic and processes outgoing responses before they are sent to the client.
// This allows for a modular approach to adding functionality such as logging, authentication, data parsing, and error handling.

const express = require('express')
const app = express()
const port = 3000

//it take 3 inputs req , res, next
function middleware1(req,res, next){
    console.log("from inside middleware"+ req.headers.counter);
    next();
    //After performing its task (logging the header), the middleware calls next() to pass control to the next middleware function or route handler.
}
//how to register middleware
app.use(middleware1);
//every request which comes from the client it go first in the middleware and the it comes to callbackfunction



function calculatedsum(counter){
    let sum = 0;
    for (let i = 0; i < counter; i++) {
 sum = sum +i
    }
    return sum;
 }



function handlefirstRequest(req,res){
    
 //let counter = req.query.counter;//user can input the value
 let counter = req.headers.counter
   let finalsum = calculatedsum(counter)
    console.log(finalsum);
    let answer = "the sum is"+ finalsum;

    
    res.send(answer)
}


//app.get('/handle',handlefirstRequest )
//we cannot use post method in url
app.post('/handle',handlefirstRequest )


function started(){
    console.log(`Example app listening on port ${port}`)
}

app.listen(port, started)


