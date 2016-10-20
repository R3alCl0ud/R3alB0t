module.exports = class statcore {
    standardMean(data) {
        var mean = 0;
        for (var i = 0; i < data.length; i++)
            mean += data[i];
        mean /= data.length;
        return mean;
    }
    
    standardDeviation(data) {
        var xbar = 0;
        for (var i = 0; i < data.length; i++)
            xbar += data[i];
        xbar /= data.length;
        
        var sdev = () => {
            var ssum = 0;
            for (var j = 0; j < data.length; j++)
                ssum += Math.pow(data[j] - xbar, 2);
            ssum = Math.sqrt(ssum / (data.length - 1));
            return ssum;
        };
        
        return sdev();
    }
    
    correlationCoefficient(data_x, data_y) {
        if (data_x.length != data_y.length)
            return 1;   // Incompatible lengths
        var n = data_x.length;
        
        var means = [this.standardMean(data_x), this.standardMean(data_y)];
        var sum_num = 0;
        for (var i = 0; i < n; i++)
            sum_num += ((data_x[i] - means[0]) * (data_y[i] - means[1]));
        var sum_den1 = 0;
        for (var j = 0; j < n; j++)
            sum_den1 += ((data_x[j] - means[0]) * (data_x[j] - means[0]));
        var sum_den2 = 0;
        for (var j = 0; j < n; j++)
            sum_den2 += ((data_y[j] - means[1]) * (data_y[j] - means[1]));
        return sum_num / Math.sqrt(sum_den1 * sum_den2);
    }
    
    // AKA Slope and intercept of "line-of-best-fit"
    leastSquaresRegressionLine(data_x, data_y) {
        var r = this.correlationCoefficient(data_x, data_y);
        var b = r * (this.standardDeviation(data_y) / this.standardDeviation(data_x));
        var a = this.standardMean(data_y) - (b * this.standardMean(data_x));
        return [a, b];
    }
};