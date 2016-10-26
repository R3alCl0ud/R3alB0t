var statcore = require('./statcore');

statcore = new statcore();

var data = [94,97,81,65,74,81,68];

var x_data = [1,2,2,5,6,6,7];
var y_data = [4,4,6,7,5,7,9];

console.log(statcore.standardDeviation(data));
console.log(statcore.correlationCoefficient(x_data, y_data));
console.log(statcore.leastSquaresRegressionLine(x_data, y_data));

/*
* How this will work with data over time, using this sort of system with
* a scatter-plot type graphing I could take the frequency of when R3alB0t
* is being used and generate lines to predict when to expect r3alb0t to be used
* on the administrator's server. This will probably be easiest if the time variable
* is UNIX time, as UNIX time is a numerical value. Right now, hardest part will be
* figuring out how to programatically do an integral and derivative on the data to
* "straighten", then "curve" the resulting line. The chances are is that data
* is going to be sinumatic so I will probably have to do negative cosine, as that
* is the integral of sine, as a shortcut, for now. Also for such curved data,
* it shall NOT be preloaded, instead the lists should be passed client-side as it will
* be easiest to draw a canvas there, and, it will not hog the CPU, RAM, or Network
* latency, therefore keeping r3alb0t running fast, and data only being used when needed.
* 
* For an example of the mathematics at work here please refer to this link: https://www.desmos.com/calculator/ghnaogp6li
*/