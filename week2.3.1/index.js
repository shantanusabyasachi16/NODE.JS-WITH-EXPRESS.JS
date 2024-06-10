//in express we cannot access tho body directly so an external library is needed
//which is "npm install body-parser" **body-parser is a middleware used in Express.js to parse the body of incoming requests
//Express does not automatically parse the body of incoming requests.

// The body is where the actual data you want to send or receive resides.
// It's not visible in the URL and is separate from the headers.

const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const port = 3000

//it take 3 inputs req , res, next
// function middleware1(req,res, next){
//     console.log("from inside middleware"+ req.headers.counter);
//     next();
    //After performing its task (logging the header), the middleware calls next() to pass control to the next middleware function or route handler.
//}

//how to register middleware
//app.use(middleware1);
//register body-parser
app.use(bodyparser.json())// it returns od add the middlware that extracts the body before the requst goes to the respective handler


function calculatedsum(counter){
    let sum = 0;
    for (let i = 0; i < counter; i++) {
 sum = sum +i
    }
    return sum;
 }



function handlefirstRequest(req,res){
    
 //let counter = req.query.counter;//user can input the value
 console.log(req.body);
 let counter = req.body.counter
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


