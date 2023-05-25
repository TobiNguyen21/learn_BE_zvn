const { check } = require('express-validator');

module.exports = {
    validateItem: () => {
        return [
            check('name').escape().notEmpty().matches(/^[A-Za-z0-9 ]+$/).withMessage('Please enter name'),
            check('ordering').isInt({ min: 0, max: 100 }).withMessage('Ordering must be a number between 0 and 100'),
            check('status').not().equals('novalue').withMessage("Please choose status")
        ];
    }
};
