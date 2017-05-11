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
        $('.js-info-return').html(_helpers2.default.formatNumber(this.model.incomeMoney()) + ' <span class="sym_rub">o</span>');
        // доход
        $('.js-info-income').html(_helpers2.default.formatNumber(Math.round(this.model.incomeMoney() - this.model.get('sum'))) + ' <span class="sym_rub">o</span>');

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

        // if (rem !== 0) value = value - rem;

        if (Number(value) > _constants2.default.max_period || Number(value) < _constants2.default.min_period) {
            value = app.calculator.defaults.period;
            $(this.periodField).val(value);
        }

        this.model.set('period', value);

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
                // Валидация темы
                if ($('#feedTheme').val() === null || $('#feedTheme').val() === '') {
                    $('#jsSelectTheme, #feedTheme').addClass('err-field valid-err');
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

                $(form).find('[data-type=field]').each(function (i, elm) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udC9kZXYvYWxsLWFzc2V0cy9qcy9hcHAuanMiLCJmcm9udC9kZXYvYWxsLWFzc2V0cy9qcy9hcHAvQ2FsY3VsYXRvck1vZGVsLmpzIiwiZnJvbnQvZGV2L2FsbC1hc3NldHMvanMvYXBwL0NhbGN1bGF0b3JWaWV3LmpzIiwiZnJvbnQvZGV2L2FsbC1hc3NldHMvanMvY29uc3RhbnRzLmpzIiwiZnJvbnQvZGV2L2FsbC1hc3NldHMvanMvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBVztBQUM3Qjs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQyxDQWpCRDs7QUFtQkEsRUFBRSxZQUFZO0FBQ1YsV0FBTyxHQUFQLEdBQWEsRUFBYjs7QUFFQTtBQUNBLFFBQUksVUFBSixHQUFpQiw4QkFBb0IsRUFBcEIsQ0FBakI7O0FBRUEsUUFBSSxjQUFKLEdBQXFCLDZCQUFtQjtBQUNwQyxlQUFPLElBQUksVUFEeUI7QUFFcEMsWUFBSTtBQUZnQyxLQUFuQixDQUFyQjs7QUFLQSxRQUFJLFdBQVcsU0FBUyxLQUFULENBQWUsTUFBZixDQUFzQjtBQUNqQyxrQkFBVTtBQUR1QixLQUF0QixDQUFmOztBQUlBLFFBQUksS0FBSixHQUFZLElBQUksUUFBSixFQUFaOztBQUVBLFFBQUksVUFBVSxTQUFTLElBQVQsQ0FBYyxNQUFkLENBQXFCO0FBQy9CLFlBQUksTUFEMkI7O0FBRy9CLGdCQUFRO0FBQ0osNkJBQWlCLFdBRGI7QUFFSiwrQ0FBbUMsZUFGL0I7QUFHSix1Q0FBMkIsY0FIdkI7QUFJSixrQ0FBc0IsY0FKbEI7QUFLSixvQ0FBd0IsV0FMcEI7QUFNSix3Q0FBNEIsbUJBTnhCO0FBT0oscUNBQXlCLGdCQVBy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QXBCLEVBQXdCLE9BQU8sSUFBUDtBQUN4QixtQkFBTyxPQUFPLFlBQVAsQ0FBb0IsTUFBTSxPQUExQixDQUFQO0FBQ0g7O0FBRUQsWUFBSSxNQUFNLEtBQU4sSUFBZSxDQUFmLElBQW9CLE1BQU0sUUFBTixJQUFrQixDQUExQyxFQUE2QztBQUN6QyxnQkFBSSxNQUFNLEtBQU4sR0FBYyxFQUFsQixFQUFzQixPQUFPLElBQVA7QUFDdEIsbUJBQU8sT0FBTyxZQUFQLENBQW9CLE1BQU0sS0FBMUIsQ0FBUDtBQUNIOztBQUVELGVBQU8sSUFBUDtBQUNIO0FBcE1ZLENBQWpCOztrQkF1TWUsVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQXBwSGVscGVycyBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgQ2FsY3VsYXRvck1vZGVsIGZyb20gJy4vYXBwL0NhbGN1bGF0b3JNb2RlbCc7XG5pbXBvcnQgQ2FsY3VsYXRvclZpZXcgZnJvbSAnLi9hcHAvQ2FsY3VsYXRvclZpZXcnO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbi8qICAgICQoJy5qc19hbmltYXRlJykuYWRkQ2xhc3MoXCJoaWRkZW5cIikudmlld3BvcnRDaGVja2VyKHtcbiAgICAgICAgY2xhc3NUb0FkZDogJ3Zpc2libGUgYW5pbWF0ZWQgZmFkZUluJyxcbiAgICAgICAgb2Zmc2V0OiAxMDBcbiAgICB9KTtcbiAgICAkKCcuanNfc2xpZGVfcmlnaHQnKS5hZGRDbGFzcyhcImhpZGRlblwiKS52aWV3cG9ydENoZWNrZXIoe1xuICAgICAgICBjbGFzc1RvQWRkOiAndmlzaWJsZSBhbmltYXRlZCBib3VuY2VJblJpZ2h0JyxcbiAgICAgICAgb2Zmc2V0OiAxMDBcbiAgICB9KTtcbiAgICAkKCcuanNfc2xpZGVfbGVmdCcpLmFkZENsYXNzKCdoaWRkZW4nKS52aWV3cG9ydENoZWNrZXIoe1xuICAgICAgICBjbGFzc1RvQWRkOiAndmlzaWJsZSBhbmltYXRlZCBib3VuY2VJbkxlZnQnLFxuICAgICAgICBvZmZzZXQ6IDEwMFxuICAgIH0pO1xuICAgICQoJy5qc19zbGlkZV9ib3R0b20nKS5hZGRDbGFzcygnaGlkZGVuJykudmlld3BvcnRDaGVja2VyKHtcbiAgICAgICAgY2xhc3NUb0FkZDogJ3Zpc2libGUgYW5pbWF0ZWQgYm91bmNlSW5VcCcsXG4gICAgICAgIG9mZnNldDogMTAwXG4gICAgfSk7Ki9cbn0pO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuYXBwID0ge307XG5cbiAgICAvLyDQmtCw0LvRjNC60YPQu9GP0YLQvtGAXG4gICAgYXBwLmNhbGN1bGF0b3IgPSBuZXcgQ2FsY3VsYXRvck1vZGVsKHt9KTtcblxuICAgIGFwcC5jYWxjdWxhdG9yVmlldyA9IG5ldyBDYWxjdWxhdG9yVmlldyh7XG4gICAgICAgIG1vZGVsOiBhcHAuY2FsY3VsYXRvcixcbiAgICAgICAgZWw6ICdmb3JtLmNhbGMnXG4gICAgfSk7XG5cbiAgICBsZXQgQXBwTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgICAgICBkZWZhdWx0czoge31cbiAgICB9KTtcblxuICAgIGFwcC5tb2RlbCA9IG5ldyBBcHBNb2RlbCgpO1xuXG4gICAgdmFyIEFwcFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAnYm9keScsXG5cbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgLmpzLXRhYic6ICdjaGFuZ2VUYWInLFxuICAgICAgICAgICAgJ2ZvY3Vzb3V0IC5maWVsZCBpbnB1dFtyZXF1aXJlZF0nOiAndmFsaWRhdGVGaWVsZCcsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXVzZXItcmVnaXN0ZXInOiAncmVnaXN0ZXJVc2VyJyxcbiAgICAgICAgICAgICdjbGljayAuanMtZmVlZGJhY2snOiAnc2VuZEZlZWRiYWNrJyxcbiAgICAgICAgICAgICdjbGljayAuanMtbG9naW4tdXNlcic6ICdsb2dpblVzZXInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1wb3B1cC1yZWdpc3Rlcic6ICdzaG93UmVnaXN0ZXJQb3B1cCcsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXBvcHVwLWxvZ2luJzogJ3Nob3dMb2dpblBvcHVwJyxcbiAgICAgICAgICAgICdjbGljayAuanMtc2hvdy12aWRlbyc6ICdzaG93UG9wdXBWaWRlbycsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXNob3ctZmVlZGJhY2snOiAnc2hvd1BvcHVwRmVlZGJhY2snLFxuXHRcdFx0J2NsaWNrIC5qc19xdWVzdC10YXJnZXQnOiAnc2VsZWN0RmVlZGJhY2tUaGVtZScsXG4gICAgICAgICAgICAna2V5cHJlc3MgLmpzX25vdF9sZXR0ZXJzJzogJ2NoZWNrU3ltYm9sJyxcbiAgICAgICAgICAgICdjbGljayAuanMtY2xvc2UtcG9wdXAnOiAnY2xvc2VQb3B1cCdcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjdXNlclBob25lJykubWFzayhcIis3ICg5OTkpIDk5OS05OTk5XCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNoYW5nZVRhYjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGxldCB0eXBlVGFiID0gJChlLmN1cnJlbnRUYXJnZXQpLnBhcmVudCgnLmpzLWJsb2NrLXRhYnMnKS5kYXRhKCd0YWJzJykgfHwgJ2NoYW5nZVF1ZXN0JztcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlVGFiKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2FsY1R5cGVQZXJzb24nOlxuICAgICAgICAgICAgICAgICAgICAkKCcuY2FsYy10YWItLWFjdGl2ZScpLmFkZChlLmN1cnJlbnRUYXJnZXQpLnRvZ2dsZUNsYXNzKCdjYWxjLXRhYi0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3doeUNoYW5nZUNvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICAkKCcud2h5LXRhYi0tYWN0aXZlJykuYWRkKGUuY3VycmVudFRhcmdldCkudG9nZ2xlQ2xhc3MoJ3doeS10YWItLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGFiV2h5SWQgPSAkKCcud2h5LXRhYi0tYWN0aXZlJykuZGF0YSgndGFiJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy53aHktY29udGVudCcpLnJlbW92ZUNsYXNzKCd3aHktY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJyN3aHktY29udGVudC0nICsgdGFiV2h5SWQpLmFkZENsYXNzKCd3aHktY29udGVudC0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NoYW5nZVF1ZXN0JzpcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLXRhYi1xdWVzdC0tYWN0aXZlJykuYWRkKGUuY3VycmVudFRhcmdldCkudG9nZ2xlQ2xhc3MoJ2pzLXRhYi1xdWVzdC0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWJRdWVzdElkID0gJCgnLmpzLXRhYi1xdWVzdC0tYWN0aXZlJykuZGF0YSgndGFiJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy1jb250ZW50LXF1ZXN0JykucmVtb3ZlQ2xhc3MoJ2pzLWNvbnRlbnQtcXVlc3QtLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjcXVlc3RUYWItJyArIHRhYlF1ZXN0SWQpLmFkZENsYXNzKCdqcy1jb250ZW50LXF1ZXN0LS1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDQvdCwINC70LXRgtGDXG4gICAgICAgIHZhbGlkYXRlRmllbGQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBsZXQgZWxtID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBlbG0udmFsKCksXG4gICAgICAgICAgICAgICAgbWluID0gZWxtLmF0dHIoJ21pbicpLFxuICAgICAgICAgICAgICAgIG1heCA9IGVsbS5hdHRyKCdtYXgnKSxcbiAgICAgICAgICAgICAgICByZWd4ID0gZWxtLmF0dHIoJ2RhdGEtcmVneCcpIHx8ICcnLFxuICAgICAgICAgICAgICAgIHJlcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyDQn9GA0L7QstC10YDQutCwINC80L7QsS4g0YLQtdC70LXRhNC+0L3QsFxuICAgICAgICAgICAgaWYgKGVsbS5kYXRhKCd0eXBlZmllbGQnKSA9PT0gJ3Bob25lJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJysnICsgdmFsdWUucmVwbGFjZSgvXFxEKy9nLCAnJyk7XG4gICAgICAgICAgICAgICAgaWYgKF8uaXNOdWxsKHZhbHVlLm1hdGNoKEFwcEhlbHBlcnMucmVneE1vYmlsZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZWxtLmRhdGEoJ3R5cGVmaWVsZCcpID09PSAncmVwYXNzd29yZCcpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PT0gJCgnI3VzZXJwYXNzJykudmFsKCkgPyByZXMgPSB0cnVlIDogcmVzID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlLmxlbmd0aCA8IG1pbiB8fCB2YWx1ZS5sZW5ndGggPiBtYXggPyByZXMgPSBmYWxzZSA6IHJlcyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgICAgICBlbG0uYWRkQ2xhc3MoJ3ZhbGlkLWVyciBlcnItZmllbGQnKTtcbiAgICAgICAgICAgICAgICBlbG0ucmVtb3ZlQ2xhc3MoJ3ZhbGlkLW9rJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsbS5hZGRDbGFzcygndmFsaWQtb2snKTtcbiAgICAgICAgICAgICAgICBlbG0ucmVtb3ZlQ2xhc3MoJ3ZhbGlkLWVyciBlcnItZmllbGQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXG4gICAgICAgIHJlZ2lzdGVyVXNlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgc3VtOiBhcHAuY2FsY3VsYXRvci5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgICAgIHBlcmlvZDogYXBwLmNhbGN1bGF0b3IuZ2V0KCdwZXJpb2QnKSxcbiAgICAgICAgICAgICAgICBwaG9uZTogJCgnaW5wdXQjdXNlclBob25lJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICQoJ2lucHV0I3VzZXJwYXNzJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzc3dvcmRfYWdhaW46ICQoJ2lucHV0I3VzZXJSZVBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBhZ3JlZW1lbnQ6ICQoJ2lucHV0I3VzZXJBZ3JlZW1lbnQnKS5wcm9wKCdjaGVja2VkJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICgkKCdpbnB1dCNpbnZlc3RvcicpKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5pbnZlc3RvciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ3VzZXJSZWdpc3RlckZvcm0nKSkge1xuICAgICAgICAgICAgICAgIEFwcEhlbHBlcnMuYWpheFdyYXBwZXIoXG4gICAgICAgICAgICAgICAgICAgICcvYXBpL3JlZ2lzdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEuc2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEuc2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWVsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmllbGRzWzBdLnBob25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmluVmFsaWRhdGVQaG9uZShkYXRhLmZpZWxkc1swXS5waG9uZS5tc2dOb3RNT0JJTEUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWVyci1yZWdpc3Rlci1tc2cnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCe0YLQv9GA0LDQstC60LAg0YTQvtGA0LzRiyDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgc2VuZEZlZWRiYWNrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2ZlZWRiYWNrRm9ybScpO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgdGhlbWU6ICQoJyNmZWVkVGhlbWUnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBlbWFpbDogJCgnaW5wdXQjZmVlZEVtYWlsJykudmFsKCksXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJCgndGV4dGFyZWEjZmVlZE1lc3NhZ2UnKS52YWwoKVxuICAgICAgICAgICAgfTtcblxuXG5cdFx0XHRpZiAoQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ2ZlZWRiYWNrRm9ybScpKSB7XG5cdFx0XHRcdEFwcEhlbHBlcnMuYWpheFdyYXBwZXIoXG4gICAgICAgICAgICAgICAgICAgICcvYXBpL2ZlZWRiYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0KHQsdGA0LDRgdGL0LLQsNC10Lwg0YTQvtGA0LzRg1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNmZWVkYmFja0Zvcm0nKS50cmlnZ2VyKCdyZXNldCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5qcy1tc2ctc3VjY2VzJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNmZWVkYmFja0Zvcm0nKS5maW5kKCcuZXJyUmVzcG9uc2UnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmZpZWxkc1swXS5lbWFpbCA/IEFwcEhlbHBlcnMuaW5WYWxpZGF0ZUVtYWlsRmVlZGJhY2soZGF0YS5maWVsZHNbMF0uZW1haWwuZW1haWxBZGRyZXNzSW52YWxpZEZvcm1hdCkgOiAkKCcuanMtZXJyLWVtYWlsLWZlZWRiYWNrLW1zZycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5maWVsZHNbMF0ubWVzc2FnZSA/IEFwcEhlbHBlcnMuaW5WYWxpZGF0ZU1lc3NhZ2VGZWVkYmFjayhkYXRhLmZpZWxkc1swXS5tZXNzYWdlLnN0cmluZ0xlbmd0aFRvb1Nob3J0KSA6ICQoJy5qcy1lcnItbWVzc2FnZS1mZWVkYmFjay1tc2cnKS5oaWRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjZmVlZGJhY2tGb3JtJykuZmluZCgnLmVyclJlc3BvbnNlJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcblx0XHRcdH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQkNCy0YLQvtGA0LjQt9Cw0YbQuNGPINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj1xuICAgICAgICBsb2dpblVzZXI6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIEFwcEhlbHBlcnMuZm9ybVZhbGlkYXRlKCd1c2VyTG9naW5Gb3JtJyk7XG5cbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGxvZ2luOiAkKCdpbnB1dFtuYW1lPXVzZXJOYW1lXScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiAkKCdpbnB1dCN1c2VyTG9naW5QYXNzJykudmFsKClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgndXNlckxvZ2luRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9hcGkvYXV0aCcsXG4gICAgICAgICAgICAgICAgICAgICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBkYXRhLnNpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLm1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICAgICAgICBzaG93UmVnaXN0ZXJQb3B1cDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciB0ID0gTWF0aC5taW4oJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgNTAsICQoJyNyb290JykuaGVpZ2h0KCkgLSAkKHdpbmRvdykuaGVpZ2h0KCkpO1xuXG4gICAgICAgICAgICAkKCcucG9wdXAtLXJlZ2lzdGVyJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6IHQgKyAncHgnXG4gICAgICAgICAgICB9KS5mYWRlSW4oMjUwKTtcblxuICAgICAgICAgICAgJCgnI3Jvb3QnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0LDQstGC0L7RgNC40LfQsNGG0LjQuFxuICAgICAgICBzaG93TG9naW5Qb3B1cDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciB0ID0gTWF0aC5taW4oJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgNTAsICQoJyNyb290JykuaGVpZ2h0KCkgLSAkKHdpbmRvdykuaGVpZ2h0KCkpO1xuXG4gICAgICAgICAgICAkKCcucG9wdXAtLWxvZ2luJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6IHQgKyAncHgnXG4gICAgICAgICAgICB9KS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNyb290JykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDQn9C+0L/QsNC/INGBINCy0LjQtNC10L5cbiAgICAgICAgc2hvd1BvcHVwVmlkZW86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5wb3B1cC0teW91dHViZScpLmZhZGVJbigyMDApO1xuICAgICAgICAgICAgJCgnI3Jvb3QnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNob3dQb3B1cEZlZWRiYWNrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHQgPSBNYXRoLm1pbigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyA1MCwgJCgnI3Jvb3QnKS5oZWlnaHQoKSAtICQod2luZG93KS5oZWlnaHQoKSkgKyA4MDtcblxuICAgICAgICAgICAgJCgnLnBvcHVwLS1mZWVkYmFjaycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ21hcmdpbi10b3AnOiB0ICsgJ3B4J1xuICAgICAgICAgICAgfSkuZmFkZUluKDI1MCk7XG4gICAgICAgICAgICAkKCcjcm9vdCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cblx0XHRzZWxlY3RGZWVkYmFja1RoZW1lOiBmdW5jdGlvbiAoZSkge1xuXHRcdFx0bGV0IGVsbSA9ICQoJyNqc1NlbGVjdFRoZW1lJyksXG5cdFx0XHRcdGlkVGhlbWUgPSAkKGUudGFyZ2V0KS5kYXRhKCd0aGVtZScpLFxuXHRcdFx0XHR2YWx1ZSA9ICQoZS50YXJnZXQpLmh0bWwoKTtcblxuXHRcdFx0ZWxtLmh0bWwoQXBwSGVscGVycy5jdXRTdHJpbmcodmFsdWUsIDI3KSk7XG5cblx0XHRcdCQoJyNmZWVkVGhlbWUnKS52YWwodmFsdWUpO1xuXHRcdH0sXG5cbiAgICAgICAgY2hlY2tTeW1ib2w6IGZ1bmN0aW9uIChlKSB7XG5cdFx0ICAgIGNvbnNvbGUubG9nKGUpO1xuXHRcdCAgICBlID0gZSB8fCBldmVudDtcblxuICAgICAgICAgICAgaWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSB8fCBlLm1ldGFLZXkpIHJldHVybjtcblxuICAgICAgICAgICAgdmFyIGNociA9IEFwcEhlbHBlcnMuZ2V0Q2hhcihlKTtcbiAgICAgICAgICAgIGlmIChjaHIgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBpZiAoY2hyIDwgJzAnIHx8IGNociA+ICc5JykgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCX0LDQutGA0YvRgtGMINC/0L7Qv9Cw0L9cbiAgICAgICAgY2xvc2VQb3B1cDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIC8vINCS0YvQutC70Y7Rh9Cw0LXQvCDQstC40LTQtdC+XG4vKiAgICAgICAgICAgIHZhciBpZnJhbWUgPSAkKCcjdmlkZW8tdmltZW8nKVswXTtcbiAgICAgICAgICAgIHZhciBwbGF5ZXIgPSAkZihpZnJhbWUpO1xuICAgICAgICAgICAgcGxheWVyLmFwaSgndW5sb2FkJyk7Ki9cblxuICAgICAgICAgICAgJCgnLnBvcHVwJykuZmFkZU91dCgyMDApO1xuICAgICAgICAgICAgJCgnI3Jvb3QnKS5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLm1vdXNldXAoZnVuY3Rpb24gKGUpeyAvLyDRgdC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LLQtdCxLdC00L7QutGD0LzQtdC90YLRg1xuICAgICAgICB2YXIgZGl2ID0gJChcIi5wb3B1cFwiKTtcbiAgICAgICAgaWYgKCFkaXYuaXMoZS50YXJnZXQpIC8vINC10YHQu9C4INC60LvQuNC6INCx0YvQuyDQvdC1INC/0L4g0L/QvtC/0LDQv9GDXG4gICAgICAgICAgICAmJiBkaXYuaGFzKGUudGFyZ2V0KS5sZW5ndGggPT09IDApIHtcblxuLyogICAgICAgICAgICB2YXIgaWZyYW1lID0gJCgnI3ZpZGVvLXZpbWVvJylbMF07XG4gICAgICAgICAgICB2YXIgcGxheWVyID0gJGYoaWZyYW1lKTtcbiAgICAgICAgICAgIHBsYXllci5hcGkoJ3VubG9hZCcpOyovXG5cbiAgICAgICAgICAgIGRpdi5mYWRlT3V0KDIwMCk7IC8vINGB0LrRgNGL0LLQsNC10LxcbiAgICAgICAgICAgICQoJyNyb290JykucmVtb3ZlQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBwLnZpZXcgPSBuZXcgQXBwVmlldygpO1xuXG4gICAgLy8g0KHQu9Cw0LnQtNC10YDRi1xuICAgIEFwcEhlbHBlcnMuaW5pdFNsaWRlcnMoKTtcblxufSk7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDEuMDIuMTcuXG4gKi9cblxuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgQ2FsY3VsYXRvck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAvLyDQl9C90LDRh9C10L3QuNGPINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3VtOiA1MDAwMDAsXG4gICAgICAgIHBlcmlvZDogMzY1XG4gICAgfSxcblxuICAgIGluY29tZU1vbmV5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzdW0gPSBhcHAuY2FsY3VsYXRvci5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgcGVyaW9kID0gYXBwLmNhbGN1bGF0b3IuZ2V0KCdwZXJpb2QnKTtcblxuICAgICAgICBsZXQgcmVzID0gTWF0aC5yb3VuZChzdW0gKiAoMSArIEFwcENvbnN0YW50cy5wZXJjZW50ICogcGVyaW9kIC8gMzY1KSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FsY3VsYXRvck1vZGVsOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDAzLjAyLjE3LlxuICovXG5pbXBvcnQgQXBwSGVscGVycyBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCBBcHBDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzJztcblxudmFyIENhbGN1bGF0b3JWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gICAgLy8g0J/QvtC70LfRg9C90LrQuFxuICAgIHN1bVJhbmdlOiAnaW5wdXQjc2VsZWN0U3VtUmFuZ2UnLCAvLyDQodGD0LzQvNCwXG4gICAgcGVyaW9kUmFuZ2U6ICdpbnB1dCNzZWxlY3RQZXJpb2RSYW5nZScsIC8vINCf0LXRgNC40L7QtFxuXG4gICAgLy8g0J/QvtC70Y9cbiAgICBzdW1GaWVsZDogJ2lucHV0I3NlbGVjdFN1bUZpZWxkJywgLy8g0KHRg9C80LzQsFxuICAgIHBlcmlvZEZpZWxkOiAnaW5wdXQjc2VsZWN0UGVyaW9kRmllbGQnLCAvLyDQn9C10YDQuNC+0LRcblxuICAgIGV2ZW50czoge1xuICAgICAgICAnaW5wdXQgaW5wdXQjc2VsZWN0U3VtUmFuZ2UnOiAnY2hhbmdlU3VtUmFuZ2UnLFxuICAgICAgICAnZm9jdXNvdXQgaW5wdXQjc2VsZWN0U3VtRmllbGQnOiAnY2hhbmdlU3VtRmllbGQnLFxuXG4gICAgICAgICdpbnB1dCBpbnB1dCNzZWxlY3RQZXJpb2RSYW5nZSc6ICdjaGFuZ2VQZXJpb2RSYW5nZScsXG4gICAgICAgICdmb2N1c291dCBpbnB1dCNzZWxlY3RQZXJpb2RGaWVsZCc6ICdjaGFuZ2VQZXJpb2RGaWVsZCcsXG5cbiAgICAgICAgLy8g0JfQsNC/0YDQtdGJ0LDQtdC8INCy0LLQvtC0INCx0YPQutCyINCyINC/0L7Qu9GPXG4gICAgICAgICdrZXlwcmVzcyBpbnB1dC5jYWxjLWZpZWxkJzogJ2NoZWNrRmllbGQnXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJCgnI3RlbXBsYXRlQ2FsYycpLmh0bWwoKSk7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgdGhpcy5jaGFuZ2UsIHRoaXMpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVuZGVyZWQgPSB0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwuYXR0cmlidXRlcyk7XG4gICAgICAgIHRoaXMuJGVsLmh0bWwocmVuZGVyZWQpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgc3VtID0gdGhpcy5tb2RlbC5nZXQoJ3N1bScpLFxuICAgICAgICAgICAgcGVyaW9kID0gdGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpO1xuXG4gICAgICAgIC8vINCSINC/0L7Qu9C1INGB0YPQvNC80YtcbiAgICAgICAgJCh0aGlzLnN1bUZpZWxkKS52YWwodGhpcy5tb2RlbC5nZXQoJ3N1bScpKTtcblxuICAgICAgICAvLyDQkiDQv9C+0LvQtSDQv9C10YDQuNC+0LTQsFxuICAgICAgICAkKHRoaXMucGVyaW9kRmllbGQpLnZhbCh0aGlzLm1vZGVsLmdldCgncGVyaW9kJykpO1xuXG4gICAgICAgIC8vINCc0LXQvdGP0Lwg0LfQvdCw0YfQtdC90LjQtSDQv9C+0LvQt9GD0L3QutCwINGB0YPQvNC80YtcbiAgICAgICAgJCh0aGlzLnN1bVJhbmdlKS52YWwodGhpcy5tb2RlbC5nZXQoJ3N1bScpKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgJCh0aGlzLnN1bVJhbmdlKS5hdHRyKCdtYXgnKSwgJCh0aGlzLnN1bVJhbmdlKS5hdHRyKCdtaW4nKSwgZmFsc2UpO1xuXG4gICAgICAgIC8vINCc0LXQvdGP0LXQvCDQt9C90LDRh9C10L3QuNC6INC/0L7Qu9C30YPQvdC60LAg0L/QtdGA0LjQvtC00LBcbiAgICAgICAgJCh0aGlzLnBlcmlvZFJhbmdlKS52YWwodGhpcy5tb2RlbC5nZXQoJ3BlcmlvZCcpKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcigncGVyaW9kJywgJCh0aGlzLnBlcmlvZFJhbmdlKS5hdHRyKCdtYXgnKSwgJCh0aGlzLnBlcmlvZFJhbmdlKS5hdHRyKCdtaW4nKSwgZmFsc2UpO1xuXG4gICAgICAgIC8vINCy0L7Qt9Cy0YDQsNGCXG4gICAgICAgICQoJy5qcy1pbmZvLXJldHVybicpLmh0bWwoQXBwSGVscGVycy5mb3JtYXROdW1iZXIodGhpcy5tb2RlbC5pbmNvbWVNb25leSgpKSArICcgPHNwYW4gY2xhc3M9XCJzeW1fcnViXCI+bzwvc3Bhbj4nKTtcbiAgICAgICAgLy8g0LTQvtGF0L7QtFxuICAgICAgICAkKCcuanMtaW5mby1pbmNvbWUnKS5odG1sKFxuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtYXROdW1iZXIoTWF0aC5yb3VuZCh0aGlzLm1vZGVsLmluY29tZU1vbmV5KCkgLSB0aGlzLm1vZGVsLmdldCgnc3VtJykpKSArICcgPHNwYW4gY2xhc3M9XCJzeW1fcnViXCI+bzwvc3Bhbj4nXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VHcmFwaFJlcyh0aGlzLm1vZGVsLmluY29tZU1vbmV5KCksIHRoaXMubW9kZWwuaW5jb21lTW9uZXkoKSAtIHRoaXMubW9kZWwuZ2V0KCdzdW0nKSk7XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDQv9C+0LvQt9GD0L3QutCwICh0eXBlOiBzdW0gfHwgbWF4KVxuICAgIGNoYW5nZVJhbmdlU2xpZGVyOiBmdW5jdGlvbiAodHlwZSwgbWF4LCBtaW4sIGNoYW5nZU1vZGVsKSB7XG4gICAgICAgIGxldCByYW5nZSA9ICQoJ2lucHV0LmpzLXJhbmdlLS0nICsgdHlwZSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJChyYW5nZVtpXSlcbiAgICAgICAgICAgICAgICAuYXR0cignbWF4JywgbWF4KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdtaW4nLCBtaW4pXG4gICAgICAgICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICgkKHJhbmdlW2ldKS52YWwoKSAtICQocmFuZ2VbaV0pLmF0dHIoJ21pbicpKSAqIDEwMCAvICgkKHJhbmdlW2ldKS5hdHRyKCdtYXgnKSAtICQocmFuZ2VbaV0pLmF0dHIoJ21pbicpKSArICclIDEwMCUnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChjaGFuZ2VNb2RlbCkgdGhpcy5tb2RlbC5zZXQodHlwZSwgcGFyc2VJbnQoJChyYW5nZVtpXSkudmFsKCkpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDQmNC30LzQtdC90LXQvdC40LUg0YHRg9C80LzRiyDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9C30YPQvdC60LBcbiAgICBjaGFuZ2VTdW1SYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgbWluID0gJCh0aGlzLnN1bVJhbmdlKS5hdHRyKCdtaW4nKSxcbiAgICAgICAgICAgIG1heCA9ICQodGhpcy5zdW1SYW5nZSkuYXR0cignbWF4Jyk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VSYW5nZVNsaWRlcignc3VtJywgbWF4LCBtaW4sIHRydWUpO1xuICAgIH0sXG5cbiAgICAvLyDQmNC30LzQtdC90LXQvdC40LUg0YHRg9C80LzRiyDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9GPXG4gICAgY2hhbmdlU3VtRmllbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gJCh0aGlzLnN1bUZpZWxkKS52YWwoKSxcbiAgICAgICAgICAgIHJlbSA9IHZhbHVlICUgMTAwO1xuXG4gICAgICAgIGlmIChyZW0gIT09IDApIHZhbHVlID0gdmFsdWUgLSByZW07XG5cbiAgICAgICAgaWYgKHBhcnNlSW50KHZhbHVlKSA+IEFwcENvbnN0YW50cy5tYXhfc3VtIHx8IHBhcnNlSW50KHZhbHVlKSA8IEFwcENvbnN0YW50cy5taW5fc3VtKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFwcC5jYWxjdWxhdG9yLmRlZmF1bHRzLnN1bTtcbiAgICAgICAgICAgICQodGhpcy5zdW1GaWVsZCkudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdzdW0nLCBwYXJzZUludCh2YWx1ZSkpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3N1bScsICQodGhpcy5zdW1SYW5nZSkuYXR0cignbWF4JyksICQodGhpcy5zdW1SYW5nZSkuYXR0cignbWluJykpO1xuICAgIH0sXG5cbiAgICAvLyDQmNC30LzQtdC90LXQvdC40LUg0L/QtdGA0LjQvtC00LAg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlUGVyaW9kUmFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1pbiA9ICQodGhpcy5wZXJpb2RSYW5nZSkuYXR0cignbWluJyksXG4gICAgICAgICAgICBtYXggPSAkKHRoaXMucGVyaW9kUmFuZ2UpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsIG1heCwgbWluLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INC/0LXRgNC40L7QtNCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70Y9cbiAgICBjaGFuZ2VQZXJpb2RGaWVsZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSAkKHRoaXMucGVyaW9kRmllbGQpLnZhbCgpLFxuICAgICAgICAgICAgcmVtID0gdmFsdWUgJSAxMDA7XG5cbiAgICAgICAgLy8gaWYgKHJlbSAhPT0gMCkgdmFsdWUgPSB2YWx1ZSAtIHJlbTtcblxuICAgICAgICBpZiAoTnVtYmVyKHZhbHVlKSA+IEFwcENvbnN0YW50cy5tYXhfcGVyaW9kIHx8IE51bWJlcih2YWx1ZSkgPCBBcHBDb25zdGFudHMubWluX3BlcmlvZCkge1xuICAgICAgICAgICAgdmFsdWUgPSBhcHAuY2FsY3VsYXRvci5kZWZhdWx0cy5wZXJpb2Q7XG4gICAgICAgICAgICAkKHRoaXMucGVyaW9kRmllbGQpLnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgncGVyaW9kJywgdmFsdWUpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsICQodGhpcy5wZXJpb2RSYW5nZSkuYXR0cignbWF4JyksICQodGhpcy5wZXJpb2RSYW5nZSkuYXR0cignbWluJykpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VHcmFwaFJlczogZnVuY3Rpb24gKHN1bVJldHVybiwgc3VtSW5jb21lKSB7XG4gICAgICAgIGxldCBwcm9maXRfbWF4ID0gTWF0aC5yb3VuZChBcHBDb25zdGFudHMubWF4X3N1bSAqICgxICsgQXBwQ29uc3RhbnRzLnBlcmNlbnQgKiA3MzAgLyAzNjUpKSxcbiAgICAgICAgICAgIGJsdWVfaGVpZ2h0X21heCA9IEFwcENvbnN0YW50cy5tYXhfc3VtLyhwcm9maXRfbWF4KSxcbiAgICAgICAgICAgIGdyZWVuX2hlaWdodF9tYXggPSAocHJvZml0X21heCAtIEFwcENvbnN0YW50cy5tYXhfc3VtKS8ocHJvZml0X21heCk7XG5cbiAgICAgICAgbGV0IGdyZWVuX2hlaWdodCA9IHN1bVJldHVybiAvIEFwcENvbnN0YW50cy5tYXhfc3VtICogYmx1ZV9oZWlnaHRfbWF4ICogOTUgKyAnJScsXG4gICAgICAgICAgICBibHVlX2hlaWdodCA9IHN1bUluY29tZSAvIChwcm9maXRfbWF4IC0gQXBwQ29uc3RhbnRzLm1heF9zdW0pICogZ3JlZW5faGVpZ2h0X21heCAqIDE2MCArICclJztcblxuICAgICAgICAkKCcuanNfZ3JhcGhfX2luY29tZScpLmNzcygnaGVpZ2h0JywgYmx1ZV9oZWlnaHQpO1xuICAgICAgICAkKCcuanNfZ3JhcGhfX3JldHVybicpLmNzcygnaGVpZ2h0JywgZ3JlZW5faGVpZ2h0KTtcbiAgICB9LFxuXG4gICAgY2hlY2tGaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZSA9IGUgfHwgZXZlbnQ7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSB8fCBlLm1ldGFLZXkpIHJldHVybjtcblxuICAgICAgICB2YXIgc3ltID0gQXBwSGVscGVycy5nZXRDaGFyKGUpO1xuXG4gICAgICAgIGlmIChzeW0gPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChzeW0gPCAnMCcgfHwgc3ltID4gJzknKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FsY3VsYXRvclZpZXc7IiwidmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICBtYXhfcGVyaW9kOiA3MzAsXG4gICAgbWluX3BlcmlvZDogMzAsXG5cbiAgICBtYXhfc3VtOiAxMDAwMDAwLFxuICAgIG1pbl9zdW06IDEwMDAsXG5cbiAgICBwZXJjZW50OiAwLjMxMlxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29uc3RhbnRzOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjAyLjE3LlxuICovXG52YXIgQXBwSGVscGVycyA9IHtcbiAgICBiYXNlVXJsOiAnJyxcblxuICAgIHJlZ3hNb2JpbGU6IC9eKD86OCg/Oig/OjIxfDIyfDIzfDI0fDUxfDUyfDUzfDU0fDU1KXwoPzoxNVxcZFxcZCkpP3xcXCs/Nyk/KD86KD86M1swNDU4OV18NFswMTI3ODldfDhbXjg5XFxEXXw5XFxkKVxcZCk/XFxkezd9JC8sXG5cbiAgICBpbml0U2xpZGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2xpZGVycyA9ICQoJy5qcy1zbGlkZXItcGVwcGVyJyk7XG5cbiAgICAgICAgc2xpZGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0aGF0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBhbGxTbGlkZXIgPSB0aGF0LmZpbmQoJy5wZXBwZXJtaW50JyksXG4gICAgICAgICAgICAgICAgYXJyb3dMZWZ0ID0gdGhhdC5maW5kKCcuYXJyb3ctLWxlZnQnKSxcbiAgICAgICAgICAgICAgICBhcnJvd1JpZ2h0ID0gdGhhdC5maW5kKCcuYXJyb3ctLXJpZ2h0Jyk7XG5cbiAgICAgICAgICAgIGxldCBzbGlkZXIgPSBhbGxTbGlkZXIuUGVwcGVybWludCh7XG4gICAgICAgICAgICAgICAgbW91c2VEcmFnOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVJZk9uZVNsaWRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRvdHM6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhcnJvd0xlZnQuY2xpY2soc2xpZGVyLmRhdGEoJ1BlcHBlcm1pbnQnKS5wcmV2KTtcbiAgICAgICAgICAgIGFycm93UmlnaHQuY2xpY2soc2xpZGVyLmRhdGEoJ1BlcHBlcm1pbnQnKS5uZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIGFqYXhcbiAgICBhamF4V3JhcHBlcjogKHVybCwgdHlwZSwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHR5cGUgPSB0eXBlIHx8ICdQT1NUJztcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIHN1Y2Nlc3NDYWxsYmFjayA9IHN1Y2Nlc3NDYWxsYmFjayB8fCBmdW5jdGlvbihkYXRhKSB7fTtcbiAgICAgICAgZXJyb3JDYWxsYmFjayA9IGVycm9yQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZXJtc2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcm1zZyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBBcHBIZWxwZXJzLmJhc2VVcmwgKyB1cmwsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JDYWxsYmFja1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZm9ybWF0TnVtYmVyOiAobnVtKSA9PiB7XG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGC0LXQu9C10YTQvtC90LAg0L7RgiDRgdC10YDQstC10YDQsCAo0YDQtdCz0LjRgdGC0YDQsNGG0LjRjylcbiAgICBpblZhbGlkYXRlUGhvbmU6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgJCgnI3VzZXJQaG9uZScpLmFkZENsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgJCgnLmpzLWVyci1yZWdpc3Rlci1tc2cnKS5zaG93KCkuaHRtbChtc2cpO1xuICAgIH0sXG5cbiAgICBpblZhbGlkYXRlTG9naW5Vc2VyOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICQoJy5qcy1lcnItdXNlci1sb2dpbicpLnNob3coKS5odG1sKG1zZyk7XG4gICAgfSxcblxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyBlbWFpbCDQvtGCINGB0LXRgNCy0LXRgNCwICjQvtCx0YDQsNGC0L3QsNGPINGB0LLRj9C30YwpXG4gICAgaW5WYWxpZGF0ZUVtYWlsRmVlZGJhY2s6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgJCgnI2ZlZWRFbWFpbCcpLmFkZENsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICQoJy5qcy1lcnItZW1haWwtZmVlZGJhY2stbXNnJykuc2hvdygpLmh0bWwobXNnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGB0L7QvtCx0YnQtdC90LjRjyDQvtGCINGB0LXRgNCy0LXRgNCwICjQvtCx0YDQsNGC0L3QsNGPINGB0LLRj9C30YwpXG4gICAgaW5WYWxpZGF0ZU1lc3NhZ2VGZWVkYmFjazogZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAkKCcjZmVlZE1lc3NhZ2UnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAkKCcuanMtZXJyLW1lc3NhZ2UtZmVlZGJhY2stbXNnJykuc2hvdygpLmh0bWwobXNnKTtcbiAgICB9LFxuXG4gICAgaW5WYWxpZGF0ZU1lc3NhZ2VBdXRoOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICQoJy5qcy1lcnItbWVzc2FnZS1hdXRoLW1zZycpLnNob3coKS5odG1sKG1zZyk7XG4gICAgfSxcblxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRhNC+0YDQvFxuICAgIGZvcm1WYWxpZGF0ZTogZnVuY3Rpb24gKGZvcm1JZCkge1xuICAgICAgICBsZXQgZm9ybSA9ICcjJyArIGZvcm1JZDtcblxuICAgICAgICBsZXQgcmVneCA9IHtcbiAgICAgICAgICAgIGVtYWlsOiAnXlstLl9hLXowLTldK0AoPzpbYS16MC05XVstYS16MC05XStcXC4pK1thLXpdezIsNn0kJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHN3aXRjaCAoZm9ybSkge1xuICAgICAgICAgICAgLy8g0KTQvtGA0LzQsCDRgNC10LPQuNGB0YLRgNCw0YbQuNC4XG4gICAgICAgICAgICBjYXNlICcjdXNlclJlZ2lzdGVyRm9ybSc6XG4gICAgICAgICAgICAgICAgJChmb3JtKS5maW5kKCcuZmllbGQnKS5lYWNoKGZ1bmN0aW9uIChpLCBlbG0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGC0LXQu9C10YTQvtC90LAg0Lgg0L/QsNGA0L7Qu9GPXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKGVsbSkuZGF0YSgnbWluZmllbGQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1pbiA9ICQoZWxtKS5kYXRhKCdtaW5maWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZWxtKS5maW5kKCdpbnB1dCcpLnZhbCgpIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9GL0LLQsNC10Lwg0L7RiNC40LHQutGDXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChlbG0pLmZpbmQoJy5lcnItbXNnLWZpZWxkJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxtKS5maW5kKCdpbnB1dCcpLmFkZENsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxtKS5maW5kKCcuZXJyLW1zZy1maWVsZCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsbSkuZmluZCgnaW5wdXQnKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtCy0YLQvtGA0L3Ri9C5INC/0LDRgNC+0LvRjFxuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI3VzZXJwYXNzJykudmFsKCkgIT09ICQoJyN1c2VyUmVQYXNzJykudmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1yZXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjdXNlclJlUGFzcycpLmFkZENsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJykucmVtb3ZlQ2xhc3MoJ3ZhbGlkLW9rJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuZXJyLW1zZy1maWVsZC0tcmVwYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3VzZXJSZVBhc3MnKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8g0KHQvtCz0LvQsNGB0LjQtSDQvdCwINC+0LHRgNCw0LHQvtGC0LrRg1xuICAgICAgICAgICAgICAgICAgICBpZiAoISQoJyN1c2VyQWdyZWVtZW50JykucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuZXJyLW1zZy1maWVsZC0tYWdyZWVtZW50Jykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3VzZXJBZ3JlZW1lbnQnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWFncmVlbWVudCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyN1c2VyQWdyZWVtZW50JykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8g0KTQvtGA0LzQsCDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgICAgIGNhc2UgJyNmZWVkYmFja0Zvcm0nOlxuICAgICAgICAgICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRgtC10LzRi1xuICAgICAgICAgICAgICAgIGlmICgkKCcjZmVlZFRoZW1lJykudmFsKCkgPT09IG51bGwgfHwgJCgnI2ZlZWRUaGVtZScpLnZhbCgpID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAkKCcjanNTZWxlY3RUaGVtZSwgI2ZlZWRUaGVtZScpLmFkZENsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1mZWVkX3RoZW1lJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNqc1NlbGVjdFRoZW1lJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWZlZWRfdGhlbWUnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyBlbWFpbFxuICAgICAgICAgICAgICAgIGlmICgkKCcjZmVlZEVtYWlsJykudmFsKCkubWF0Y2gocmVneC5lbWFpbCkgPT0gbnVsbCB8fCAkKCcjZmVlZEVtYWlsJykudmFsKCkubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgICAgICAgICAkKCcjZmVlZEVtYWlsJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWZlZWRfZW1haWwnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2ZlZWRFbWFpbCcpLnJlbW92ZUNsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1mZWVkX2VtYWlsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQoZm9ybSkuZmluZCgnW2RhdGEtdHlwZT1maWVsZF0nKS5lYWNoKGZ1bmN0aW9uIChpLCBlbG0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGB0L7QvtCx0YnQtdC90LjRj1xuICAgICAgICAgICAgICAgICAgICBpZiAoJChlbG0pLmRhdGEoJ21pbmZpZWxkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtaW4gPSAkKGVsbSkuZGF0YSgnbWluZmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGVsbSkuZmluZCgndGV4dGFyZWEnKS52YWwoKSA8IG1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCf0L7QutCw0LfRi9Cy0LDQtdC8INC+0YjQuNCx0LrRg1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxtKS5maW5kKCcuZXJyLW1zZy1maWVsZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsbSkuZmluZCgndGV4dGFyZWEnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsbSkuZmluZCgnLmVyci1tc2ctZmllbGQnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChlbG0pLmZpbmQoJ3RleHRhcmVhJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8g0KTQvtGA0LzQsCDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4XG4gICAgICAgICAgICBjYXNlICcjdXNlckxvZ2luRm9ybSc6XG4gICAgICAgICAgICAgICAgaWYgKCQoJ2lucHV0W25hbWU9dXNlck5hbWVdJykudmFsKCkubGVuZ3RoIDwgNCB8fCAkKCcjdXNlckxvZ2luUGFzcycpLnZhbCgpLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWxvZ2luJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1sb2dpbicpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINCf0YDQvtCy0LXRgNGP0LXQvCDQstCw0LvQuNC00LDRhtGOINCy0YHQtdGFINC/0L7Qu9C10LlcbiAgICAgICAgaWYgKCQoZm9ybSkuZmluZCgnLmVyci1maWVsZCcgfHwgJy52YWxpZC1lcnInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjdXRTdHJpbmc6IGZ1bmN0aW9uICh0eHQsIGxpbWl0KSB7XG4gICAgICAgIHR4dCA9IHR4dC50cmltKCk7XG5cbiAgICAgICAgaWYoIHR4dC5sZW5ndGggPD0gbGltaXQpIHJldHVybiB0eHQ7XG5cbiAgICAgICAgdHh0ID0gdHh0LnNsaWNlKCAwLCBsaW1pdCk7XG4gICAgICAgIGxldCBsYXN0U3BhY2UgPSB0eHQubGFzdEluZGV4T2YoXCIgXCIpO1xuXG4gICAgICAgIGlmKCBsYXN0U3BhY2UgPiAwKSB7XG4gICAgICAgICAgICB0eHQgPSB0eHQuc3Vic3RyKDAsIGxhc3RTcGFjZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR4dCArIFwiIC4uLlwiO1xuICAgIH0sXG5cbiAgICBnZXRDaGFyOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlIDwgMzIpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQua2V5Q29kZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC53aGljaCAhPSAwICYmIGV2ZW50LmNoYXJDb2RlICE9IDApIHtcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA8IDMyKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LndoaWNoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwSGVscGVyczsiXX0=
