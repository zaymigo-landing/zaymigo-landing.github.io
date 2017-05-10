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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJmcm9udC9kZXYvYWxsLWFzc2V0cy9qcy9hcHAuanMiLCJmcm9udC9kZXYvYWxsLWFzc2V0cy9qcy9hcHAvQ2FsY3VsYXRvck1vZGVsLmpzIiwiZnJvbnQvZGV2L2FsbC1hc3NldHMvanMvYXBwL0NhbGN1bGF0b3JWaWV3LmpzIiwiZnJvbnQvZGV2L2FsbC1hc3NldHMvanMvY29uc3RhbnRzLmpzIiwiZnJvbnQvZGV2L2FsbC1hc3NldHMvanMvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLEVBQUUsUUFBRixFQUFZLEtBQVosQ0FBa0IsWUFBVztBQUM3Qjs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQyxDQWpCRDs7QUFtQkEsRUFBRSxZQUFZO0FBQ1YsV0FBTyxHQUFQLEdBQWEsRUFBYjs7QUFFQTtBQUNBLFFBQUksVUFBSixHQUFpQiw4QkFBb0IsRUFBcEIsQ0FBakI7O0FBRUEsUUFBSSxjQUFKLEdBQXFCLDZCQUFtQjtBQUNwQyxlQUFPLElBQUksVUFEeUI7QUFFcEMsWUFBSTtBQUZnQyxLQUFuQixDQUFyQjs7QUFLQSxRQUFJLFdBQVcsU0FBUyxLQUFULENBQWUsTUFBZixDQUFzQjtBQUNqQyxrQkFBVTtBQUR1QixLQUF0QixDQUFmOztBQUlBLFFBQUksS0FBSixHQUFZLElBQUksUUFBSixFQUFaOztBQUVBLFFBQUksVUFBVSxTQUFTLElBQVQsQ0FBYyxNQUFkLENBQXFCO0FBQy9CLFlBQUksTUFEMkI7O0FBRy9CLGdCQUFRO0FBQ0osNkJBQWlCLFdBRGI7QUFFSiwrQ0FBbUMsZUFGL0I7QUFHSix1Q0FBMkIsY0FIdkI7QUFJSixrQ0FBc0IsY0FKbEI7QUFLSixvQ0FBd0IsV0FMcEI7QUFNSix3Q0FBNEIsbUJBTnhCO0FBT0oscUNBQXlCLGdCQVBy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ZSxJQUFuQixFQUF5QjtBQUNyQixnQkFBSSxNQUFNLE9BQU4sR0FBZ0IsRUFBcEIsRUFBd0IsT0FBTyxJQUFQO0FBQ3hCLG1CQUFPLE9BQU8sWUFBUCxDQUFvQixNQUFNLE9BQTFCLENBQVA7QUFDSDs7QUFFRCxZQUFJLE1BQU0sS0FBTixJQUFlLENBQWYsSUFBb0IsTUFBTSxRQUFOLElBQWtCLENBQTFDLEVBQTZDO0FBQ3pDLGdCQUFJLE1BQU0sS0FBTixHQUFjLEVBQWxCLEVBQXNCLE9BQU8sSUFBUDtBQUN0QixtQkFBTyxPQUFPLFlBQVAsQ0FBb0IsTUFBTSxLQUExQixDQUFQO0FBQ0g7O0FBRUQsZUFBTyxJQUFQO0FBQ0g7QUFwTVksQ0FBakI7O2tCQXVNZSxVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCBDYWxjdWxhdG9yTW9kZWwgZnJvbSAnLi9hcHAvQ2FsY3VsYXRvck1vZGVsJztcbmltcG9ydCBDYWxjdWxhdG9yVmlldyBmcm9tICcuL2FwcC9DYWxjdWxhdG9yVmlldyc7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuLyogICAgJCgnLmpzX2FuaW1hdGUnKS5hZGRDbGFzcyhcImhpZGRlblwiKS52aWV3cG9ydENoZWNrZXIoe1xuICAgICAgICBjbGFzc1RvQWRkOiAndmlzaWJsZSBhbmltYXRlZCBmYWRlSW4nLFxuICAgICAgICBvZmZzZXQ6IDEwMFxuICAgIH0pO1xuICAgICQoJy5qc19zbGlkZV9yaWdodCcpLmFkZENsYXNzKFwiaGlkZGVuXCIpLnZpZXdwb3J0Q2hlY2tlcih7XG4gICAgICAgIGNsYXNzVG9BZGQ6ICd2aXNpYmxlIGFuaW1hdGVkIGJvdW5jZUluUmlnaHQnLFxuICAgICAgICBvZmZzZXQ6IDEwMFxuICAgIH0pO1xuICAgICQoJy5qc19zbGlkZV9sZWZ0JykuYWRkQ2xhc3MoJ2hpZGRlbicpLnZpZXdwb3J0Q2hlY2tlcih7XG4gICAgICAgIGNsYXNzVG9BZGQ6ICd2aXNpYmxlIGFuaW1hdGVkIGJvdW5jZUluTGVmdCcsXG4gICAgICAgIG9mZnNldDogMTAwXG4gICAgfSk7XG4gICAgJCgnLmpzX3NsaWRlX2JvdHRvbScpLmFkZENsYXNzKCdoaWRkZW4nKS52aWV3cG9ydENoZWNrZXIoe1xuICAgICAgICBjbGFzc1RvQWRkOiAndmlzaWJsZSBhbmltYXRlZCBib3VuY2VJblVwJyxcbiAgICAgICAgb2Zmc2V0OiAxMDBcbiAgICB9KTsqL1xufSk7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5hcHAgPSB7fTtcblxuICAgIC8vINCa0LDQu9GM0LrRg9C70Y/RgtC+0YBcbiAgICBhcHAuY2FsY3VsYXRvciA9IG5ldyBDYWxjdWxhdG9yTW9kZWwoe30pO1xuXG4gICAgYXBwLmNhbGN1bGF0b3JWaWV3ID0gbmV3IENhbGN1bGF0b3JWaWV3KHtcbiAgICAgICAgbW9kZWw6IGFwcC5jYWxjdWxhdG9yLFxuICAgICAgICBlbDogJ2Zvcm0uY2FsYydcbiAgICB9KTtcblxuICAgIGxldCBBcHBNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgICAgIGRlZmF1bHRzOiB7fVxuICAgIH0pO1xuXG4gICAgYXBwLm1vZGVsID0gbmV3IEFwcE1vZGVsKCk7XG5cbiAgICB2YXIgQXBwVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICdib2R5JyxcblxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayAuanMtdGFiJzogJ2NoYW5nZVRhYicsXG4gICAgICAgICAgICAnZm9jdXNvdXQgLmZpZWxkIGlucHV0W3JlcXVpcmVkXSc6ICd2YWxpZGF0ZUZpZWxkJyxcbiAgICAgICAgICAgICdjbGljayAuanMtdXNlci1yZWdpc3Rlcic6ICdyZWdpc3RlclVzZXInLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1mZWVkYmFjayc6ICdzZW5kRmVlZGJhY2snLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1sb2dpbi11c2VyJzogJ2xvZ2luVXNlcicsXG4gICAgICAgICAgICAnY2xpY2sgLmpzLXBvcHVwLXJlZ2lzdGVyJzogJ3Nob3dSZWdpc3RlclBvcHVwJyxcbiAgICAgICAgICAgICdjbGljayAuanMtcG9wdXAtbG9naW4nOiAnc2hvd0xvZ2luUG9wdXAnLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1zaG93LXZpZGVvJzogJ3Nob3dQb3B1cFZpZGVvJyxcbiAgICAgICAgICAgICdjbGljayAuanMtc2hvdy1mZWVkYmFjayc6ICdzaG93UG9wdXBGZWVkYmFjaycsXG5cdFx0XHQnY2xpY2sgLmpzX3F1ZXN0LXRhcmdldCc6ICdzZWxlY3RGZWVkYmFja1RoZW1lJyxcbiAgICAgICAgICAgICdrZXlwcmVzcyAuanNfbm90X2xldHRlcnMnOiAnY2hlY2tTeW1ib2wnLFxuICAgICAgICAgICAgJ2NsaWNrIC5qcy1jbG9zZS1wb3B1cCc6ICdjbG9zZVBvcHVwJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJyN1c2VyUGhvbmUnKS5tYXNrKFwiKzcgKDk5OSkgOTk5LTk5OTlcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hhbmdlVGFiOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgbGV0IHR5cGVUYWIgPSAkKGUuY3VycmVudFRhcmdldCkucGFyZW50KCcuanMtYmxvY2stdGFicycpLmRhdGEoJ3RhYnMnKSB8fCAnY2hhbmdlUXVlc3QnO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVUYWIpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjYWxjVHlwZVBlcnNvbic6XG4gICAgICAgICAgICAgICAgICAgICQoJy5jYWxjLXRhYi0tYWN0aXZlJykuYWRkKGUuY3VycmVudFRhcmdldCkudG9nZ2xlQ2xhc3MoJ2NhbGMtdGFiLS1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2h5Q2hhbmdlQ29udGVudCc6XG4gICAgICAgICAgICAgICAgICAgICQoJy53aHktdGFiLS1hY3RpdmUnKS5hZGQoZS5jdXJyZW50VGFyZ2V0KS50b2dnbGVDbGFzcygnd2h5LXRhYi0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWJXaHlJZCA9ICQoJy53aHktdGFiLS1hY3RpdmUnKS5kYXRhKCd0YWInKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLndoeS1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ3doeS1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3doeS1jb250ZW50LScgKyB0YWJXaHlJZCkuYWRkQ2xhc3MoJ3doeS1jb250ZW50LS1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2hhbmdlUXVlc3QnOlxuICAgICAgICAgICAgICAgICAgICAkKCcuanMtdGFiLXF1ZXN0LS1hY3RpdmUnKS5hZGQoZS5jdXJyZW50VGFyZ2V0KS50b2dnbGVDbGFzcygnanMtdGFiLXF1ZXN0LS1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhYlF1ZXN0SWQgPSAkKCcuanMtdGFiLXF1ZXN0LS1hY3RpdmUnKS5kYXRhKCd0YWInKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWNvbnRlbnQtcXVlc3QnKS5yZW1vdmVDbGFzcygnanMtY29udGVudC1xdWVzdC0tYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNxdWVzdFRhYi0nICsgdGFiUXVlc3RJZCkuYWRkQ2xhc3MoJ2pzLWNvbnRlbnQtcXVlc3QtLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINC90LAg0LvQtdGC0YNcbiAgICAgICAgdmFsaWRhdGVGaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGxldCBlbG0gPSAkKGUudGFyZ2V0KSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGVsbS52YWwoKSxcbiAgICAgICAgICAgICAgICBtaW4gPSBlbG0uYXR0cignbWluJyksXG4gICAgICAgICAgICAgICAgbWF4ID0gZWxtLmF0dHIoJ21heCcpLFxuICAgICAgICAgICAgICAgIHJlZ3ggPSBlbG0uYXR0cignZGF0YS1yZWd4JykgfHwgJycsXG4gICAgICAgICAgICAgICAgcmVzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vINCf0YDQvtCy0LXRgNC60LAg0LzQvtCxLiDRgtC10LvQtdGE0L7QvdCwXG4gICAgICAgICAgICBpZiAoZWxtLmRhdGEoJ3R5cGVmaWVsZCcpID09PSAncGhvbmUnKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAnKycgKyB2YWx1ZS5yZXBsYWNlKC9cXEQrL2csICcnKTtcbiAgICAgICAgICAgICAgICBpZiAoXy5pc051bGwodmFsdWUubWF0Y2goQXBwSGVscGVycy5yZWd4TW9iaWxlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbG0uZGF0YSgndHlwZWZpZWxkJykgPT09ICdyZXBhc3N3b3JkJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID09PSAkKCcjdXNlcnBhc3MnKS52YWwoKSA/IHJlcyA9IHRydWUgOiByZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUubGVuZ3RoIDwgbWluIHx8IHZhbHVlLmxlbmd0aCA+IG1heCA/IHJlcyA9IGZhbHNlIDogcmVzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgICAgIGVsbS5hZGRDbGFzcygndmFsaWQtZXJyIGVyci1maWVsZCcpO1xuICAgICAgICAgICAgICAgIGVsbS5yZW1vdmVDbGFzcygndmFsaWQtb2snKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxtLmFkZENsYXNzKCd2YWxpZC1vaycpO1xuICAgICAgICAgICAgICAgIGVsbS5yZW1vdmVDbGFzcygndmFsaWQtZXJyIGVyci1maWVsZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRjyDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y9cbiAgICAgICAgcmVnaXN0ZXJVc2VyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBzdW06IGFwcC5jYWxjdWxhdG9yLmdldCgnc3VtJyksXG4gICAgICAgICAgICAgICAgcGVyaW9kOiBhcHAuY2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpLFxuICAgICAgICAgICAgICAgIHBob25lOiAkKCdpbnB1dCN1c2VyUGhvbmUnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogJCgnaW5wdXQjdXNlcnBhc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZF9hZ2FpbjogJCgnaW5wdXQjdXNlclJlUGFzcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgIGFncmVlbWVudDogJCgnaW5wdXQjdXNlckFncmVlbWVudCcpLnByb3AoJ2NoZWNrZWQnKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCQoJ2lucHV0I2ludmVzdG9yJykpIHtcbiAgICAgICAgICAgICAgICBkYXRhLmludmVzdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgndXNlclJlZ2lzdGVyRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgQXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9hcGkvcmVnaXN0ZXInLFxuICAgICAgICAgICAgICAgICAgICAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZGF0YS5zaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZGF0YS5zaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5maWVsZHNbMF0ucGhvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFwcEhlbHBlcnMuaW5WYWxpZGF0ZVBob25lKGRhdGEuZmllbGRzWzBdLnBob25lLm1zZ05vdE1PQklMRSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuanMtZXJyLXJlZ2lzdGVyLW1zZycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J7RgtC/0YDQsNCy0LrQsCDRhNC+0YDQvNGLINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfQuFxuICAgICAgICBzZW5kRmVlZGJhY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgnZmVlZGJhY2tGb3JtJyk7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0aGVtZTogJCgnI2ZlZWRUaGVtZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIGVtYWlsOiAkKCdpbnB1dCNmZWVkRW1haWwnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAkKCd0ZXh0YXJlYSNmZWVkTWVzc2FnZScpLnZhbCgpXG4gICAgICAgICAgICB9O1xuXG5cblx0XHRcdGlmIChBcHBIZWxwZXJzLmZvcm1WYWxpZGF0ZSgnZmVlZGJhY2tGb3JtJykpIHtcblx0XHRcdFx0QXBwSGVscGVycy5hamF4V3JhcHBlcihcbiAgICAgICAgICAgICAgICAgICAgJy9hcGkvZmVlZGJhY2snLFxuICAgICAgICAgICAgICAgICAgICAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnc3VjY2VzcycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQodCx0YDQsNGB0YvQstCw0LXQvCDRhNC+0YDQvNGDXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2ZlZWRiYWNrRm9ybScpLnRyaWdnZXIoJ3Jlc2V0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmpzLW1zZy1zdWNjZXMnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2ZlZWRiYWNrRm9ybScpLmZpbmQoJy5lcnJSZXNwb25zZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmllbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZmllbGRzWzBdLmVtYWlsID8gQXBwSGVscGVycy5pblZhbGlkYXRlRW1haWxGZWVkYmFjayhkYXRhLmZpZWxkc1swXS5lbWFpbC5lbWFpbEFkZHJlc3NJbnZhbGlkRm9ybWF0KSA6ICQoJy5qcy1lcnItZW1haWwtZmVlZGJhY2stbXNnJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmZpZWxkc1swXS5tZXNzYWdlID8gQXBwSGVscGVycy5pblZhbGlkYXRlTWVzc2FnZUZlZWRiYWNrKGRhdGEuZmllbGRzWzBdLm1lc3NhZ2Uuc3RyaW5nTGVuZ3RoVG9vU2hvcnQpIDogJCgnLmpzLWVyci1tZXNzYWdlLWZlZWRiYWNrLW1zZycpLmhpZGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNmZWVkYmFja0Zvcm0nKS5maW5kKCcuZXJyUmVzcG9uc2UnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuXHRcdFx0fVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCQ0LLRgtC+0YDQuNC30LDRhtC40Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXG4gICAgICAgIGxvZ2luVXNlcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtVmFsaWRhdGUoJ3VzZXJMb2dpbkZvcm0nKTtcblxuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgbG9naW46ICQoJ2lucHV0W25hbWU9dXNlck5hbWVdJykudmFsKCksXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6ICQoJ2lucHV0I3VzZXJMb2dpblBhc3MnKS52YWwoKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKEFwcEhlbHBlcnMuZm9ybVZhbGlkYXRlKCd1c2VyTG9naW5Gb3JtJykpIHtcbiAgICAgICAgICAgICAgICBBcHBIZWxwZXJzLmFqYXhXcmFwcGVyKFxuICAgICAgICAgICAgICAgICAgICAnL2FwaS9hdXRoJyxcbiAgICAgICAgICAgICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGRhdGEuc2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4XG4gICAgICAgIHNob3dSZWdpc3RlclBvcHVwOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHQgPSBNYXRoLm1pbigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyA1MCwgJCgnI3Jvb3QnKS5oZWlnaHQoKSAtICQod2luZG93KS5oZWlnaHQoKSk7XG5cbiAgICAgICAgICAgICQoJy5wb3B1cC0tcmVnaXN0ZXInKS5jc3Moe1xuICAgICAgICAgICAgICAgICdtYXJnaW4tdG9wJzogdCArICdweCdcbiAgICAgICAgICAgIH0pLmZhZGVJbigyNTApO1xuXG4gICAgICAgICAgICAkKCcjcm9vdCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0J/QvtC/0LDQvyDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4XG4gICAgICAgIHNob3dMb2dpblBvcHVwOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHQgPSBNYXRoLm1pbigkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyA1MCwgJCgnI3Jvb3QnKS5oZWlnaHQoKSAtICQod2luZG93KS5oZWlnaHQoKSk7XG5cbiAgICAgICAgICAgICQoJy5wb3B1cC0tbG9naW4nKS5jc3Moe1xuICAgICAgICAgICAgICAgICdtYXJnaW4tdG9wJzogdCArICdweCdcbiAgICAgICAgICAgIH0pLmZhZGVJbigyNTApO1xuICAgICAgICAgICAgJCgnI3Jvb3QnKS5hZGRDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vINCf0L7Qv9Cw0L8g0YEg0LLQuNC00LXQvlxuICAgICAgICBzaG93UG9wdXBWaWRlbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLnBvcHVwLS15b3V0dWJlJykuZmFkZUluKDIwMCk7XG4gICAgICAgICAgICAkKCcjcm9vdCcpLmFkZENsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvd1BvcHVwRmVlZGJhY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgdCA9IE1hdGgubWluKCQod2luZG93KS5zY3JvbGxUb3AoKSArIDUwLCAkKCcjcm9vdCcpLmhlaWdodCgpIC0gJCh3aW5kb3cpLmhlaWdodCgpKSArIDgwO1xuXG4gICAgICAgICAgICAkKCcucG9wdXAtLWZlZWRiYWNrJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnbWFyZ2luLXRvcCc6IHQgKyAncHgnXG4gICAgICAgICAgICB9KS5mYWRlSW4oMjUwKTtcbiAgICAgICAgICAgICQoJyNyb290JykuYWRkQ2xhc3MoJ292ZXJsYXknKTtcbiAgICAgICAgfSxcblxuXHRcdHNlbGVjdEZlZWRiYWNrVGhlbWU6IGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRsZXQgZWxtID0gJCgnI2pzU2VsZWN0VGhlbWUnKSxcblx0XHRcdFx0aWRUaGVtZSA9ICQoZS50YXJnZXQpLmRhdGEoJ3RoZW1lJyksXG5cdFx0XHRcdHZhbHVlID0gJChlLnRhcmdldCkuaHRtbCgpO1xuXG5cdFx0XHRlbG0uaHRtbChBcHBIZWxwZXJzLmN1dFN0cmluZyh2YWx1ZSwgMjcpKTtcblxuXHRcdFx0JCgnI2ZlZWRUaGVtZScpLnZhbCh2YWx1ZSk7XG5cdFx0fSxcblxuICAgICAgICBjaGVja1N5bWJvbDogZnVuY3Rpb24gKGUpIHtcblx0XHQgICAgY29uc29sZS5sb2coZSk7XG5cdFx0ICAgIGUgPSBlIHx8IGV2ZW50O1xuXG4gICAgICAgICAgICBpZiAoZS5jdHJsS2V5IHx8IGUuYWx0S2V5IHx8IGUubWV0YUtleSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgY2hyID0gQXBwSGVscGVycy5nZXRDaGFyKGUpO1xuICAgICAgICAgICAgaWYgKGNociA9PSBudWxsKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChjaHIgPCAnMCcgfHwgY2hyID4gJzknKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g0JfQsNC60YDRi9GC0Ywg0L/QvtC/0LDQv1xuICAgICAgICBjbG9zZVBvcHVwOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgLy8g0JLRi9C60LvRjtGH0LDQtdC8INCy0LjQtNC10L5cbi8qICAgICAgICAgICAgdmFyIGlmcmFtZSA9ICQoJyN2aWRlby12aW1lbycpWzBdO1xuICAgICAgICAgICAgdmFyIHBsYXllciA9ICRmKGlmcmFtZSk7XG4gICAgICAgICAgICBwbGF5ZXIuYXBpKCd1bmxvYWQnKTsqL1xuXG4gICAgICAgICAgICAkKCcucG9wdXAnKS5mYWRlT3V0KDIwMCk7XG4gICAgICAgICAgICAkKCcjcm9vdCcpLnJlbW92ZUNsYXNzKCdvdmVybGF5Jyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgJChkb2N1bWVudCkubW91c2V1cChmdW5jdGlvbiAoZSl7IC8vINGB0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQstC10LEt0LTQvtC60YPQvNC10L3RgtGDXG4gICAgICAgIHZhciBkaXYgPSAkKFwiLnBvcHVwXCIpO1xuICAgICAgICBpZiAoIWRpdi5pcyhlLnRhcmdldCkgLy8g0LXRgdC70Lgg0LrQu9C40Log0LHRi9C7INC90LUg0L/QviDQv9C+0L/QsNC/0YNcbiAgICAgICAgICAgICYmIGRpdi5oYXMoZS50YXJnZXQpLmxlbmd0aCA9PT0gMCkge1xuXG4vKiAgICAgICAgICAgIHZhciBpZnJhbWUgPSAkKCcjdmlkZW8tdmltZW8nKVswXTtcbiAgICAgICAgICAgIHZhciBwbGF5ZXIgPSAkZihpZnJhbWUpO1xuICAgICAgICAgICAgcGxheWVyLmFwaSgndW5sb2FkJyk7Ki9cblxuICAgICAgICAgICAgZGl2LmZhZGVPdXQoMjAwKTsgLy8g0YHQutGA0YvQstCw0LXQvFxuICAgICAgICAgICAgJCgnI3Jvb3QnKS5yZW1vdmVDbGFzcygnb3ZlcmxheScpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhcHAudmlldyA9IG5ldyBBcHBWaWV3KCk7XG5cbiAgICAvLyDQodC70LDQudC00LXRgNGLXG4gICAgQXBwSGVscGVycy5pbml0U2xpZGVycygpO1xuXG59KTsiLCIvKipcbiAqIENyZWF0ZWQgYnkgZnJlZCBvbiAwMS4wMi4xNy5cbiAqL1xuXG5pbXBvcnQgQXBwQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbnZhciBDYWxjdWxhdG9yTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIC8vINCX0L3QsNGH0LXQvdC40Y8g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBzdW06IDUwMDAwMCxcbiAgICAgICAgcGVyaW9kOiAzNjVcbiAgICB9LFxuXG4gICAgaW5jb21lTW9uZXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHN1bSA9IGFwcC5jYWxjdWxhdG9yLmdldCgnc3VtJyksXG4gICAgICAgICAgICBwZXJpb2QgPSBhcHAuY2FsY3VsYXRvci5nZXQoJ3BlcmlvZCcpO1xuXG4gICAgICAgIGxldCByZXMgPSBNYXRoLnJvdW5kKHN1bSAqICgxICsgQXBwQ29uc3RhbnRzLnBlcmNlbnQgKiBwZXJpb2QgLyAzNjUpKTtcblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBDYWxjdWxhdG9yTW9kZWw7IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGZyZWQgb24gMDMuMDIuMTcuXG4gKi9cbmltcG9ydCBBcHBIZWxwZXJzIGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IEFwcENvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMnO1xuXG52YXIgQ2FsY3VsYXRvclZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgICAvLyDQn9C+0LvQt9GD0L3QutC4XG4gICAgc3VtUmFuZ2U6ICdpbnB1dCNzZWxlY3RTdW1SYW5nZScsIC8vINCh0YPQvNC80LBcbiAgICBwZXJpb2RSYW5nZTogJ2lucHV0I3NlbGVjdFBlcmlvZFJhbmdlJywgLy8g0J/QtdGA0LjQvtC0XG5cbiAgICAvLyDQn9C+0LvRj1xuICAgIHN1bUZpZWxkOiAnaW5wdXQjc2VsZWN0U3VtRmllbGQnLCAvLyDQodGD0LzQvNCwXG4gICAgcGVyaW9kRmllbGQ6ICdpbnB1dCNzZWxlY3RQZXJpb2RGaWVsZCcsIC8vINCf0LXRgNC40L7QtFxuXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdpbnB1dCBpbnB1dCNzZWxlY3RTdW1SYW5nZSc6ICdjaGFuZ2VTdW1SYW5nZScsXG4gICAgICAgICdmb2N1c291dCBpbnB1dCNzZWxlY3RTdW1GaWVsZCc6ICdjaGFuZ2VTdW1GaWVsZCcsXG5cbiAgICAgICAgJ2lucHV0IGlucHV0I3NlbGVjdFBlcmlvZFJhbmdlJzogJ2NoYW5nZVBlcmlvZFJhbmdlJyxcbiAgICAgICAgJ2ZvY3Vzb3V0IGlucHV0I3NlbGVjdFBlcmlvZEZpZWxkJzogJ2NoYW5nZVBlcmlvZEZpZWxkJyxcblxuICAgICAgICAvLyDQl9Cw0L/RgNC10YnQsNC10Lwg0LLQstC+0LQg0LHRg9C60LIg0LIg0L/QvtC70Y9cbiAgICAgICAgJ2tleXByZXNzIGlucHV0LmNhbGMtZmllbGQnOiAnY2hlY2tGaWVsZCdcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkKCcjdGVtcGxhdGVDYWxjJykuaHRtbCgpKTtcblxuICAgICAgICB0aGlzLm1vZGVsLm9uKCdjaGFuZ2UnLCB0aGlzLmNoYW5nZSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZW5kZXJlZCA9IHRoaXMudGVtcGxhdGUodGhpcy5tb2RlbC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgdGhpcy4kZWwuaHRtbChyZW5kZXJlZCk7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2UoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgY2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzdW0gPSB0aGlzLm1vZGVsLmdldCgnc3VtJyksXG4gICAgICAgICAgICBwZXJpb2QgPSB0aGlzLm1vZGVsLmdldCgncGVyaW9kJyk7XG5cbiAgICAgICAgLy8g0JIg0L/QvtC70LUg0YHRg9C80LzRi1xuICAgICAgICAkKHRoaXMuc3VtRmllbGQpLnZhbCh0aGlzLm1vZGVsLmdldCgnc3VtJykpO1xuXG4gICAgICAgIC8vINCSINC/0L7Qu9C1INC/0LXRgNC40L7QtNCwXG4gICAgICAgICQodGhpcy5wZXJpb2RGaWVsZCkudmFsKHRoaXMubW9kZWwuZ2V0KCdwZXJpb2QnKSk7XG5cbiAgICAgICAgLy8g0JzQtdC90Y/QvCDQt9C90LDRh9C10L3QuNC1INC/0L7Qu9C30YPQvdC60LAg0YHRg9C80LzRi1xuICAgICAgICAkKHRoaXMuc3VtUmFuZ2UpLnZhbCh0aGlzLm1vZGVsLmdldCgnc3VtJykpO1xuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdzdW0nLCAkKHRoaXMuc3VtUmFuZ2UpLmF0dHIoJ21heCcpLCAkKHRoaXMuc3VtUmFuZ2UpLmF0dHIoJ21pbicpLCBmYWxzZSk7XG5cbiAgICAgICAgLy8g0JzQtdC90Y/QtdC8INC30L3QsNGH0LXQvdC40Log0L/QvtC70LfRg9C90LrQsCDQv9C10YDQuNC+0LTQsFxuICAgICAgICAkKHRoaXMucGVyaW9kUmFuZ2UpLnZhbCh0aGlzLm1vZGVsLmdldCgncGVyaW9kJykpO1xuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdwZXJpb2QnLCAkKHRoaXMucGVyaW9kUmFuZ2UpLmF0dHIoJ21heCcpLCAkKHRoaXMucGVyaW9kUmFuZ2UpLmF0dHIoJ21pbicpLCBmYWxzZSk7XG5cbiAgICAgICAgLy8g0LLQvtC30LLRgNCw0YJcbiAgICAgICAgJCgnLmpzLWluZm8tcmV0dXJuJykuaHRtbChBcHBIZWxwZXJzLmZvcm1hdE51bWJlcih0aGlzLm1vZGVsLmluY29tZU1vbmV5KCkpICsgJyDigr0nKTtcbiAgICAgICAgLy8g0LTQvtGF0L7QtFxuICAgICAgICAkKCcuanMtaW5mby1pbmNvbWUnKS5odG1sKFxuICAgICAgICAgICAgQXBwSGVscGVycy5mb3JtYXROdW1iZXIoTWF0aC5yb3VuZCh0aGlzLm1vZGVsLmluY29tZU1vbmV5KCkgLSB0aGlzLm1vZGVsLmdldCgnc3VtJykpKSArICcg4oK9J1xuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlR3JhcGhSZXModGhpcy5tb2RlbC5pbmNvbWVNb25leSgpLCB0aGlzLm1vZGVsLmluY29tZU1vbmV5KCkgLSB0aGlzLm1vZGVsLmdldCgnc3VtJykpO1xuICAgIH0sXG5cbiAgICAvLyDQmNC30LzQtdC90LXQvdC40LUg0L/QvtC70LfRg9C90LrQsCAodHlwZTogc3VtIHx8IG1heClcbiAgICBjaGFuZ2VSYW5nZVNsaWRlcjogZnVuY3Rpb24gKHR5cGUsIG1heCwgbWluLCBjaGFuZ2VNb2RlbCkge1xuICAgICAgICBsZXQgcmFuZ2UgPSAkKCdpbnB1dC5qcy1yYW5nZS0tJyArIHR5cGUpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQocmFuZ2VbaV0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ21heCcsIG1heClcbiAgICAgICAgICAgICAgICAuYXR0cignbWluJywgbWluKVxuICAgICAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAoJChyYW5nZVtpXSkudmFsKCkgLSAkKHJhbmdlW2ldKS5hdHRyKCdtaW4nKSkgKiAxMDAgLyAoJChyYW5nZVtpXSkuYXR0cignbWF4JykgLSAkKHJhbmdlW2ldKS5hdHRyKCdtaW4nKSkgKyAnJSAxMDAlJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoY2hhbmdlTW9kZWwpIHRoaXMubW9kZWwuc2V0KHR5cGUsIHBhcnNlSW50KCQocmFuZ2VbaV0pLnZhbCgpKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvQt9GD0L3QutCwXG4gICAgY2hhbmdlU3VtUmFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG1pbiA9ICQodGhpcy5zdW1SYW5nZSkuYXR0cignbWluJyksXG4gICAgICAgICAgICBtYXggPSAkKHRoaXMuc3VtUmFuZ2UpLmF0dHIoJ21heCcpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3N1bScsIG1heCwgbWluLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INGB0YPQvNC80Ysg0L/RgNC4INC/0L7QvNC+0YnQuCDQv9C+0LvRj1xuICAgIGNoYW5nZVN1bUZpZWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9ICQodGhpcy5zdW1GaWVsZCkudmFsKCksXG4gICAgICAgICAgICByZW0gPSB2YWx1ZSAlIDEwMDtcblxuICAgICAgICBpZiAocmVtICE9PSAwKSB2YWx1ZSA9IHZhbHVlIC0gcmVtO1xuXG4gICAgICAgIGlmIChwYXJzZUludCh2YWx1ZSkgPiBBcHBDb25zdGFudHMubWF4X3N1bSB8fCBwYXJzZUludCh2YWx1ZSkgPCBBcHBDb25zdGFudHMubWluX3N1bSkge1xuICAgICAgICAgICAgdmFsdWUgPSBhcHAuY2FsY3VsYXRvci5kZWZhdWx0cy5zdW07XG4gICAgICAgICAgICAkKHRoaXMuc3VtRmllbGQpLnZhbCh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3VtJywgcGFyc2VJbnQodmFsdWUpKTtcblxuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdzdW0nLCAkKHRoaXMuc3VtUmFuZ2UpLmF0dHIoJ21heCcpLCAkKHRoaXMuc3VtUmFuZ2UpLmF0dHIoJ21pbicpKTtcbiAgICB9LFxuXG4gICAgLy8g0JjQt9C80LXQvdC10L3QuNC1INC/0LXRgNC40L7QtNCwINC/0YDQuCDQv9C+0LzQvtGJ0Lgg0L/QvtC70LfRg9C90LrQsFxuICAgIGNoYW5nZVBlcmlvZFJhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBtaW4gPSAkKHRoaXMucGVyaW9kUmFuZ2UpLmF0dHIoJ21pbicpLFxuICAgICAgICAgICAgbWF4ID0gJCh0aGlzLnBlcmlvZFJhbmdlKS5hdHRyKCdtYXgnKTtcblxuICAgICAgICB0aGlzLmNoYW5nZVJhbmdlU2xpZGVyKCdwZXJpb2QnLCBtYXgsIG1pbiwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIC8vINCY0LfQvNC10L3QtdC90LjQtSDQv9C10YDQuNC+0LTQsCDQv9GA0Lgg0L/QvtC80L7RidC4INC/0L7Qu9GPXG4gICAgY2hhbmdlUGVyaW9kRmllbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gJCh0aGlzLnBlcmlvZEZpZWxkKS52YWwoKSxcbiAgICAgICAgICAgIHJlbSA9IHZhbHVlICUgMTAwO1xuXG4gICAgICAgIGlmIChyZW0gIT09IDApIHZhbHVlID0gdmFsdWUgLSByZW07XG5cbiAgICAgICAgaWYgKHBhcnNlSW50KHZhbHVlKSA+IEFwcENvbnN0YW50cy5tYXhfcGVyaW9kIHx8IHBhcnNlSW50KHZhbHVlKSA8IEFwcENvbnN0YW50cy5taW5fcGVyaW9kKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGFwcC5jYWxjdWxhdG9yLmRlZmF1bHRzLnBlcmlvZDtcbiAgICAgICAgICAgICQodGhpcy5wZXJpb2RGaWVsZCkudmFsKHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdwZXJpb2QnLCBwYXJzZUludCh2YWx1ZSkpO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlUmFuZ2VTbGlkZXIoJ3BlcmlvZCcsICQodGhpcy5wZXJpb2RSYW5nZSkuYXR0cignbWF4JyksICQodGhpcy5wZXJpb2RSYW5nZSkuYXR0cignbWluJykpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VHcmFwaFJlczogZnVuY3Rpb24gKHN1bVJldHVybiwgc3VtSW5jb21lKSB7XG4gICAgICAgIGxldCBwcm9maXRfbWF4ID0gTWF0aC5yb3VuZChBcHBDb25zdGFudHMubWF4X3N1bSAqICgxICsgQXBwQ29uc3RhbnRzLnBlcmNlbnQgKiA3MzAgLyAzNjUpKSxcbiAgICAgICAgICAgIGJsdWVfaGVpZ2h0X21heCA9IEFwcENvbnN0YW50cy5tYXhfc3VtLyhwcm9maXRfbWF4KSxcbiAgICAgICAgICAgIGdyZWVuX2hlaWdodF9tYXggPSAocHJvZml0X21heCAtIEFwcENvbnN0YW50cy5tYXhfc3VtKS8ocHJvZml0X21heCk7XG5cbiAgICAgICAgbGV0IGdyZWVuX2hlaWdodCA9IHN1bVJldHVybiAvIEFwcENvbnN0YW50cy5tYXhfc3VtICogYmx1ZV9oZWlnaHRfbWF4ICogOTUgKyAnJScsXG4gICAgICAgICAgICBibHVlX2hlaWdodCA9IHN1bUluY29tZSAvIChwcm9maXRfbWF4IC0gQXBwQ29uc3RhbnRzLm1heF9zdW0pICogZ3JlZW5faGVpZ2h0X21heCAqIDE2MCArICclJztcblxuICAgICAgICAkKCcuanNfZ3JhcGhfX2luY29tZScpLmNzcygnaGVpZ2h0JywgYmx1ZV9oZWlnaHQpO1xuICAgICAgICAkKCcuanNfZ3JhcGhfX3JldHVybicpLmNzcygnaGVpZ2h0JywgZ3JlZW5faGVpZ2h0KTtcbiAgICB9LFxuXG4gICAgY2hlY2tGaWVsZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZSA9IGUgfHwgZXZlbnQ7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSB8fCBlLmFsdEtleSB8fCBlLm1ldGFLZXkpIHJldHVybjtcblxuICAgICAgICB2YXIgc3ltID0gQXBwSGVscGVycy5nZXRDaGFyKGUpO1xuXG4gICAgICAgIGlmIChzeW0gPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChzeW0gPCAnMCcgfHwgc3ltID4gJzknKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ2FsY3VsYXRvclZpZXc7IiwidmFyIEFwcENvbnN0YW50cyA9IHtcbiAgICBtYXhfcGVyaW9kOiA3MzAsXG4gICAgbWluX3BlcmlvZDogMzAsXG5cbiAgICBtYXhfc3VtOiAxMDAwMDAwLFxuICAgIG1pbl9zdW06IDEwMDAsXG5cbiAgICBwZXJjZW50OiAwLjMxMlxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwQ29uc3RhbnRzOyIsIi8qKlxuICogQ3JlYXRlZCBieSBmcmVkIG9uIDA2LjAyLjE3LlxuICovXG52YXIgQXBwSGVscGVycyA9IHtcbiAgICBiYXNlVXJsOiAnJyxcblxuICAgIHJlZ3hNb2JpbGU6IC9eKD86OCg/Oig/OjIxfDIyfDIzfDI0fDUxfDUyfDUzfDU0fDU1KXwoPzoxNVxcZFxcZCkpP3xcXCs/Nyk/KD86KD86M1swNDU4OV18NFswMTI3ODldfDhbXjg5XFxEXXw5XFxkKVxcZCk/XFxkezd9JC8sXG5cbiAgICBpbml0U2xpZGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2xpZGVycyA9ICQoJy5qcy1zbGlkZXItcGVwcGVyJyk7XG5cbiAgICAgICAgc2xpZGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB0aGF0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBhbGxTbGlkZXIgPSB0aGF0LmZpbmQoJy5wZXBwZXJtaW50JyksXG4gICAgICAgICAgICAgICAgYXJyb3dMZWZ0ID0gdGhhdC5maW5kKCcuYXJyb3ctLWxlZnQnKSxcbiAgICAgICAgICAgICAgICBhcnJvd1JpZ2h0ID0gdGhhdC5maW5kKCcuYXJyb3ctLXJpZ2h0Jyk7XG5cbiAgICAgICAgICAgIGxldCBzbGlkZXIgPSBhbGxTbGlkZXIuUGVwcGVybWludCh7XG4gICAgICAgICAgICAgICAgbW91c2VEcmFnOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVJZk9uZVNsaWRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRvdHM6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhcnJvd0xlZnQuY2xpY2soc2xpZGVyLmRhdGEoJ1BlcHBlcm1pbnQnKS5wcmV2KTtcbiAgICAgICAgICAgIGFycm93UmlnaHQuY2xpY2soc2xpZGVyLmRhdGEoJ1BlcHBlcm1pbnQnKS5uZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8vIGFqYXhcbiAgICBhamF4V3JhcHBlcjogKHVybCwgdHlwZSwgZGF0YSwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSA9PiB7XG4gICAgICAgIHR5cGUgPSB0eXBlIHx8ICdQT1NUJztcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIHN1Y2Nlc3NDYWxsYmFjayA9IHN1Y2Nlc3NDYWxsYmFjayB8fCBmdW5jdGlvbihkYXRhKSB7fTtcbiAgICAgICAgZXJyb3JDYWxsYmFjayA9IGVycm9yQ2FsbGJhY2sgfHwgZnVuY3Rpb24oZXJtc2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcm1zZyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBBcHBIZWxwZXJzLmJhc2VVcmwgKyB1cmwsXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZXJyb3JDYWxsYmFja1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZm9ybWF0TnVtYmVyOiAobnVtKSA9PiB7XG4gICAgICAgIHJldHVybiBudW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxkKSg/PShcXGRcXGRcXGQpKyhbXlxcZF18JCkpL2csICckMSAnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGC0LXQu9C10YTQvtC90LAg0L7RgiDRgdC10YDQstC10YDQsCAo0YDQtdCz0LjRgdGC0YDQsNGG0LjRjylcbiAgICBpblZhbGlkYXRlUGhvbmU6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgJCgnI3VzZXJQaG9uZScpLmFkZENsYXNzKCdlcnItZmllbGQnKTtcbiAgICAgICAgJCgnLmpzLWVyci1yZWdpc3Rlci1tc2cnKS5zaG93KCkuaHRtbChtc2cpO1xuICAgIH0sXG5cbiAgICBpblZhbGlkYXRlTG9naW5Vc2VyOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICQoJy5qcy1lcnItdXNlci1sb2dpbicpLnNob3coKS5odG1sKG1zZyk7XG4gICAgfSxcblxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyBlbWFpbCDQvtGCINGB0LXRgNCy0LXRgNCwICjQvtCx0YDQsNGC0L3QsNGPINGB0LLRj9C30YwpXG4gICAgaW5WYWxpZGF0ZUVtYWlsRmVlZGJhY2s6IGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgJCgnI2ZlZWRFbWFpbCcpLmFkZENsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICQoJy5qcy1lcnItZW1haWwtZmVlZGJhY2stbXNnJykuc2hvdygpLmh0bWwobXNnKTtcbiAgICB9LFxuXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGB0L7QvtCx0YnQtdC90LjRjyDQvtGCINGB0LXRgNCy0LXRgNCwICjQvtCx0YDQsNGC0L3QsNGPINGB0LLRj9C30YwpXG4gICAgaW5WYWxpZGF0ZU1lc3NhZ2VGZWVkYmFjazogZnVuY3Rpb24gKG1zZykge1xuICAgICAgICAkKCcjZmVlZE1lc3NhZ2UnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAkKCcuanMtZXJyLW1lc3NhZ2UtZmVlZGJhY2stbXNnJykuc2hvdygpLmh0bWwobXNnKTtcbiAgICB9LFxuXG4gICAgaW5WYWxpZGF0ZU1lc3NhZ2VBdXRoOiBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICQoJy5qcy1lcnItbWVzc2FnZS1hdXRoLW1zZycpLnNob3coKS5odG1sKG1zZyk7XG4gICAgfSxcblxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRhNC+0YDQvFxuICAgIGZvcm1WYWxpZGF0ZTogZnVuY3Rpb24gKGZvcm1JZCkge1xuICAgICAgICBsZXQgZm9ybSA9ICcjJyArIGZvcm1JZDtcblxuICAgICAgICBsZXQgcmVneCA9IHtcbiAgICAgICAgICAgIGVtYWlsOiAnXlstLl9hLXowLTldK0AoPzpbYS16MC05XVstYS16MC05XStcXC4pK1thLXpdezIsNn0kJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHN3aXRjaCAoZm9ybSkge1xuICAgICAgICAgICAgLy8g0KTQvtGA0LzQsCDRgNC10LPQuNGB0YLRgNCw0YbQuNC4XG4gICAgICAgICAgICBjYXNlICcjdXNlclJlZ2lzdGVyRm9ybSc6XG4gICAgICAgICAgICAgICAgJChmb3JtKS5maW5kKCcuZmllbGQnKS5lYWNoKGZ1bmN0aW9uIChpLCBlbG0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGC0LXQu9C10YTQvtC90LAg0Lgg0L/QsNGA0L7Qu9GPXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKGVsbSkuZGF0YSgnbWluZmllbGQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1pbiA9ICQoZWxtKS5kYXRhKCdtaW5maWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoZWxtKS5maW5kKCdpbnB1dCcpLnZhbCgpIDwgbWluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtC60LDQt9GL0LLQsNC10Lwg0L7RiNC40LHQutGDXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChlbG0pLmZpbmQoJy5lcnItbXNnLWZpZWxkJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxtKS5maW5kKCdpbnB1dCcpLmFkZENsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxtKS5maW5kKCcuZXJyLW1zZy1maWVsZCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsbSkuZmluZCgnaW5wdXQnKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8g0J/QvtCy0YLQvtGA0L3Ri9C5INC/0LDRgNC+0LvRjFxuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI3VzZXJwYXNzJykudmFsKCkgIT09ICQoJyN1c2VyUmVQYXNzJykudmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1yZXBhc3MnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjdXNlclJlUGFzcycpLmFkZENsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJykucmVtb3ZlQ2xhc3MoJ3ZhbGlkLW9rJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuZXJyLW1zZy1maWVsZC0tcmVwYXNzJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3VzZXJSZVBhc3MnKS5yZW1vdmVDbGFzcygnZXJyLWZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8g0KHQvtCz0LvQsNGB0LjQtSDQvdCwINC+0LHRgNCw0LHQvtGC0LrRg1xuICAgICAgICAgICAgICAgICAgICBpZiAoISQoJyN1c2VyQWdyZWVtZW50JykucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuZXJyLW1zZy1maWVsZC0tYWdyZWVtZW50Jykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3VzZXJBZ3JlZW1lbnQnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWFncmVlbWVudCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyN1c2VyQWdyZWVtZW50JykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8g0KTQvtGA0LzQsCDQvtCx0YDQsNGC0L3QvtC5INGB0LLRj9C30LhcbiAgICAgICAgICAgIGNhc2UgJyNmZWVkYmFja0Zvcm0nOlxuICAgICAgICAgICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyDRgtC10LzRi1xuICAgICAgICAgICAgICAgIGlmICgkKCcjZmVlZFRoZW1lJykudmFsKCkgPT09IG51bGwgfHwgJCgnI2ZlZWRUaGVtZScpLnZhbCgpID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAkKCcjanNTZWxlY3RUaGVtZSwgI2ZlZWRUaGVtZScpLmFkZENsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1mZWVkX3RoZW1lJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNqc1NlbGVjdFRoZW1lJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWZlZWRfdGhlbWUnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vINCS0LDQu9C40LTQsNGG0LjRjyBlbWFpbFxuICAgICAgICAgICAgICAgIGlmICgkKCcjZmVlZEVtYWlsJykudmFsKCkubWF0Y2gocmVneC5lbWFpbCkgPT0gbnVsbCB8fCAkKCcjZmVlZEVtYWlsJykudmFsKCkubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgICAgICAgICAkKCcjZmVlZEVtYWlsJykuYWRkQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWZlZWRfZW1haWwnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2ZlZWRFbWFpbCcpLnJlbW92ZUNsYXNzKCdlcnItZmllbGQgdmFsaWQtZXJyJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1mZWVkX2VtYWlsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQoZm9ybSkuZmluZCgnW2RhdGEtdHlwZT1maWVsZF0nKS5lYWNoKGZ1bmN0aW9uIChpLCBlbG0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPINGB0L7QvtCx0YnQtdC90LjRj1xuICAgICAgICAgICAgICAgICAgICBpZiAoJChlbG0pLmRhdGEoJ21pbmZpZWxkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtaW4gPSAkKGVsbSkuZGF0YSgnbWluZmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGVsbSkuZmluZCgndGV4dGFyZWEnKS52YWwoKSA8IG1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCf0L7QutCw0LfRi9Cy0LDQtdC8INC+0YjQuNCx0LrRg1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxtKS5maW5kKCcuZXJyLW1zZy1maWVsZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsbSkuZmluZCgndGV4dGFyZWEnKS5hZGRDbGFzcygnZXJyLWZpZWxkIHZhbGlkLWVycicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsbSkuZmluZCgnLmVyci1tc2ctZmllbGQnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChlbG0pLmZpbmQoJ3RleHRhcmVhJykucmVtb3ZlQ2xhc3MoJ2Vyci1maWVsZCB2YWxpZC1lcnInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8g0KTQvtGA0LzQsCDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4XG4gICAgICAgICAgICBjYXNlICcjdXNlckxvZ2luRm9ybSc6XG4gICAgICAgICAgICAgICAgaWYgKCQoJ2lucHV0W25hbWU9dXNlck5hbWVdJykudmFsKCkubGVuZ3RoIDwgNCB8fCAkKCcjdXNlckxvZ2luUGFzcycpLnZhbCgpLmxlbmd0aCA8IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmVyci1tc2ctZmllbGQtLWxvZ2luJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5lcnItbXNnLWZpZWxkLS1sb2dpbicpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vINCf0YDQvtCy0LXRgNGP0LXQvCDQstCw0LvQuNC00LDRhtGOINCy0YHQtdGFINC/0L7Qu9C10LlcbiAgICAgICAgaWYgKCQoZm9ybSkuZmluZCgnLmVyci1maWVsZCcgfHwgJy52YWxpZC1lcnInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjdXRTdHJpbmc6IGZ1bmN0aW9uICh0eHQsIGxpbWl0KSB7XG4gICAgICAgIHR4dCA9IHR4dC50cmltKCk7XG5cbiAgICAgICAgaWYoIHR4dC5sZW5ndGggPD0gbGltaXQpIHJldHVybiB0eHQ7XG5cbiAgICAgICAgdHh0ID0gdHh0LnNsaWNlKCAwLCBsaW1pdCk7XG4gICAgICAgIGxldCBsYXN0U3BhY2UgPSB0eHQubGFzdEluZGV4T2YoXCIgXCIpO1xuXG4gICAgICAgIGlmKCBsYXN0U3BhY2UgPiAwKSB7XG4gICAgICAgICAgICB0eHQgPSB0eHQuc3Vic3RyKDAsIGxhc3RTcGFjZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR4dCArIFwiIC4uLlwiO1xuICAgIH0sXG5cbiAgICBnZXRDaGFyOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LndoaWNoID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlIDwgMzIpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQua2V5Q29kZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC53aGljaCAhPSAwICYmIGV2ZW50LmNoYXJDb2RlICE9IDApIHtcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA8IDMyKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LndoaWNoKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwSGVscGVyczsiXX0=
