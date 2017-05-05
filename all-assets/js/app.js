import AppHelpers from './helpers';
import AppConstants from './constants';
import CalculatorModel from './app/CalculatorModel';
import CalculatorView from './app/CalculatorView';

$(document).ready(function() {
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
    app.calculator = new CalculatorModel({});

    app.calculatorView = new CalculatorView({
        model: app.calculator,
        el: 'form.calc'
    });

    let AppModel = Backbone.Model.extend({
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

        initialize: function () {
            $('#userPhone').mask("+7 (999) 999-9999");
        },

        changeTab: function (e) {
            let typeTab = $(e.currentTarget).parent('.js-block-tabs').data('tabs') || 'changeQuest';

            switch (typeTab) {
                case 'calcTypePerson':
                    $('.calc-tab--active').add(e.currentTarget).toggleClass('calc-tab--active');
                    break;
                case 'whyChangeContent':
                    $('.why-tab--active').add(e.currentTarget).toggleClass('why-tab--active');
                    let tabWhyId = $('.why-tab--active').data('tab');
                    $('.why-content').removeClass('why-content--active');
                    $('#why-content-' + tabWhyId).addClass('why-content--active');
                    break;
                case 'changeQuest':
                    $('.js-tab-quest--active').add(e.currentTarget).toggleClass('js-tab-quest--active');
                    let tabQuestId = $('.js-tab-quest--active').data('tab');
                    $('.js-content-quest').removeClass('js-content-quest--active');
                    $('#questTab-' + tabQuestId).addClass('js-content-quest--active');
                    break;
                default:
                    return false;
            }
        },

        // Валидация на лету
        validateField: function (e) {
            let elm = $(e.target),
                value = elm.val(),
                min = elm.attr('min'),
                max = elm.attr('max'),
                regx = elm.attr('data-regx') || '',
                res = false;

            // Проверка моб. телефона
            if (elm.data('typefield') === 'phone') {
                value = '+' + value.replace(/\D+/g, '');
                if (_.isNull(value.match(AppHelpers.regxMobile))) {
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
        registerUser: function (e) {
            e.preventDefault();

            let data = {
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
            if (AppHelpers.formValidate('userRegisterForm')) {
                AppHelpers.ajaxWrapper(
                    '/api/register',
                    'POST',
                    JSON.stringify(data),
                    function (data) {
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
                                    AppHelpers.inValidatePhone(data.fields[0].phone.msgNotMOBILE);
                                }
                            } else {
                                $('.js-err-register-msg').hide();
                            }
                        }
                    }
                )
            }
        },

        // Отправка формы обратной связи
        sendFeedback: function (e) {
            e.preventDefault();
            AppHelpers.formValidate('feedbackForm');
            let data = {
                theme: $('#feedTheme').val(),
                email: $('input#feedEmail').val(),
                message: $('textarea#feedMessage').val()
            };


			if (AppHelpers.formValidate('feedbackForm')) {
				AppHelpers.ajaxWrapper(
                    '/api/feedback',
                    'POST',
                    JSON.stringify(data),
                    function (data) {
                        if (data.status === 'success') {
                            // Сбрасываем форму
                            $('#feedbackForm').trigger('reset');
                            $('.js-msg-succes').show();
                            $('#feedbackForm').find('.errResponse').hide();
                        } else {
                            if (data.fields) {
                                data.fields[0].email ? AppHelpers.inValidateEmailFeedback(data.fields[0].email.emailAddressInvalidFormat) : $('.js-err-email-feedback-msg').hide();
                                data.fields[0].message ? AppHelpers.inValidateMessageFeedback(data.fields[0].message.stringLengthTooShort) : $('.js-err-message-feedback-msg').hide()
                            } else {
                                $('#feedbackForm').find('.errResponse').hide();
                            }
                        }
                    }
                )
			}
        },

        // Авторизация пользователя
        loginUser: function (e) {
            e.preventDefault();

            AppHelpers.formValidate('userLoginForm');

            let data = {
                login: $('input[name=userName]').val(),
                password: $('input#userLoginPass').val()
            };

            if (AppHelpers.formValidate('userLoginForm')) {
                AppHelpers.ajaxWrapper(
                    '/api/auth',
                    'POST',
                    JSON.stringify(data),
                    function (data) {
                        if (data.status === 'success') {
                            if (data.sid) {
                                window.location = data.sid;
                            }
                        } else {
                            if (data.sid) {
                                console.log(data.msg);
                            }
                        }
                    }
                )
            }
        },

        // Попап регистрации
        showRegisterPopup: function (e) {
            e.preventDefault();
            var t = Math.min($(window).scrollTop() + 50, $('#root').height() - $(window).height());

            $('.popup--register').css({
                'margin-top': t + 'px'
            }).fadeIn(250);

            $('#root').addClass('overlay');
        },

        // Попап авторизации
        showLoginPopup: function (e) {
            e.preventDefault();
            var t = Math.min($(window).scrollTop() + 50, $('#root').height() - $(window).height());

            $('.popup--login').css({
                'margin-top': t + 'px'
            }).fadeIn(250);
            $('#root').addClass('overlay');
        },

        // Попап с видео
        showPopupVideo: function () {
            $('.popup--youtube').fadeIn(200);
            $('#root').addClass('overlay');
        },

        showPopupFeedback: function (e) {
            e.preventDefault();
            var t = Math.min($(window).scrollTop() + 50, $('#root').height() - $(window).height()) + 80;

            $('.popup--feedback').css({
                'margin-top': t + 'px'
            }).fadeIn(250);
            $('#root').addClass('overlay');
        },

		selectFeedbackTheme: function (e) {
			let elm = $('#jsSelectTheme'),
				idTheme = $(e.target).data('theme'),
				value = $(e.target).html();

			elm.html(AppHelpers.cutString(value, 27));

			$('#feedTheme').val(value);
		},

        checkSymbol: function (e) {
		    console.log(e);
		    e = e || event;

            if (e.ctrlKey || e.altKey || e.metaKey) return;

            var chr = AppHelpers.getChar(e);
            if (chr == null) return;

            if (chr < '0' || chr > '9') return false;
        },

        // Закрыть попап
        closePopup: function (e) {
            // Выключаем видео
/*            var iframe = $('#video-vimeo')[0];
            var player = $f(iframe);
            player.api('unload');*/

            $('.popup').fadeOut(200);
            $('#root').removeClass('overlay');
        }

    });

    $(document).mouseup(function (e){ // событие клика по веб-документу
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
    AppHelpers.initSliders();

});