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

function handlefirstRequest(req,res){
   let finalsum = calculatedsum(100)
    console.log(finalsum);
    let answer = "the sum is"+ finalsum;
    res.send(answer)
}
app.get('/',handlefirstRequest )


function started(){
    console.log(`Example app listening on port ${port}`)
}

app.listen(port, started)



 