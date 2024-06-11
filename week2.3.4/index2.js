// As per we know that http request can only be sent by the browser and postman
// But there is another way from where we can send http request to our bult in  http server
// And that is called as the Nodejs processess

//exppress= creates an http server but
//fetch = talks to an http server or sends request
// so let us create object which will contain our method

function logResponseBody(jsonBody){
    console.log(jsonBody);
}
function callbackfn(result){
   // result.json()= to get data or response in json
    result.json().then(logResponseBody)
}
let sendobj={
    method: "GET"
};
// now use another external library of node js called fetch and put the route methodObj and keep a callback in the promise for its functionality
 //fetch send http request to the bulitIn http server
fetch("http://localhost:3000/thecal?counter=15",sendobj).then(callbackfn)
//.then() is done because it retuns a promise