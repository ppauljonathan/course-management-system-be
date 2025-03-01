'use strict';

module.exports.validatePresence = (key, value, errors = []) => {
    if(!!value) { return; }

    errors.push({
        code: 'NOT_PRESENT',
        message: `${key} must be present`,
        location: `${key}`
    });
};

module.exports.validateLength = (key, value, lengthParams, errors = []) => {
    if(lengthParams.min) {
        this.validateMinLength(key, value, lengthParams.min, errors);
    }

    if(lengthParams.max) {
        this.validateMinLength(key, value, lengthParams.max, errors);
    }
};

module.exports.validateMinLength = (key, value, minLength, errors = []) => {
    if(value.length >= minLength) { return; }

    errors.push({
        code: 'TOO_SHORT',
        message: `${key} must have at least ${minLength} characters`,
        location: `${key}`
    });
};


module.exports.validateMaxLength = (key, value, maxLength, errors = []) => {
    if(value.length <= maxLength) { return; }

    errors.push({
        code: 'TOO_SHORT',
        message: `${key} must have at most ${maxLength} characters`,
        location: `${key}`
    });
}
