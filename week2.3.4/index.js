const express =  require("express")
const app = express()
const bodyParser = require("body-parser")

const port = 3000

app.use(bodyParser.json())

function theSum(counter){
    let sum = 0
    for(let i = 0;i<counter;i++){
        sum = sum +i
    }
    return sum
}
 
function handleFReq(req,res){

    let counter = req.query.counter

    console.log(req.body);

    let Sum = theSum(counter)

    // now we will see how get the body in a json format

    let calObj= {

        "sum":Sum,  
    }
    res.status(200).send(calObj)


}

app.get("/thecal",handleFReq)

  function funhtml(req,res){
   res.send(`<h1>Hello world</h1>`)
 
 }
app.get('/',funhtml)

function started(){
   console.log(`Example app listening on port ${port}`)
}

app.listen(port, started)
