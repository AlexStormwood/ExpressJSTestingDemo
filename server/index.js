const express = require('express');
const app = express();
bodyParser = require('body-parser');
const port = 3000;
app.use(express.json());

const { pickRandomFromArray, pickRandomRepeatedly } = require('./TrackingRandomPicks');


app.get('/', (req, res) => {
  res.send('Hello World!');
});

function verifyPostHasArray(){
    return (request, response, next) => {
        console.log(request.body);
        let userSuppliedArray = request.body.userSuppliedArray;
        if (Array.isArray(userSuppliedArray) && userSuppliedArray.length){
            next();
        } else {
            response.json({
                error: 'Invalid array supplied!'
            });
        }
    }
}

app.post('/PickRandomFromData', verifyPostHasArray(), (req, res) => {
    let userSuppliedArray = req.body.userSuppliedArray;
    let result = pickRandomFromArray(userSuppliedArray);
    res.json({
        chosenResult: result
    });
});

app.post('/PickRandomFromData/:count', verifyPostHasArray(), (req,res) => {
    let userSuppliedArray = req.body.userSuppliedArray;
    let count = req.params.count;
    if (count > 0){
        let result = JSON.parse(pickRandomRepeatedly(userSuppliedArray, count));
        res.json({
            talliedResult: result
        })
    } else {
        res.json({
            error:"Error! Bad count provided."
        })
    }
});

const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = {server, app};