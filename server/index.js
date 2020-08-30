// This number can be whatever you want, just keep in mind that
// it will be the number needed when you visit localhost in your browser.
// eg. localhost:3000 means port has a value of 3000.
const port = 3000;

// Express init.
const express = require('express');
const app = express();
app.use(express.json()); // This allows us to receive raw JSON in POST/PUT/etc requests.

// Import the key functions used by the routes.
const { pickRandomFromArray, pickRandomRepeatedly } = require('./TrackingRandomPicks');

// Sanity check. 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Middleware function to verify the body for the post routes.
function verifyPostHasArray(){
    return (request, response, next) => {
        console.log(request.body);
        let userSuppliedArray = request.body.userSuppliedArray;
        // Check if array is null, undefined, empty, or 0-length. We don't want that.
        if (Array.isArray(userSuppliedArray) && userSuppliedArray.length){
            // Proceed to the next part of the route - specified in the "app.whatever"
            // routes as the function called after this middleware.
            next();
        } else {
            // Sending a response here will cut off any further processing.
            // So our main route code can be guaranteed that the array has values.
            response.json({
                error: 'Invalid array supplied!'
            });
        }
    }
}

// Post route with middleware to verify the request contents.
app.post('/PickRandomFromData', verifyPostHasArray(), (req, res) => {
    // Because the middleware verified it has what we want, we can use
    // the userSuppliedArray directly & immediately.
    let result = pickRandomFromArray(req.body.userSuppliedArray);
    
    res.json({
        chosenResult: result
    });
});

// Post route with middleware to verify the request contents.
app.post('/PickRandomFromData/:count', verifyPostHasArray(), (req,res) => {
    // Our middleware didn't verify for a URL param, so we need to check
    // that it exists and has value worth using.
    let count = req.params.count;
    if (count > 0){
        let result = JSON.parse(pickRandomRepeatedly(req.body.userSuppliedArray, count));
        res.json({
            talliedResult: result
        })
    } else {
        res.json({
            error:"Error! Bad count provided."
        })
    }
});

// A bit different to a plain ExpressJS app.
// We're storing the reference to our app in 'server'
// so that it can be used in other code - such as our tests.
const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// Export our server & app (yes, they're different) for other code to use. 
module.exports = {server, app};
// The app is the bunch of code & routes.
// The server is the app running, ready to process requests & generate responses.