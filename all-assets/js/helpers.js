/**
 * Created by fred on 06.02.17.
 */
var AppHelpers = {
    baseUrl: '',

    regxMobile: /^(?:8(?:(?:21|22|23|24|51|52|53|54|55)|(?:15\d\d))?|\+?7)?(?:(?:3[04589]|4[012789]|8[^89\D]|9\d)\d)?\d{7}$/,

    initSliders: function () {
        var sliders = $('.js-slider-pepper');

        sliders.each(function () {
            let that = $(this),
                allSlider = that.find('.peppermint'),
                arrowLeft = that.find('.arrow--left'),
                arrowRight = that.find('.arrow--right');

            let slider = allSlider.Peppermint({
                mouseDrag: true,
                disableIfOneSlide: true,
                dots: true
            });

            arrowLeft.click(slider.data('Peppermint').prev);
            arrowRight.click(slider.data('Peppermint').next);
        });
    },

    // ajax
    ajaxWrapper: (url, type, data, successCallback, errorCallback) => {
        type = type || 'POST';
        data = data || {};
        successCallback = successCallback || function(data) {};
        errorCallback = errorCallback || function(ermsg) {
                console.log(ermsg);
            };
        $.ajax({
            url: AppHelpers.baseUrl + url,
            type: type,
            data: data,
            success: function (data) {
                return successCallback(data);
            },
            error: errorCallback
        });
    },

    formatNumber: (num) => {
        return num.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    },

    // Валидация телефона от сервера (регистрация)
    inValidatePhone: function (msg) {
        $('#userPhone').addClass('err-field');
        $('.js-err-register-msg').show().html(msg);
    },

    inValidateLoginUser: function (msg) {
        $('.js-err-user-login').show().html(msg);
    },

    // Валидация email от сервера (обратная связь)
    inValidateEmailFeedback: function (msg) {
        $('#feedEmail').addClass('err-field valid-err');
        $('.js-err-email-feedback-msg').show().html(msg);
    },

    // Валидация сообщения от сервера (обратная связь)
    inValidateMessageFeedback: function (msg) {
        $('#feedMessage').addClass('err-field valid-err');
        $('.js-err-message-feedback-msg').show().html(msg);
    },

    inValidateMessageAuth: function (msg) {
        $('.js-err-message-auth-msg').show().html(msg);
    },

    // Валидация форм
    formValidate: function (formId) {
        let form = '#' + formId;

        let regx = {
            email: '^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$'
        };

        switch (form) {
            // Форма регистрации
            case '#userRegisterForm':
                $(form).find('.field').each(function (i, elm) {
                    // Валидация телефона и пароля
                    if ($(elm).data('minfield')) {
                        let min = $(elm).data('minfield');
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
                        let min = $(elm).data('minfield');
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

    cutString: function (txt, limit) {
        txt = txt.trim();

        if( txt.length <= limit) return txt;

        txt = txt.slice( 0, limit);
        let lastSpace = txt.lastIndexOf(" ");

        if( lastSpace > 0) {
            txt = txt.substr(0, lastSpace);
        }
        return txt + " ...";
    },

    getChar: function (event) {
        if (event.which == null) {
            if (event.keyCode < 32) return null;
            return String.fromCharCode(event.keyCode)
        }

        if (event.which != 0 && event.charCode != 0) {
            if (event.which < 32) return null;
            return String.fromCharCode(event.which)
        }

        return null;
    }
};

export default AppHelpers;