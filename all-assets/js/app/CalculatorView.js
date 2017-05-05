/**
 * Created by fred on 03.02.17.
 */
import AppHelpers from '../helpers';
import AppConstants from '../constants';

var CalculatorView = Backbone.View.extend({

    // Ползунки
    sumRange: 'input#selectSumRange', // Сумма
    periodRange: 'input#selectPeriodRange', // Период

    // Поля
    sumField: 'input#selectSumField', // Сумма
    periodField: 'input#selectPeriodField', // Период

    events: {
        'input input#selectSumRange': 'changeSumRange',
        'focusout input#selectSumField': 'changeSumField',

        'input input#selectPeriodRange': 'changePeriodRange',
        'focusout input#selectPeriodField': 'changePeriodField',

        // Запрещаем ввод букв в поля
        'keypress input.calc-field': 'checkField'
    },

    initialize: function () {
        this.template = _.template($('#templateCalc').html());

        this.model.on('change', this.change, this);

        this.render();
    },

    render: function () {
        var rendered = this.template(this.model.attributes);
        this.$el.html(rendered);

        this.change();

        return this;
    },

    change: function () {
        let sum = this.model.get('sum'),
            period = this.model.get('period');

        // В поле суммы
        $(this.sumField).val(this.model.get('sum'));

        // В поле периода
        $(this.periodField).val(this.model.get('period'));

        // Меням значение ползунка суммы
        $(this.sumRange).val(this.model.get('sum'));
        this.changeRangeSlider('sum', $(this.sumRange).attr('max'), $(this.sumRange).attr('min'), false);

        // Меняем значеник ползунка периода
        $(this.periodRange).val(this.model.get('period'));
        this.changeRangeSlider('period', $(this.periodRange).attr('max'), $(this.periodRange).attr('min'), false);

        // возврат
        $('.js-info-return').html(AppHelpers.formatNumber(this.model.incomeMoney()) + ' ₽');
        // доход
        $('.js-info-income').html(
            AppHelpers.formatNumber(Math.round(this.model.incomeMoney() - this.model.get('sum'))) + ' ₽'
        );

        this.changeGraphRes(this.model.incomeMoney(), this.model.incomeMoney() - this.model.get('sum'));
    },

    // Изменение ползунка (type: sum || max)
    changeRangeSlider: function (type, max, min, changeModel) {
        let range = $('input.js-range--' + type);

        for (let i = 0; i < range.length; i++) {
            $(range[i])
                .attr('max', max)
                .attr('min', min)
                .css({
                    'backgroundSize': ($(range[i]).val() - $(range[i]).attr('min')) * 100 / ($(range[i]).attr('max') - $(range[i]).attr('min')) + '% 100%'
                });

            if (changeModel) this.model.set(type, parseInt($(range[i]).val()));
        }
    },

    // Изменение суммы при помощи ползунка
    changeSumRange: function () {
        let min = $(this.sumRange).attr('min'),
            max = $(this.sumRange).attr('max');

        this.changeRangeSlider('sum', max, min, true);
    },

    // Изменение суммы при помощи поля
    changeSumField: function () {
        let value = $(this.sumField).val(),
            rem = value % 100;

        if (rem !== 0) value = value - rem;

        if (parseInt(value) > AppConstants.max_sum || parseInt(value) < AppConstants.min_sum) {
            value = app.calculator.defaults.sum;
            $(this.sumField).val(value);
        }

        this.model.set('sum', parseInt(value));

        this.changeRangeSlider('sum', $(this.sumRange).attr('max'), $(this.sumRange).attr('min'));
    },

    // Изменение периода при помощи ползунка
    changePeriodRange: function () {
        let min = $(this.periodRange).attr('min'),
            max = $(this.periodRange).attr('max');

        this.changeRangeSlider('period', max, min, true);
    },

    // Изменение периода при помощи поля
    changePeriodField: function () {
        let value = $(this.periodField).val(),
            rem = value % 100;

        if (rem !== 0) value = value - rem;

        if (parseInt(value) > AppConstants.max_period || parseInt(value) < AppConstants.min_period) {
            value = app.calculator.defaults.period;
            $(this.periodField).val(value);
        }

        this.model.set('period', parseInt(value));

        this.changeRangeSlider('period', $(this.periodRange).attr('max'), $(this.periodRange).attr('min'));
    },

    changeGraphRes: function (sumReturn, sumIncome) {
        let profit_max = Math.round(AppConstants.max_sum * (1 + AppConstants.percent * 730 / 365)),
            blue_height_max = AppConstants.max_sum/(profit_max),
            green_height_max = (profit_max - AppConstants.max_sum)/(profit_max);

        let green_height = sumReturn / AppConstants.max_sum * blue_height_max * 95 + '%',
            blue_height = sumIncome / (profit_max - AppConstants.max_sum) * green_height_max * 160 + '%';

        $('.js_graph__income').css('height', blue_height);
        $('.js_graph__return').css('height', green_height);
    },

    checkField: function (e) {
        e = e || event;

        if (e.ctrlKey || e.altKey || e.metaKey) return;

        var sym = AppHelpers.getChar(e);

        if (sym == null) return;

        if (sym < '0' || sym > '9') {
            return false;
        }
    }
});

export default CalculatorView;