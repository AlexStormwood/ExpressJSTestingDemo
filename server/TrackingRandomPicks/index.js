// This file contains 2 functions & examples of their usage.
// 1. The 'pickRandomFromArray(targetArray)' function picks a random value from an array
//    and returns that value.
// 2. The 'pickRandomRepeatedly(targetArray, repeatCount)' function repeatedly calls
//    the above function a specified number of times and builds up an object containing:
//      - the possible items that could've been picked from the targetArray
//      - the number of times each item was picked after repeatedly calling the above function
// These functions are completely generic - they do not care what your targetArray is
// or what type of data it contains. The examples showcase this.


function pickRandomFromArray(targetArray){
    // Quick little ninja-function to return a random value from the targetArray.
    return targetArray[Math.round(Math.random() * (targetArray.length - 1))];

    // Math.random() gives you a random float between 0 and 1.
    // You must multiply by your target maximum to get a useful number,
    // and then round that random number to an integer to use it as an array index.

    // Note that some online suggestions say to use Math.floor instead of Math.round here.
    // That's valid, however it means you must use (Math.random() * targetArray.length)
    // As Math.floor is equivalent to subtracting 1 as well.
    // I'm using Math.round and subtracting 1 so it's more-similar to other usages of
    // the array length when choosing an array index (eg. using a for loop).
}

function pickRandomRepeatedly(targetArray, repeatCount){
    // This object stores the names of each possible outcome from the targetArray
    // as well as a tally of how many times we got that result from our random picking.
    var resultsWithTallies = {};

    // Go through the targetArray to build up our resultsWithTallies object 
    // with keys of every possible outcome.
    targetArray.forEach(key => {
        // Type safety object keys requires all keys to be strings.
        // And for the tally system to work easily, initialize it with a value of 0.
        resultsWithTallies[key.toString()] = 0;
    });

    for (let index = 0; index < repeatCount; index++) {
        // Pick random value from targetArray.
        let result = pickRandomFromArray(targetArray).toString();

        // Find matching result in the tallies object and increase its count by one.
        Object.keys(resultsWithTallies).forEach(key => {
            if (result === key) {
                resultsWithTallies[key]++;
            }
        });
    }
    // Return the JSON as a string. This enforces deep-copying of the result when used elsewhere.
    return JSON.stringify(resultsWithTallies);
}


// //// EXAMPLE USAGE:
// let possibleCoinFlipOutcomes = ["heads", "tails"];
// let possibleDiceRollOutcomes = [1, 2, 3, 4, 5, 6];

// console.log(`Coin flipped 100 times and outcomes were: \n${pickRandomRepeatedly(possibleCoinFlipOutcomes, 100)}`);
// console.log(`Dice rolled 100 times and outcomes were: \n${pickRandomRepeatedly(possibleDiceRollOutcomes, 100)}`);

// // Since it's "pure random", if you want to give one outcome an increased likelihood of occuring
// // then you need it increase how often it appears in the targetArray.
// let possibleLootboxItemRewards = [
//     "Common Party Hat",
//     "Common Party Hat",
//     "Common Party Hat",
//     "Common Party Hat",
//     "Common Party Hat",
//     "Common Party Hat",
//     "Common Party Hat",
//     "Shiny Foil Crown",
//     "Shiny Foil Crown",
//     "Shiny Foil Crown",
//     "Shiny Foil Crown",
//     "Actual Gold Crown"
// ]
// console.log(`Opened 100 lootboxes and outcomes were: \n${pickRandomRepeatedly(possibleLootboxItemRewards, 100)}`);

module.exports = {
    pickRandomFromArray,
    pickRandomRepeatedly
}