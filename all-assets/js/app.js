(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _CalculatorModel = require('./app/CalculatorModel');

var _CalculatorModel2 = _interopRequireDefault(_CalculatorModel);

var _CalculatorView = require('./app/CalculatorView');

var _CalculatorView2 = _interopRequireDefault(_CalculatorView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
    /*    $('.js_animate').addClass("hidden").viewportChecker({
            classToAdd: 'visible animated fadeIn',
            offset: 100
        });
        $('.js_slide_right').addClass("hidden").viewportChecker({
            classToAdd: 'visible animated bounceInRight',
            offset: 100
        });
        $('.js_slide_left').addClass('hidden').viewportChecker({
            classToAdd: 'visible animated bounceInLeft',
            offset: 100
        });
        $('.js_slide_bottom').addClass('hidden').viewportChecker({
            classToAdd: 'visible animated bounceInUp',
            offset: 100
        });*/
});

$(function () {
    window.app = {};

    // Калькулятор
    app.calculator = new _CalculatorModel2.default({});

    app.calculatorView = new _CalculatorView2.default({
        model: app.calculator,
        el: 'form.calc'
    });

    var AppModel = Backbone.Model.extend({
        defaults: {}
    });

    app.model = new AppModel();

    var AppView = Backbone.View.extend({
        el: 'body',

        events: {
            'click .js-tab': 'changeTab',
            'focusout .field input[required]': 'validateField',
            'click .js-user-register': 'registerUser',
            'click .js-feedback': 'sendFeedback',
            'click .js-login-user': 'loginUser',
            'click .js-popup-register': 'showRegisterPopup',
            'click .js-popup-login': 'showLoginPopup',
            'click .js-show-video': 'showPopupVideo',
            'click .js-show-feedback': 'showPopupFeedback',
            'click .js_quest-target': 'selectFeedbackTheme',
            'keypress .js_not_letters': 'checkSymbol',
            'click .js-close-popup': 'closePopup'
        },

        initialize: function initialize() {
            $('#userPhone').mask("+7 (999) 999-9999");
        },

        changeTab: function changeTab(e) {
            var typeTab = $(e.currentTarget).parent('.js-block-tabs').data('tabs') || 'changeQuest';

            switch (typeTab) {
                case 'calcTypePerson':
                    $('.calc-tab--active').add(e.currentTarget).toggleClass('calc-tab--active');
                    break;
                case 'whyChangeContent':
                    $('.why-tab--active').add(e.currentTarget).toggleClass('why-tab--active');
                    var tabWhyId = $('.why-tab--active').data('tab');
                    $('.why-content').removeClass('why-content--active');
                    $('#why-content-' + tabWhyId).addClass('why-content--active');
                    break;
                case 'changeQuest':
                    $('.js-tab-quest--active').add(e.currentTarget).toggleClass('js-tab-quest--active');
                    var tabQuestId = $('.js-tab-quest--active').data('tab');
                    $('.js-content-quest').removeClass('js-content-quest--active');
                    $('#questTab-' + tabQuestId).addClass('js-content-quest--active');
                    break;
                default:
                    return false;
            }
        },

        // Валидация на лету
        validateField: function validateField(e) {
            var elm = $(e.target),
                value = elm.val(),
                min = elm.attr('min'),
                max = elm.attr('max'),
                regx = elm.attr('data-regx') || '',
                res = false;

            // Проверка моб. телефона
            if (elm.data('typefield') === 'phone') {
                value = '+' + value.replace(/\D+/g, '');
                if (_.isNull(value.match(_helpers2.default.regxMobile))) {
                    res = false;
                } else {
                    res = true;
                }
            }

            if (elm.data('typefield') === 'repassword') {
                value === $('#userpass').val() ? res = true : res = false;
            } else {
                value.length < min || value.length > max ? res = false : res = true;
            }

            if (!res) {
                elm.addClass('valid-err err-field');
                elm.removeClass('valid-ok');
            } else {
                elm.addClass('valid-ok');
                elm.removeClass('valid-err err-field');
            }
        },

        // Регистрация пользователя
        registerUser: function registerUser(e) {
            e.preventDefault();

            var data = {
                sum: app.calculator.get('sum'),
                period: app.calculator.get('period'),
                phone: $('input#userPhone').val(),
                password: $('input#userpass').val(),
                password_again: $('input#userRePass').val(),
                agreement: $('input#userAgreement').prop('checked')
            };

            if ($('input#investor')) {
                data.investor = true;
            }
            if (_helpers2.default.formValidate('userRegisterForm')) {
                _helpers2.default.ajaxWrapper('/api/register', 'POST', JSON.stringify(data), function (data) {
                    if (data.status === 'success') {
                        if (data.sid) {
                            window.location = data.sid;
                        }
                    } else {
                        if (data.sid) {
                            window.location = data.sid;
                        }
                        if (data.fields) {
                            if (data.fields[0].phone) {
                                _helpers2.default.inValidatePhone(data.fields[0].phone.msgNotMOBILE);
                            }
                        } else {
                            $('.js-err-register-msg').hide();
                        }
                    }
                });
            }
        },

        // Отправка формы обратной связи
        sendFeedback: function sendFeedback(e) {
            e.preventDefault();
            _helpers2.default.formValidate('feedbackForm');
            var data = {
                theme: $('#feedTheme').val(),
                email: $('input#feedEmail').val(),
                message: $('textarea#feedMessage').val()
            };

            if (_helpers2.default.formValidate('feedbackForm')) {
                _helpers2.default.ajaxWrapper('/api/feedback', 'POST', JSON.stringify(data), function (data) {
                    if (data.status === 'success') {
                        // Сбрасываем форму
                        $('#feedbackForm').trigger('reset');
                        $('.js-msg-succes').show();
                        $('#feedbackForm').find('.errResponse').hide();
                    } else {
                        if (data.fields) {
                            data.fields[0].email ? _helpers2.default.inValidateEmailFeedback(data.fields[0].email.emailAddressInvalidFormat) : $('.js-err-email-feedback-msg').hide();
                            data.fields[0].message ? _helpers2.default.inValidateMessageFeedback(data.fields[0].message.stringLengthTooShort) : $('.js-err-message-feedback-msg').hide();
                        } else {
                            $('#feedbackForm').find('.errResponse').hide();
                        }
                    }
                });
            }
        },

        // Авторизация пользователя
        loginUser: function loginUser(e) {
            e.preventDefault();

            _helpers2.default.formValidate('userLoginForm');

            var data = {
                login: $('input[name=userName]').val(),
                password: $('input#userLoginPass').val()
            };

            if (_helpers2.default.formValidate('userLoginForm')) {
                _helpers2.default.ajaxWrapper('/api/auth', 'POST', JSON.stringify(data), function (data) {
                    if (data.status === 'success') {
                        if (data.sid) {
                            window.location = data.sid;
                        }
                    } else {
                        if (data.sid) {
                            console.log(data.msg);
                        }
                    }
                });
            }
        },

        // Попап регистрации
        showRegisterPopup: function showRegisterPopup(e) {
            e.preventDefault();
            var t = Math.min($(window).scrollTop() + 50, $('#root').height() - $(window).height());

            $('.popup--register').css({
                'margin-top': t + 'px'
            }).fadeIn(250);

            $('#root').addClass('overlay');
        },

        // Попап авторизации
        showLoginPopup: function showLoginPopup(e) {
            e.preventDefault();
            var t = Math.min($(window).scrollTop() + 50, $('#root').height() - $(window).height());

            $('.popup--login').css({
                'margin-top': t + 'px'
            }).fadeIn(250);
            $('#root').addClass('overlay');
        },

        // Попап с видео
        showPopupVideo: function showPopupVideo() {
            $('.popup--youtube').fadeIn(200);
            $('#root').addClass('overlay');
        },

        showPopupFeedback: function showPopupFeedback(e) {
            e.preventDefault();
            var t = Math.min($(window).scrollTop() + 50, $('#root').height() - $(window).height()) + 80;

            $('.popup--feedback').css({
                'margin-top': t + 'px'
            }).fadeIn(250);
            $('#root').addClass('overlay');
        },

        selectFeedbackTheme: function selectFeedbackTheme(e) {
            var elm = $('#jsSelectTheme'),
                idTheme = $(e.target).data('theme'),
                value = $(e.target).html();

            elm.html(_helpers2.default.cutString(value, 27));

            $('#feedTheme').val(value);
        },

        checkSymbol: function checkSymbol(e) {
            console.log(e);
            e = e || event;

            if (e.ctrlKey || e.altKey || e.metaKey) return;

            var chr = _helpers2.default.getChar(e);
            if (chr == null) return;

            if (chr < '0' || chr > '9') return false;
        },

        // Закрыть попап
        closePopup: function closePopup(e) {
            // Выключаем видео
            /*            var iframe = $('#video-vimeo')[0];
                        var player = $f(iframe);
                        player.api('unload');*/

            $('.popup').fadeOut(200);
            $('#root').removeClass('overlay');
        }

    });

    $(document).mouseup(function (e) {
        // событие клика по веб-документу
        var div = $(".popup");
        if (!div.is(e.target) // если клик был не по попапу
        && div.has(e.target).length === 0) {

            /*            var iframe = $('#video-vimeo')[0];
                        var player = $f(iframe);
                        player.api('unload');*/

            div.fadeOut(200); // скрываем
            $('#root').removeClass('overlay');
        }
    });

    app.view = new AppView();

    // Слайдеры
    _helpers2.default.initSliders();
});

},{"./app/CalculatorModel":2,"./app/CalculatorView":3,"./constants":4,"./helpers":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CalculatorModel = Backbone.Model.extend({
    // Значения по умолчанию
    defaults: {
        sum: 500000,
        period: 365
    },

    incomeMoney: function incomeMoney() {
        var sum = app.calculator.get('sum'),
            period = app.calculator.get('period');

        var res = Math.round(sum * (1 + _constants2.default.percent * period / 365));

        return res;
    }
}); /**
     * Created by fred on 01.02.17.
     */

exports.default = CalculatorModel;

},{"../constants":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require('../helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _constants = require('../constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by fred on 03.02.17.
 */
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

    initialize: function initialize() {
        this.template = _.template($('#templateCalc').html());

        this.model.on('change', this.change, this);

        this.render();
    },

    render: function render() {
        var rendered = this.template(this.model.attributes);
        this.$el.html(rendered);

        this.change();

        return this;
    },

    change: function change() {
        var sum = this.model.get('sum'),
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
        $('.js-info-return').html(_helpers2.default.formatNumber(this.model.incomeMoney()) + ' ₽');
        // доход
        $('.js-info-income').html(_helpers2.default.formatNumber(Math.round(this.model.incomeMoney() - this.model.get('sum'))) + ' ₽');

        this.changeGraphRes(this.model.incomeMoney(), this.model.incomeMoney() - this.model.get('sum'));
    },

    // Изменение ползунка (type: sum || max)
    changeRangeSlider: function changeRangeSlider(type, max, min, changeModel) {
        var range = $('input.js-range--' + type);

        for (var i = 0; i < range.length; i++) {
            $(range[i]).attr('max', max).attr('min', min).css({
                'backgroundSize': ($(range[i]).val() - $(range[i]).attr('min')) * 100 / ($(range[i]).attr('max') - $(range[i]).attr('min')) + '% 100%'
            });

            if (changeModel) this.model.set(type, parseInt($(range[i]).val()));
        }
    },

    // Изменение суммы при помощи ползунка
    changeSumRange: function changeSumRange() {
        var min = $(this.sumRange).attr('min'),
            max = $(this.sumRange).attr('max');

        this.changeRangeSlider('sum', max, min, true);
    },

    // Изменение суммы при помощи поля
    changeSumField: function changeSumField() {
        var value = $(this.sumField).val(),
            rem = value % 100;

        if (rem !== 0) value = value - rem;

        if (parseInt(value) > _constants2.default.max_sum || parseInt(value) < _constants2.default.min_sum) {
            value = app.calculator.defaults.sum;
            $(this.sumField).val(value);
        }

        this.model.set('sum', parseInt(value));

        this.changeRangeSlider('sum', $(this.sumRange).attr('max'), $(this.sumRange).attr('min'));
    },

    // Изменение периода при помощи ползунка
    changePeriodRange: function changePeriodRange() {
        var min = $(this.periodRange).attr('min'),
            max = $(this.periodRange).attr('max');

        this.changeRangeSlider('period', max, min, true);
    },

    // Изменение периода при помощи поля
    changePeriodField: function changePeriodField() {
        var value = $(this.periodField).val(),
            rem = value % 100;

        if (rem !== 0) value = value - rem;

        if (parseInt(value) > _constants2.default.max_period || parseInt(value) < _constants2.default.min_period) {
            value = app.calculator.defaults.period;
            $(this.periodField).val(value);
        }

        this.model.set('period', parseInt(value));

        this.changeRangeSlider('period', $(this.periodRange).attr('max'), $(this.periodRange).attr('min'));
    },

    changeGraphRes: function changeGraphRes(sumReturn, sumIncome) {
        var profit_max = Math.round(_constants2.default.max_sum * (1 + _constants2.default.percent * 730 / 365)),
            blue_height_max = _constants2.default.max_sum / profit_max,
            green_height_max = (profit_max - _constants2.default.max_sum) / profit_max;

        var green_height = sumReturn / _constants2.default.max_sum * blue_height_max * 95 + '%',
            blue_height = sumIncome / (profit_max - _constants2.default.max_sum) * green_height_max * 160 + '%';

        $('.js_graph__income').css('height', blue_height);
        $('.js_graph__return').css('height', green_height);
    },

    checkField: function checkField(e) {
        e = e || event;

        if (e.ctrlKey || e.altKey || e.metaKey) return;

        var sym = _helpers2.default.getChar(e);

        if (sym == null) return;

        if (sym < '0' || sym > '9') {
            return false;
        }
    }
});

exports.default = CalculatorView;

},{"../constants":4,"../helpers":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var AppConstants = {
    max_period: 730,
    min_period: 30,

    max_sum: 1000000,
    min_sum: 1000,

    percent: 0.312
};

exports.default = AppConstants;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Created by fred on 06.02.17.
 */
var AppHelpers = {
    baseUrl: '',

    regxMobile: /^(?:8(?:(?:21|22|23|24|51|52|53|54|55)|(?:15\d\d))?|\+?7)?(?:(?:3[04589]|4[012789]|8[^89\D]|9\d)\d)?\d{7}$/,

    initSliders: function initSliders() {
        var sliders = $('.js-slider-pepper');

        sliders.each(function () {
            var that = $(this),
                allSlider = that.find('.peppermint'),
                arrowLeft = that.find('.arrow--left'),
                arrowRight = that.find('.arrow--right');

            var slider = allSlider.Peppermint({
                mouseDrag: true,
                disableIfOneSlide: true,
                dots: true
            });

            arrowLeft.click(slider.data('Peppermint').prev);
            arrowRight.click(slider.data('Peppermint').next);
        });
    },

    // ajax
    ajaxWrapper: function ajaxWrapper(url, type, data, successCallback, errorCallback) {
        type = type || 'POST';
        data = data || {};
        successCallback = successCallback || function (data) {};
        errorCallback = errorCallback || function (ermsg) {
            console.log(ermsg);
        };
        $.ajax({
            url: AppHelpers.baseUrl + url,
            type: type,
            data: data,
            success: function success(data) {
                return successCallback(data);
            },
            error: errorCallback
        });
    },

    formatNumber: function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    },

    // Валидация телефона от сервера (регистрация)
    inValidatePhone: function inValidatePhone(msg) {
        $('#userPhone').addClass('err-field');
        $('.js-err-register-msg').show().html(msg);
    },

    inValidateLoginUser: function inValidateLoginUser(msg) {
        $('.js-err-user-login').show().html(msg);
    },

    // Валидация email от сервера (обратная связь)
    inValidateEmailFeedback: function inValidateEmailFeedback(msg) {
        $('#feedEmail').addClass('err-field valid-err');
        $('.js-err-email-feedback-msg').show().html(msg);
    },

    // Валидация сообщения от сервера (обратная связь)
    inValidateMessageFeedback: function inValidateMessageFeedback(msg) {
        $('#feedMessage').addClass('err-field valid-err');
        $('.js-err-message-feedback-msg').show().html(msg);
    },

    inValidateMessageAuth: function inValidateMessageAuth(msg) {
        $('.js-err-message-auth-msg').show().html(msg);
    },

    // Валидация форм
    formValidate: function formValidate(formId) {
        var form = '#' + formId;

        var regx = {
            email: '^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$'
        };

        switch (form) {
            // Форма регистрации
            case '#userRegisterForm':
                $(form).find('.field').each(function (i, elm) {
                    // Валидация телефона и пароля
                    if ($(elm).data('minfield')) {
                        var min = $(elm).data('minfield');
                        if ($(elm).find('input').val() < min) {
                            // Показываем ошибку
                            $(elm).find('.err-msg-field').show();
                            $(elm).find('input').addClass('err-field valid-err');
                        } else {
                            $(elm).find('.err-msg-field').hide();
                            $(elm).find('input').removeClass('err-field');
                        }
                    }
                    // Повторный пароль
                    if ($('#userpass').val() !== $('#userRePass').val()) {
                        $('.err-msg-field--repass').show();
                        $('#userRePass').addClass('err-field valid-err').removeClass('valid-ok');
                    } else {
                        $('.err-msg-field--repass').hide();
                        $('#userRePass').removeClass('err-field');
                    }
                    // Согласие на обработку
                    if (!$('#userAgreement').prop('checked')) {
                        $('.err-msg-field--agreement').show();
                        $('#userAgreement').addClass('err-field valid-err');
                    } else {
                        $('.err-msg-field--agreement').hide();
                        $('#userAgreement').removeClass('err-field valid-err');
                    }
                });
                break;
            // Форма обратной связи
            case '#feedbackForm':
                $(form).find('[data-type=field]').each(function (i, elm) {
                    // Валидация темы
                    if ($('#feedTheme').val() === null || $('#feedTheme').val() === '') {
                        $('#jsSelectTheme').addClass('err-field valid-err');
                        $('.err-msg-field--feed_theme').show();
                    } else {
                        $('#jsSelectTheme').removeClass('err-field valid-err');
                        $('.err-msg-field--feed_theme').hide();
                    }
                    // Валидация email
                    if ($('#feedEmail').val().match(regx.email) == null || $('#feedEmail').val().length < 3) {
                        $('#feedEmail').addClass('err-field valid-err');
                        $('.err-msg-field--feed_email').show();
                    } else {
                        $('#feedEmail').removeClass('err-field valid-err');
                        $('.err-msg-field--feed_email').hide();
                    }
                    // Валидация сообщения
                    if ($(elm).data('minfield')) {
                        var min = $(elm).data('minfield');
                        if ($(elm).find('textarea').val() < min) {
                            // Показываем ошибку
                            $(elm).find('.err-msg-field').show();
                            $(elm).find('textarea').addClass('err-field valid-err');
                        } else {
                            $(elm).find('.err-msg-field').hide();
                            $(elm).find('textarea').removeClass('err-field valid-err');
                        }
                    }
                });
                break;
            // Форма авторизации
            case '#userLoginForm':
                if ($('input[name=userName]').val().length < 4 || $('#userLoginPass').val().length < 4) {
                    $('.err-msg-field--login').show();
                } else {
                    $('.err-msg-field--login').hide();
                }
                break;
            default:
                return false;
        }

        // Проверяем валидацю всех полей
        if ($(form).find('.err-field' || '.valid-err').length > 0) {
            return false;
        } else {
            return true;
        }
    },

    cutString: function cutString(txt, limit) {
        txt = txt.trim();

        if (txt.length <= limit) return txt;

        txt = txt.slice(0, limit);
        var lastSpace = txt.lastIndexOf(" ");

        if (lastSpace > 0) {
            txt = txt.substr(0, lastSpace);
        }
        return txt + " ...";
    },

    getChar: function getChar(event) {
        if (event.which == null) {
            if (event.keyCode < 32) return null;
            return String.fromCharCode(event.keyCode);
        }

        if (event.which != 0 && event.charCode != 0) {
            if (event.which < 32) return null;
            return String.fromCharCode(event.which);
        }

        return null;
    }
};

exports.default = AppHelpers;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udC9kZXYvYWxsLWFzc2V0cy9qcy9hcHAuanMiLCJmcm9udC9kZXYvYWxsLWFzc2V0cy9qcy9hcHAvQ2FsY3VsYXRvck1vZGVsLmpzIiwiZnJvbnQvZGV2L2FsbC1hc3NldHMvanMvYXBwL0NhbGN1bGF0b3JWaWV3LmpzIiwiZnJvbnQvZGV2L2FsbC1hc3NldHMvanMvY29uc3RhbnRzLmpzIiwiZnJvbnQvZGV2L2FsbC1hc3NldHMvanMvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBVztBQUM3Qjs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQyxDQWpCRDs7QUFtQkEsRUFBRSxZQUFZO0FBQ1YsV0FBTyxHQUFQLEdBQWEsRUFBYjs7QUFFQTtBQUNBLFFBQUksVUFBSixHQUFpQiw4QkFBb0IsRUFBcEIsQ0FBakI7O0FBRUEsUUFBSSxjQUFKLEdBQXFCLDZCQUFtQjtBQUNwQyxlQUFPLElBQUksVUFEeUI7QUFFcEMsWUFBSTtBQUZnQyxLQUFuQixDQUFyQjs7QUFLQSxRQUFJLFdBQVcsU0FBUyxLQUFULENBQWUsTUFBZixDQUFzQjtBQUNqQyxrQkFBVTtBQUR1QixLQUF0QixDQUFmOztBQUlBLFFBQUksS0FBSixHQUFZLElBQUksUUFBSixFQUFaOztBQUVBLFFBQUksVUFBVSxTQUFTLElBQVQsQ0FBYyxNQUFkLENBQXFCO0FBQy9CLFlBQUksTUFEMkI7O0FBRy9CLGdCQUFRO0FBQ0osNkJBQWlCLFdBRGI7QUFFSiwrQ0FBbUMsZUFGL0I7QUFHSix1Q0FBMkIsY0FIdkI7QUFJSixrQ0FBc0IsY0FKbEI7QUFLSixvQ0FBd0IsV0FMcEI7QUFNSix3Q0FBNEIsbUJBTnhCO0FBT0oscUNBQXlCLGdCQVBy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QWUsSUFBbkIsRUFBeUI7QUFDckIsZ0JBQUksTUFBTSxPQUFOLEdBQWdCLEVBQXBCLEVBQXdCLE9BQU8sSUFBUDtBQUN4QixtQkFBTyxPQUFPLFlBQVAsQ0FBb0IsTUFBTSxPQUExQixDQUFQO0FBQ0g7O0FBRUQsWUFBSSxNQUFNLEtBQU4sSUFBZSxDQUFmLElBQW9CLE1BQU0sUUFBTixJQUFrQixDQUExQyxFQUE2QztBQUN6QyxnQkFBSSxNQUFNLEtBQU4sR0FBYyxFQUFsQixFQUFzQixPQUFPLElBQVA7QUFDdEIsbUJBQU8sT0FBTyxZQUFQLENBQW9CLE1BQU0sS0FBMUIsQ0FBUDtBQUNIOztBQUVELGVBQU8sSUFBUDtBQUNIO0FBbk1ZLENBQWpCOztrQkFzTWUsVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQXBwSGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgQ2FsY3VsYXRvck1vZGVsIGZyb20gJy4vYXBwL0NhbGN1bGF0b3JNb2RlbCc7XG5pbXBvcnQgQ2FsY3VsYXRvclZpZXcgZnJvbSAnLi9hcHAvQ2FsY3VsYXRvclZpZXcnO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbi8qICAgICQoJy5qc19hbmltYXRlJykuYWRkQ2xhc3MoXCJoaWRkZW5cIikudmlld3BvcnRDaGVja2VyKHtcbiAgICAgICAgY2xhc3NUb0FkZDogJ3Zpc2libGUgYW5pbWF0ZWQgZmFkZUluJyxcbiAgICAgICAgb2Zmc2V0OiAxMDBcbiAgICB9KTtcbiAgICAkKCcuanNfc2xpZGVfcmlnaHQnKS5hZGRDbGFzcyhcImhpZGRlblwiKS52aWV3cG9ydENoZWNrZXIoe1xuICAgICAgICBjbGFzc1RvQWRkOiAndmlzaWJsZSBhbmltYXRlZCBib3VuY2VJblJpZ2h0JyxcbiAgICAgICAgb2Zmc2V0OiAxMDBcbiAgICB9KTtcbiAgICAkKCcuanNfc2xpZGVfbGVmdCcpLmFkZENsYXNzKCdoaWRkZW4nKS52aWV3cG9ydENoZWNrZXIoe1xuICAgICAgICBjbGFzc1RvQWRkOiAndmlzaWJsZSBhbmltYXRlZCBib3VuY2VJbkxlZnQnLFxuICAgICAgICBvZmZzZXQ6IDEwMFxuICAgIH0pO1xuICAgICQoJy5qc19zbGlkZV9ib3R0b20nKS5hZGRDbGFzcygnaGlkZGVuJykudmlld3BvcnRDaGVja2VyKHtcbiAgICAgICAgY2xhc3NUb0FkZDogJ3Zpc2libGUgYW5pbWF0ZWQgYm91bmNlSW5VcCcsXG4gICAgICAgIG9mZnNldDogMTAwXG4gICAgfSk7Ki9cbn0pO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuYXBwID0ge307XG5cbiAgICAvLyDQmtCw0LvRjNC60YPQu9GP0YLQvtGAXG4gICAgYXBwLmNhbGN1bGF0b3IgPSBuZXcgQ2FsY3VsYXRvck1vZGVsKHt9KTtcblxuICAgIGFwcC5jYWxjdWxhdG9yVmlldyA9IG5ldyBDYWxjdWxhdG9yVmlldyh7XG4gICAgICAgIG1vZGVsOiBhcHAuY2FsY3VsYXRvcixcbiAgICAgICAgZWw6ICdmb3JtLmNhbGMnXG4gICAgfSk7XG5cbiAgICBsZXQgQXBwTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgICAgICBkZWZhdWx0czoge31cbiAgICB9KTtcblxuICAgIGFwcC5tb2RlbCA9IG5ldyBBcHBNb2RlbCgpO1xuXG4gICAgdmFyIEFwcFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnYm9keScsXG5cbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgLmpzLXRhYic6ICdjaGFuZ2VUYWInLFxuICAgICAgICAgICAgJ2ZvY3Vzb3V0IC5maWVsZCBpbnB1dFtyZXF1aXJlZF0nOiAndmFsaWRhdGVGaWVsZCcsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXVzZXItcmVnaXN0ZXInOiAncmVnaXN0ZXJVc2VyJyxcbiAgICAgICAgICAgICdjbGljayAuanMtZmVlZGJhY2snOiAnc2VuZEZlZWRiYWNrJyxcbiAgICAgICAgICAgICdjbGljayAuanMtbG9naW4tdXNlcic6ICdsb2dpblVzZXInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1wb3B1cC1yZWdpc3Rlcic6ICdzaG93UmVnaXN0ZXJQb3B1cCcsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXBvcHVwLWxvZ2luJzogJ3Nob3dMb2dpblBvcHVwJyxcbiAgICAgICAgICAgICdjbGljayAuanMtc2hvdy12aWRlbyc6ICdzaG93UG9wdXBWaWRlbycsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXNob3ctZmVlZGJhY2snOiAnc2hvd1BvcHVwRmVlZGJhY2snLFxuXHRcdFx0J2NsaWNrIC5qc19xdWVzdC10YXJnZXQnOiAnc2VsZWN0RmVlZGJhY2tUaGVtZScsXG4gICAgICAgICAgICAna2V5cHJlc3MgLmpzX25vdF9sZXR0ZXJzJzogJ2NoZWNrU3ltYm9sJyxcbiAgICAgICAgICAgICdjbGljayAuanMtY2xvc2UtcG9wdXAnOiAnY2xvc2VQb3B1cCdcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjdXNlclBob25lJykubWFzayhcIis3ICg5OTkpIDk5OS05OTk5XCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNoYW5nZVRhYjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGxldCB0eXBlVGFiID0gJChlLmN1cnJlbnRUYXJnZXQpLnBhcmVudCgnLmpzLWJsb2NrLXRhYnMnKS5kYXRhKCd0YWJzJykgfHwgJ2NoYW5nZVF1ZXN0JztcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlVGFiKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2FsY1R5cGVQZXJzb24nOlxuICAgICAgICAgICAgICAgICAgICAkKCcuY2FsYy10YWItLWFjdGl2ZScpLmFkZChlLmN1cnJlbnRUYXJnZXQpLnRvZ2dsZUNsYXNzKCdjYWxjLXRhYi0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3doeUNoYW5nZUNvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICAkKCcud2h5LXRhYi0tYWN0aXZlJykuYWRkKGUuY3VycmVudFRhcmdldCkudG9nZ2xlQ2xhc3MoJ3doeS10YWItLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGFiV2h5SWQgPSAkKCcud2h5LXRhYi0tYWN0aXZlJykuZGF0YSgndGFiJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy53aHktY29udGVudCcpLnJlbW92ZUNsYXNzKCd3aHktY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJyN3aHktY29udGVudC0nICsgdGFiV2h5SWQpLmFkZENsYXNzKCd3aHktY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NoYW5nZVF1ZXN0JzpcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLXRhYi1xdWVzdC0tYWN0aXZlJykuYWRkKGUuY3VycmVudFRhcmdldCkudG9nZ2xlQ2xhc3MoJ2pzLXRhYi1xdWVzdC0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWJRdWVzdElkID0gJCgnLmpzLXRhYi1xdWVzdC0tYWN0aXZlJykuZGF0YSgndGFiJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1jb250ZW50LXF1ZXN0JykucmVtb3ZlQ2xhc3MoJ2pzLWNvbnRlbnQtcXVlc3QtLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjcXVlc3RUYWItJyArIHRhYlF1ZXN0SWQpLmFkZENsYXNzKCdqcy1jb250ZW50LXF1ZXN0LS1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDQvdCwINC70LXRgtGDXG4gICAgICAgIHZhbGlkYXRlRmllbGQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBsZXQgZWxtID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBlbG0udmFsKCksXG4gICAgICAgICAgICAgICAgbWluID0gZWxtLmF0dHIoJ21pbicpLFxuICAgICAgICAgICAgICAgIG1heCA9IGVsbS5hdHRyKCdtYXgnKSxcbiAgICAgICAgICAgICAgICByZWd4ID0gZWxtLmF0dHIoJ2RhdGEtcmVneCcpIHx8ICcnLFxuICAgICAgICAgICAgICAgIHJlcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINC80L7QsS4g0YLQtdC70LXRhNC+0L3QsFxuICAgICAgICAgICAgaWYgKGVsbS5kYXRhKCd0eXBlZmllbGQnKSA9PT0gJ3Bob25lJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJysnICsgdmFsdWUucmVwbGFjZSgvXFxEKy9nLCAnJyk7XG4gICAgICAgICAgICAgICAgaWYgKF8uaXNOdWxsKHZhbHVlLm1hdGNoKEFwcEhlbHBlcnMucmVneE1vYmlsZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZWxtLmRhdGEoJ3R5cGVmaWVsZCcpID09PSAncmVwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PT0gJCgnI3VzZXJwYXNzJykudmFsKCkgPyByZXMgPSB0cnVlIDogcmVzID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlLmxlbmd0aCA8IG1pbiB8fCB2YWx1ZS5sZW5ndGggPiBtYXggPyByZXMgPSBmYWxzZSA6IHJlcyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgICAgICBlbG0uYWRkQ2xhc3MoJ3ZhbGlkLWVyciBlcnItZmllbGQnKTtcbiAgICAgICAgICAgICAgICBlbG0ucmVtb3ZlQ2xhc3MoJ3ZhbGlkLW9rJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsbS5hZGRDbGFzcygndmFsaWQtb2snKTtcbiAgICAgICAgICAgICAgICBlbG0ucmVtb3ZlQ2xhc3MoJ3ZhbGlkLWVyciBlcnItZmllbGQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXG4gICAgICAgIHJlZ2lzdGVyVXNlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgc3VtOiBhcHAuY2FsY3VsYXRvci5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgICAgIHBlcmlvZDogYXBwLmNhbGN1bGF0b3IuZ2V0KCdwZXJpb2QnKSxcbiAgICAgICAgICAgICAgICBwaG9uZTogJCgnaW5wdXQjdXNlclBob25lJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICQoJ2lucHV0I3VzZXJwYXNzJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzc3dvcmRfYWdhaW46ICQoJ2lucHV0I3VzZXJSZVBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBhZ3JlZW1lbnQ6ICQoJ2lucHV0I3VzZXJBZ3JlZW1lbnQnKS5wcm9wKCdjaGVja2VkJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICgkKCdpbnB1dCNpbnZlc3RvcicpKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5pbnZlc3RvciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ3VzZXJSZWdpc3RlckZvcm0nKSkge1xuICAgICAgICAgICAgICAgIEFwcEhlbHBlcnMuYWpheFdyYXBwZXIoXG4gICAgICAgICAgICAgICAgICAgICcvYXBpL3JlZ2lzdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEuc2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEuc2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWVsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmllbGRzWzBdLnBob25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmluVmFsaWRhdGVQaG9uZShkYXRhLmZpZWxkc1swXS5waG9uZS5tc2dOb3RNT0JJTEUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWVyci1yZWdpc3Rlci1tc2cnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCe0YLQv9GA0LDQstC60LAg0YTQvtGA0LzRiyDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgc2VuZEZlZWRiYWNrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2ZlZWRiYWNrRm9ybScpO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdGhlbWU6ICQoJyNmZWVkVGhlbWUnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBlbWFpbDogJCgnaW5wdXQjZmVlZEVtYWlsJykudmFsKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJCgndGV4dGFyZWEjZmVlZE1lc3NhZ2UnKS52YWwoKVxuICAgICAgICAgICAgfTtcblxuXG5cdFx0XHRpZiAoQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2ZlZWRiYWNrRm9ybScpKSB7XG5cdFx0XHRcdEFwcEhlbHBlcnMuYWpheFdyYXBwZXIoXG4gICAgICAgICAgICAgICAgICAgICcvYXBpL2ZlZWRiYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0KHQsdGA0LDRgdGL0LLQsNC10Lwg0YTQvtGA0LzRg1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNmZWVkYmFja0Zvcm0nKS50cmlnZ2VyKCdyZXNldCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5qcy1tc2ctc3VjY2VzJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNmZWVkYmFja0Zvcm0nKS5maW5kKCcuZXJyUmVzcG9uc2UnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmZpZWxkc1swXS5lbWFpbCA/IEFwcEhlbHBlcnMuaW5WYWxpZGF0ZUVtYWlsRmVlZGJhY2soZGF0YS5maWVsZHNbMF0uZW1haWwuZW1haWxBZGRyZXNzSW52YWxpZEZvcm1hdCkgOiAkKCcuanMtZXJyLWVtYWlsLWZlZWRiYWNrLW1zZycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5maWVsZHNbMF0ubWVzc2FnZSA/IEFwcEhlbHBlcnMuaW5WYWxpZGF0ZU1lc3NhZ2VGZWVkYmFjayhkYXRhLmZpZWxkc1swXS5tZXNzYWdlLnN0cmluZ0xlbmd0aFRvb1Nob3J0KSA6ICQoJy5qcy1lcnItbWVzc2FnZS1mZWVkYmFjay1tc2cnKS5oaWRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjZmVlZGJhY2tGb3JtJykuZmluZCgnLmVyclJlc3BvbnNlJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcblx0XHRcdH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQkNCy0YLQvtGA0LjQt9Cw0YbQuNGPINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj1xuICAgICAgICBsb2dpblVzZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIEFwcEhlbHBlcnMuZm9ybVZhbGlkYXRlKCd1c2VyTG9naW5Gb3JtJyk7XG5cbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGxvZ2luOiAkKCdpbnB1dFtuYW1lPXVzZXJOYW1lXScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkKCdpbnB1dCN1c2VyTG9naW5QYXNzJykudmFsKClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgndXNlckxvZ2luRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9hcGkvYXV0aCcsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBkYXRhLnNpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICAgICAgICBzaG93UmVnaXN0ZXJQb3B1cDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciB0ID0gTWF0aC5taW4oJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgNTAsICQoJyNyb290JykuaGVpZ2h0KCkgLSAkKHdpbmRvdykuaGVpZ2h0KCkpO1xuXG4gICAgICAgICAgICAkKCcucG9wdXAtLXJlZ2lzdGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6IHQgKyAncHgnXG4gICAgICAgICAgICB9KS5mYWRlSW4oMjUwKTtcblxuICAgICAgICAgICAgJCgnI3Jvb3QnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0LDQstGC0L7RgNC40LfQsNGG0LjQuFxuICAgICAgICBzaG93TG9naW5Qb3B1cDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciB0ID0gTWF0aC5taW4oJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgNTAsICQoJyNyb290JykuaGVpZ2h0KCkgLSAkKHdpbmRvdykuaGVpZ2h0KCkpO1xuXG4gICAgICAgICAgICAkKCcucG9wdXAtLWxvZ2luJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6IHQgKyAncHgnXG4gICAgICAgICAgICB9KS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNyb290JykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINCy0LjQtNC10L5cbiAgICAgICAgc2hvd1BvcHVwVmlkZW86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0teW91dHViZScpLmZhZGVJbigyMDApO1xuICAgICAgICAgICAgJCgnI3Jvb3QnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dQb3B1cEZlZWRiYWNrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHQgPSBNYXRoLm1pbigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyA1MCwgJCgnI3Jvb3QnKS5oZWlnaHQoKSAtICQod2luZG93KS5oZWlnaHQoKSkgKyA4MDtcblxuICAgICAgICAgICAgJCgnLnBvcHVwLS1mZWVkYmFjaycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ21hcmdpbi10b3AnOiB0ICsgJ3B4J1xuICAgICAgICAgICAgfSkuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjcm9vdCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cblx0XHRzZWxlY3RGZWVkYmFja1RoZW1lOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0bGV0IGVsbSA9ICQoJyNqc1NlbGVjdFRoZW1lJyksXG5cdFx0XHRcdGlkVGhlbWUgPSAkKGUudGFyZ2V0KS5kYXRhKCd0aGVtZScpLFxuXHRcdFx0XHR2YWx1ZSA9ICQoZS50YXJnZXQpLmh0bWwoKTtcblxuXHRcdFx0ZWxtLmh0bWwoQXBwSGVscGVycy5jdXRTdHJpbmcodmFsdWUsIDI3KSk7XG5cblx0XHRcdCQoJyNmZWVkVGhlbWUnKS52YWwodmFsdWUpO1xuXHRcdH0sXG5cbiAgICAgICAgY2hlY2tTeW1ib2w6IGZ1bmN0aW9uIChlKSB7XG5cdFx0ICAgIGNvbnNvbGUubG9nKGUpO1xuXHRcdCAgICBlID0gZSB8fCBldmVudDtcblxuICAgICAgICAgICAgaWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSB8fCBlLm1ldGFLZXkpIHJldHVybjtcblxuICAgICAgICAgICAgdmFyIGNociA9IEFwcEhlbHBlcnMuZ2V0Q2hhcihlKTtcbiAgICAgICAgICAgIGlmIChjaHIgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAoY2hyIDwgJzAnIHx8IGNociA+ICc5JykgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCX0LDQutGA0YvRgtGMINC/0L7Qv9Cw0L9cbiAgICAgICAgY2xvc2VQb3B1cDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDQstC40LTQtdC+XG4vKiAgICAgICAgICAgIHZhciBpZnJhbWUgPSAkKCcjdmlkZW8tdmltZW8nKVswXTtcbiAgICAgICAgICAgIHZhciBwbGF5ZXIgPSAkZihpZnJhbWUpO1xuICAgICAgICAgICAgcGxheWVyLmFwaSgndW5sb2FkJyk7Ki9cblxuICAgICAgICAgICAgJCgnLnBvcHVwJykuZmFkZU91dCgyMDApO1xuICAgICAgICAgICAgJCgnI3Jvb3QnKS5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24gKGUpeyAvLyDRgdC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LLQtdCxLdC00L7QutGD0LzQtdC90YLRg1xuICAgICAgICB2YXIgZGl2ID0gJChcIi5wb3B1cFwiKTtcbiAgICAgICAgaWYgKCFkaXYuaXMoZS50YXJnZXQpIC8vINC10YHQu9C4INC60LvQuNC6INCx0YvQuyDQvdC1INC/0L4g0L/QvtC/0LDQv9GDXG4gICAgICAgICAgICAmJiBkaXYuaGFzKGUudGFyZ2V0KS5sZW5ndGggPT09IDApIHtcblxuLyogICAgICAgICAgICB2YXIgaWZyYW1lID0gJCgnI3ZpZGVvLXZpbWVvJylbMF07XG4gICAgICAgICAgICB2YXIgcGxheWVyID0gJGYoaWZyYW1lKTtcbiAgICAgICAgICAgIHBsYXllci5hcGkoJ3VubG9hZCcpOyovXG5cbiAgICAgICAgICAgIGRpdi5mYWRlT3V0KDIwMCk7IC8vINGB0LrRgNGL0LLQsNC10LxcbiAgICAgICAgICAgICQoJyNyb290JykucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBwLnZpZXcgPSBuZXcgQXBwVmlldygpO1xuXG4gICAgLy8g0KHQu9Cw0LnQtNC10YDRi1xuICAgIEFwcEhlbHBlcnMuaW5pdFNsaWRlcnMoKTtcblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDEuMDIuMTcuXG4gKi9cblxuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA1MDAwMDAsXG4gICAgICAgIHBlcmlvZDogMzY1XG4gICAgfSxcblxuICAgIGluY29tZU1vbmV5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzdW0gPSBhcHAuY2FsY3VsYXRvci5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgcGVyaW9kID0gYXBwLmNhbGN1bGF0b3IuZ2V0KCdwZXJpb2QnKTtcblxuICAgICAgICBsZXQgcmVzID0gTWF0aC5yb3VuZChzdW0gKiAoMSArIEFwcENvbnN0YW50cy5wZXJjZW50ICogcGVyaW9kIC8gMzY1KSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDAzLjAyLjE3LlxuICovXG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIENhbGN1bGF0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgLy8g0J/QvtC70LfRg9C90LrQuFxuICAgIHN1bVJhbmdlOiAnaW5wdXQjc2VsZWN0U3VtUmFuZ2UnLCAvLyDQodGD0LzQvNCwXG4gICAgcGVyaW9kUmFuZ2U6ICdpbnB1dCNzZWxlY3RQZXJpb2RSYW5nZScsIC8vINCf0LXRgNC40L7QtFxuXG4gICAgLy8g0J/QvtC70Y9cbiAgICBzdW1GaWVsZDogJ2lucHV0I3NlbGVjdFN1bUZpZWxkJywgLy8g0KHRg9C80LzQsFxuICAgIHBlcmlvZEZpZWxkOiAnaW5wdXQjc2VsZWN0UGVyaW9kRmllbGQnLCAvLyDQn9C10YDQuNC+0LRcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnaW5wdXQgaW5wdXQjc2VsZWN0U3VtUmFuZ2UnOiAnY2hhbmdlU3VtUmFuZ2UnLFxuICAgICAgICAnZm9jdXNvdXQgaW5wdXQjc2VsZWN0U3VtRmllbGQnOiAnY2hhbmdlU3VtRmllbGQnLFxuXG4gICAgICAgICdpbnB1dCBpbnB1dCNzZWxlY3RQZXJpb2RSYW5nZSc6ICdjaGFuZ2VQZXJpb2RSYW5nZScsXG4gICAgICAgICdmb2N1c291dCBpbnB1dCNzZWxlY3RQZXJpb2RGaWVsZCc6ICdjaGFuZ2VQZXJpb2RGaWVsZCcsXG5cbiAgICAgICAgLy8g0JfQsNC/0YDQtdGJ0LDQtdC8INCy0LLQvtC0INCx0YPQutCyINCyINC/0L7Qu9GPXG4gICAgICAgICdrZXlwcmVzcyBpbnB1dC5jYWxjLWZpZWxkJzogJ2NoZWNrRmllbGQnXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3RlbXBsYXRlQ2FsYycpLmh0bWwoKSk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVuZGVyZWQgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgIHRoaXMuJGVsLmh0bWwocmVuZGVyZWQpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgc3VtID0gdGhpcy5tb2RlbC5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgcGVyaW9kID0gdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpO1xuXG4gICAgICAgIC8vINCSINC/0L7Qu9C1INGB0YPQvNC80YtcbiAgICAgICAgJCh0aGlzLnN1bUZpZWxkKS52YWwodGhpcy5tb2RlbC5nZXQoJ3N1bScpKTtcblxuICAgICAgICAvLyDQkiDQv9C+0LvQtSDQv9C10YDQuNC+0LTQsFxuICAgICAgICAkKHRoaXMucGVyaW9kRmllbGQpLnZhbCh0aGlzLm1vZGVsLmdldCgncGVyaW9kJykpO1xuXG4gICAgICAgIC8vINCc0LXQvdGP0Lwg0LfQvdCw0YfQtdC90LjQtSDQv9C+0LvQt9GD0L3QutCwINGB0YPQvNC80YtcbiAgICAgICAgJCh0aGlzLnN1bVJhbmdlKS52YWwodGhpcy5tb2RlbC5nZXQoJ3N1bScpKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgJCh0aGlzLnN1bVJhbmdlKS5hdHRyKCdtYXgnKSwgJCh0aGlzLnN1bVJhbmdlKS5hdHRyKCdtaW4nKSwgZmFsc2UpO1xuXG4gICAgICAgIC8vINCc0LXQvdGP0LXQvCDQt9C90LDRh9C10L3QuNC6INC/0L7Qu9C30YPQvdC60LAg0L/QtdGA0LjQvtC00LBcbiAgICAgICAgJCh0aGlzLnBlcmlvZFJhbmdlKS52YWwodGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcigncGVyaW9kJywgJCh0aGlzLnBlcmlvZFJhbmdlKS5hdHRyKCdtYXgnKSwgJCh0aGlzLnBlcmlvZFJhbmdlKS5hdHRyKCdtaW4nKSwgZmFsc2UpO1xuXG4gICAgICAgIC8vINCy0L7Qt9Cy0YDQsNGCXG4gICAgICAgICQoJy5qcy1pbmZvLXJldHVybicpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIodGhpcy5tb2RlbC5pbmNvbWVNb25leSgpKSArICcg4oK9Jyk7XG4gICAgICAgIC8vINC00L7RhdC+0LRcbiAgICAgICAgJCgnLmpzLWluZm8taW5jb21lJykuaHRtbChcbiAgICAgICAgICAgIEFwcEhlbHBlcnMuZm9ybWF0TnVtYmVyKE1hdGgucm91bmQodGhpcy5tb2RlbC5pbmNvbWVNb25leSgpIC0gdGhpcy5tb2RlbC5nZXQoJ3N1bScpKSkgKyAnIOKCvSdcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmNoYW5nZUdyYXBoUmVzKHRoaXMubW9kZWwuaW5jb21lTW9uZXkoKSwgdGhpcy5tb2RlbC5pbmNvbWVNb25leSgpIC0gdGhpcy5tb2RlbC5nZXQoJ3N1bScpKTtcbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INC/0L7Qu9C30YPQvdC60LAgKHR5cGU6IHN1bSB8fCBtYXgpXG4gICAgY2hhbmdlUmFuZ2VTbGlkZXI6IGZ1bmN0aW9uICh0eXBlLCBtYXgsIG1pbiwgY2hhbmdlTW9kZWwpIHtcbiAgICAgICAgbGV0IHJhbmdlID0gJCgnaW5wdXQuanMtcmFuZ2UtLScgKyB0eXBlKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmdlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHJhbmdlW2ldKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdtYXgnLCBtYXgpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ21pbicsIG1pbilcbiAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogKCQocmFuZ2VbaV0pLnZhbCgpIC0gJChyYW5nZVtpXSkuYXR0cignbWluJykpICogMTAwIC8gKCQocmFuZ2VbaV0pLmF0dHIoJ21heCcpIC0gJChyYW5nZVtpXSkuYXR0cignbWluJykpICsgJyUgMTAwJSdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGNoYW5nZU1vZGVsKSB0aGlzLm1vZGVsLnNldCh0eXBlLCBwYXJzZUludCgkKHJhbmdlW2ldKS52YWwoKSkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVN1bVJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtaW4gPSAkKHRoaXMuc3VtUmFuZ2UpLmF0dHIoJ21pbicpLFxuICAgICAgICAgICAgbWF4ID0gJCh0aGlzLnN1bVJhbmdlKS5hdHRyKCdtYXgnKTtcblxuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdzdW0nLCBtYXgsIG1pbiwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDRgdGD0LzQvNGLINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VTdW1GaWVsZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSAkKHRoaXMuc3VtRmllbGQpLnZhbCgpLFxuICAgICAgICAgICAgcmVtID0gdmFsdWUgJSAxMDA7XG5cbiAgICAgICAgaWYgKHJlbSAhPT0gMCkgdmFsdWUgPSB2YWx1ZSAtIHJlbTtcblxuICAgICAgICBpZiAocGFyc2VJbnQodmFsdWUpID4gQXBwQ29uc3RhbnRzLm1heF9zdW0gfHwgcGFyc2VJbnQodmFsdWUpIDwgQXBwQ29uc3RhbnRzLm1pbl9zdW0pIHtcbiAgICAgICAgICAgIHZhbHVlID0gYXBwLmNhbGN1bGF0b3IuZGVmYXVsdHMuc3VtO1xuICAgICAgICAgICAgJCh0aGlzLnN1bUZpZWxkKS52YWwodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3N1bScsIHBhcnNlSW50KHZhbHVlKSk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgJCh0aGlzLnN1bVJhbmdlKS5hdHRyKCdtYXgnKSwgJCh0aGlzLnN1bVJhbmdlKS5hdHRyKCdtaW4nKSk7XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDQv9C10YDQuNC+0LTQsCDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9C30YPQvdC60LBcbiAgICBjaGFuZ2VQZXJpb2RSYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbWluID0gJCh0aGlzLnBlcmlvZFJhbmdlKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgICAgIG1heCA9ICQodGhpcy5wZXJpb2RSYW5nZSkuYXR0cignbWF4Jyk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcigncGVyaW9kJywgbWF4LCBtaW4sIHRydWUpO1xuICAgIH0sXG5cbiAgICAvLyDQmNC30LzQtdC90LXQvdC40LUg0L/QtdGA0LjQvtC00LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVBlcmlvZEZpZWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICQodGhpcy5wZXJpb2RGaWVsZCkudmFsKCksXG4gICAgICAgICAgICByZW0gPSB2YWx1ZSAlIDEwMDtcblxuICAgICAgICBpZiAocmVtICE9PSAwKSB2YWx1ZSA9IHZhbHVlIC0gcmVtO1xuXG4gICAgICAgIGlmIChwYXJzZUludCh2YWx1ZSkgPiBBcHBDb25zdGFudHMubWF4X3BlcmlvZCB8fCBwYXJzZUludCh2YWx1ZSkgPCBBcHBDb25zdGFudHMubWluX3BlcmlvZCkge1xuICAgICAgICAgICAgdmFsdWUgPSBhcHAuY2FsY3VsYXRvci5kZWZhdWx0cy5wZXJpb2Q7XG4gICAgICAgICAgICAkKHRoaXMucGVyaW9kRmllbGQpLnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgcGFyc2VJbnQodmFsdWUpKTtcblxuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdwZXJpb2QnLCAkKHRoaXMucGVyaW9kUmFuZ2UpLmF0dHIoJ21heCcpLCAkKHRoaXMucGVyaW9kUmFuZ2UpLmF0dHIoJ21pbicpKTtcbiAgICB9LFxuXG4gICAgY2hhbmdlR3JhcGhSZXM6IGZ1bmN0aW9uIChzdW1SZXR1cm4sIHN1bUluY29tZSkge1xuICAgICAgICBsZXQgcHJvZml0X21heCA9IE1hdGgucm91bmQoQXBwQ29uc3RhbnRzLm1heF9zdW0gKiAoMSArIEFwcENvbnN0YW50cy5wZXJjZW50ICogNzMwIC8gMzY1KSksXG4gICAgICAgICAgICBibHVlX2hlaWdodF9tYXggPSBBcHBDb25zdGFudHMubWF4X3N1bS8ocHJvZml0X21heCksXG4gICAgICAgICAgICBncmVlbl9oZWlnaHRfbWF4ID0gKHByb2ZpdF9tYXggLSBBcHBDb25zdGFudHMubWF4X3N1bSkvKHByb2ZpdF9tYXgpO1xuXG4gICAgICAgIGxldCBncmVlbl9oZWlnaHQgPSBzdW1SZXR1cm4gLyBBcHBDb25zdGFudHMubWF4X3N1bSAqIGJsdWVfaGVpZ2h0X21heCAqIDk1ICsgJyUnLFxuICAgICAgICAgICAgYmx1ZV9oZWlnaHQgPSBzdW1JbmNvbWUgLyAocHJvZml0X21heCAtIEFwcENvbnN0YW50cy5tYXhfc3VtKSAqIGdyZWVuX2hlaWdodF9tYXggKiAxNjAgKyAnJSc7XG5cbiAgICAgICAgJCgnLmpzX2dyYXBoX19pbmNvbWUnKS5jc3MoJ2hlaWdodCcsIGJsdWVfaGVpZ2h0KTtcbiAgICAgICAgJCgnLmpzX2dyYXBoX19yZXR1cm4nKS5jc3MoJ2hlaWdodCcsIGdyZWVuX2hlaWdodCk7XG4gICAgfSxcblxuICAgIGNoZWNrRmllbGQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUgPSBlIHx8IGV2ZW50O1xuXG4gICAgICAgIGlmIChlLmN0cmxLZXkgfHwgZS5hbHRLZXkgfHwgZS5tZXRhS2V5KSByZXR1cm47XG5cbiAgICAgICAgdmFyIHN5bSA9IEFwcEhlbHBlcnMuZ2V0Q2hhcihlKTtcblxuICAgICAgICBpZiAoc3ltID09IG51bGwpIHJldHVybjtcblxuICAgICAgICBpZiAoc3ltIDwgJzAnIHx8IHN5bSA+ICc5Jykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENhbGN1bGF0b3JWaWV3OyIsInZhciBBcHBDb25zdGFudHMgPSB7XG4gICAgbWF4X3BlcmlvZDogNzMwLFxuICAgIG1pbl9wZXJpb2Q6IDMwLFxuXG4gICAgbWF4X3N1bTogMTAwMDAwMCxcbiAgICBtaW5fc3VtOiAxMDAwLFxuXG4gICAgcGVyY2VudDogMC4zMTJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcENvbnN0YW50czsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwNi4wMi4xNy5cbiAqL1xudmFyIEFwcEhlbHBlcnMgPSB7XG4gICAgYmFzZVVybDogJycsXG5cbiAgICByZWd4TW9iaWxlOiAvXig/OjgoPzooPzoyMXwyMnwyM3wyNHw1MXw1Mnw1M3w1NHw1NSl8KD86MTVcXGRcXGQpKT98XFwrPzcpPyg/Oig/OjNbMDQ1ODldfDRbMDEyNzg5XXw4W144OVxcRF18OVxcZClcXGQpP1xcZHs3fSQvLFxuXG4gICAgaW5pdFNsaWRlcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNsaWRlcnMgPSAkKCcuanMtc2xpZGVyLXBlcHBlcicpO1xuXG4gICAgICAgIHNsaWRlcnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgdGhhdCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgYWxsU2xpZGVyID0gdGhhdC5maW5kKCcucGVwcGVybWludCcpLFxuICAgICAgICAgICAgICAgIGFycm93TGVmdCA9IHRoYXQuZmluZCgnLmFycm93LS1sZWZ0JyksXG4gICAgICAgICAgICAgICAgYXJyb3dSaWdodCA9IHRoYXQuZmluZCgnLmFycm93LS1yaWdodCcpO1xuXG4gICAgICAgICAgICBsZXQgc2xpZGVyID0gYWxsU2xpZGVyLlBlcHBlcm1pbnQoe1xuICAgICAgICAgICAgICAgIG1vdXNlRHJhZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlSWZPbmVTbGlkZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkb3RzOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXJyb3dMZWZ0LmNsaWNrKHNsaWRlci5kYXRhKCdQZXBwZXJtaW50JykucHJldik7XG4gICAgICAgICAgICBhcnJvd1JpZ2h0LmNsaWNrKHNsaWRlci5kYXRhKCdQZXBwZXJtaW50JykubmV4dCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyBhamF4XG4gICAgYWpheFdyYXBwZXI6ICh1cmwsIHR5cGUsIGRhdGEsIHN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaykgPT4ge1xuICAgICAgICB0eXBlID0gdHlwZSB8fCAnUE9TVCc7XG4gICAgICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgPSBzdWNjZXNzQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZGF0YSkge307XG4gICAgICAgIGVycm9yQ2FsbGJhY2sgPSBlcnJvckNhbGxiYWNrIHx8IGZ1bmN0aW9uKGVybXNnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJtc2cpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogQXBwSGVscGVycy5iYXNlVXJsICsgdXJsLFxuICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdWNjZXNzQ2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGVycm9yQ2FsbGJhY2tcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGZvcm1hdE51bWJlcjogKG51bSkgPT4ge1xuICAgICAgICByZXR1cm4gbnVtLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkXFxkKSsoW15cXGRdfCQpKS9nLCAnJDEgJyk7XG4gICAgfSxcblxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRgtC10LvQtdGE0L7QvdCwINC+0YIg0YHQtdGA0LLQtdGA0LAgKNGA0LXQs9C40YHRgtGA0LDRhtC40Y8pXG4gICAgaW5WYWxpZGF0ZVBob25lOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICQoJyN1c2VyUGhvbmUnKS5hZGRDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICQoJy5qcy1lcnItcmVnaXN0ZXItbXNnJykuc2hvdygpLmh0bWwobXNnKTtcbiAgICB9LFxuXG4gICAgaW5WYWxpZGF0ZUxvZ2luVXNlcjogZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAkKCcuanMtZXJyLXVzZXItbG9naW4nKS5zaG93KCkuaHRtbChtc2cpO1xuICAgIH0sXG5cbiAgICAvLyDQktCw0LvQuNC00LDRhtC40Y8gZW1haWwg0L7RgiDRgdC10YDQstC10YDQsCAo0L7QsdGA0LDRgtC90LDRjyDRgdCy0Y/Qt9GMKVxuICAgIGluVmFsaWRhdGVFbWFpbEZlZWRiYWNrOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICQoJyNmZWVkRW1haWwnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAkKCcuanMtZXJyLWVtYWlsLWZlZWRiYWNrLW1zZycpLnNob3coKS5odG1sKG1zZyk7XG4gICAgfSxcblxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRgdC+0L7QsdGJ0LXQvdC40Y8g0L7RgiDRgdC10YDQstC10YDQsCAo0L7QsdGA0LDRgtC90LDRjyDRgdCy0Y/Qt9GMKVxuICAgIGluVmFsaWRhdGVNZXNzYWdlRmVlZGJhY2s6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgJCgnI2ZlZWRNZXNzYWdlJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgJCgnLmpzLWVyci1tZXNzYWdlLWZlZWRiYWNrLW1zZycpLnNob3coKS5odG1sKG1zZyk7XG4gICAgfSxcblxuICAgIGluVmFsaWRhdGVNZXNzYWdlQXV0aDogZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAkKCcuanMtZXJyLW1lc3NhZ2UtYXV0aC1tc2cnKS5zaG93KCkuaHRtbChtc2cpO1xuICAgIH0sXG5cbiAgICAvLyDQktCw0LvQuNC00LDRhtC40Y8g0YTQvtGA0LxcbiAgICBmb3JtVmFsaWRhdGU6IGZ1bmN0aW9uIChmb3JtSWQpIHtcbiAgICAgICAgbGV0IGZvcm0gPSAnIycgKyBmb3JtSWQ7XG5cbiAgICAgICAgbGV0IHJlZ3ggPSB7XG4gICAgICAgICAgICBlbWFpbDogJ15bLS5fYS16MC05XStAKD86W2EtejAtOV1bLWEtejAtOV0rXFwuKStbYS16XXsyLDZ9JCdcbiAgICAgICAgfTtcblxuICAgICAgICBzd2l0Y2ggKGZvcm0pIHtcbiAgICAgICAgICAgIC8vINCk0L7RgNC80LAg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICAgICAgICAgICAgY2FzZSAnI3VzZXJSZWdpc3RlckZvcm0nOlxuICAgICAgICAgICAgICAgICQoZm9ybSkuZmluZCgnLmZpZWxkJykuZWFjaChmdW5jdGlvbiAoaSwgZWxtKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRgtC10LvQtdGE0L7QvdCwINC4INC/0LDRgNC+0LvRj1xuICAgICAgICAgICAgICAgICAgICBpZiAoJChlbG0pLmRhdGEoJ21pbmZpZWxkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtaW4gPSAkKGVsbSkuZGF0YSgnbWluZmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGVsbSkuZmluZCgnaW5wdXQnKS52YWwoKSA8IG1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCf0L7QutCw0LfRi9Cy0LDQtdC8INC+0YjQuNCx0LrRg1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxtKS5maW5kKCcuZXJyLW1zZy1maWVsZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsbSkuZmluZCgnaW5wdXQnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsbSkuZmluZCgnLmVyci1tc2ctZmllbGQnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChlbG0pLmZpbmQoJ2lucHV0JykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vINCf0L7QstGC0L7RgNC90YvQuSDQv9Cw0YDQvtC70YxcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJyN1c2VycGFzcycpLnZhbCgpICE9PSAkKCcjdXNlclJlUGFzcycpLnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuZXJyLW1zZy1maWVsZC0tcmVwYXNzJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3VzZXJSZVBhc3MnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpLnJlbW92ZUNsYXNzKCd2YWxpZC1vaycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLXJlcGFzcycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyN1c2VyUmVQYXNzJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vINCh0L7Qs9C70LDRgdC40LUg0L3QsCDQvtCx0YDQsNCx0L7RgtC60YNcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkKCcjdXNlckFncmVlbWVudCcpLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWFncmVlbWVudCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyN1c2VyQWdyZWVtZW50JykuYWRkQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1hZ3JlZW1lbnQnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjdXNlckFncmVlbWVudCcpLnJlbW92ZUNsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vINCk0L7RgNC80LAg0L7QsdGA0LDRgtC90L7QuSDRgdCy0Y/Qt9C4XG4gICAgICAgICAgICBjYXNlICcjZmVlZGJhY2tGb3JtJzpcbiAgICAgICAgICAgICAgICAkKGZvcm0pLmZpbmQoJ1tkYXRhLXR5cGU9ZmllbGRdJykuZWFjaChmdW5jdGlvbiAoaSwgZWxtKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRgtC10LzRi1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2ZlZWRUaGVtZScpLnZhbCgpID09PSBudWxsIHx8ICQoJyNmZWVkVGhlbWUnKS52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgJCgnI2pzU2VsZWN0VGhlbWUnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAkKCcuZXJyLW1zZy1maWVsZC0tZmVlZF90aGVtZScpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNqc1NlbGVjdFRoZW1lJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1mZWVkX3RoZW1lJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyBlbWFpbFxuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2ZlZWRFbWFpbCcpLnZhbCgpLm1hdGNoKHJlZ3guZW1haWwpID09IG51bGwgfHwgJCgnI2ZlZWRFbWFpbCcpLnZhbCgpLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNmZWVkRW1haWwnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWZlZWRfZW1haWwnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjZmVlZEVtYWlsJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1mZWVkX2VtYWlsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRgdC+0L7QsdGJ0LXQvdC40Y9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoZWxtKS5kYXRhKCdtaW5maWVsZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWluID0gJChlbG0pLmRhdGEoJ21pbmZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJChlbG0pLmZpbmQoJ3RleHRhcmVhJykudmFsKCkgPCBtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQvtGI0LjQsdC60YNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsbSkuZmluZCgnLmVyci1tc2ctZmllbGQnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChlbG0pLmZpbmQoJ3RleHRhcmVhJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChlbG0pLmZpbmQoJy5lcnItbXNnLWZpZWxkJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxtKS5maW5kKCd0ZXh0YXJlYScpLnJlbW92ZUNsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8vINCk0L7RgNC80LAg0LDQstGC0L7RgNC40LfQsNGG0LjQuFxuICAgICAgICAgICAgY2FzZSAnI3VzZXJMb2dpbkZvcm0nOlxuICAgICAgICAgICAgICAgIGlmICgkKCdpbnB1dFtuYW1lPXVzZXJOYW1lXScpLnZhbCgpLmxlbmd0aCA8IDQgfHwgJCgnI3VzZXJMb2dpblBhc3MnKS52YWwoKS5sZW5ndGggPCA0KSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1sb2dpbicpLnNob3coKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKCcuZXJyLW1zZy1maWVsZC0tbG9naW4nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQn9GA0L7QstC10YDRj9C10Lwg0LLQsNC70LjQtNCw0YbRjiDQstGB0LXRhSDQv9C+0LvQtdC5XG4gICAgICAgIGlmICgkKGZvcm0pLmZpbmQoJy5lcnItZmllbGQnIHx8ICcudmFsaWQtZXJyJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3V0U3RyaW5nOiBmdW5jdGlvbiAodHh0LCBsaW1pdCkge1xuICAgICAgICB0eHQgPSB0eHQudHJpbSgpO1xuXG4gICAgICAgIGlmKCB0eHQubGVuZ3RoIDw9IGxpbWl0KSByZXR1cm4gdHh0O1xuXG4gICAgICAgIHR4dCA9IHR4dC5zbGljZSggMCwgbGltaXQpO1xuICAgICAgICBsZXQgbGFzdFNwYWNlID0gdHh0Lmxhc3RJbmRleE9mKFwiIFwiKTtcblxuICAgICAgICBpZiggbGFzdFNwYWNlID4gMCkge1xuICAgICAgICAgICAgdHh0ID0gdHh0LnN1YnN0cigwLCBsYXN0U3BhY2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eHQgKyBcIiAuLi5cIjtcbiAgICB9LFxuXG4gICAgZ2V0Q2hhcjogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA8IDMyKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQud2hpY2ggIT0gMCAmJiBldmVudC5jaGFyQ29kZSAhPSAwKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPCAzMikgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC53aGljaClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcEhlbHBlcnM7Il19
