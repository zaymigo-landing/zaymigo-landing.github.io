/**
 * Created by fred on 01.02.17.
 */

import AppConstants from '../constants';

var CalculatorModel = Backbone.Model.extend({
    // Значения по умолчанию
    defaults: {
        sum: 500000,
        period: 365
    },

    incomeMoney: function () {
        let sum = app.calculator.get('sum'),
            period = app.calculator.get('period');

        let res = Math.round(sum * (1 + AppConstants.percent * period / 365));

        return res;
    }
});

export default CalculatorModel;