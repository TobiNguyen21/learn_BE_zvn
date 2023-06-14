const { check, body } = require('express-validator');

module.exports = {
    validator: () => {
        return [
            check('name').escape().notEmpty().matches(/^[\p{L}0-9 ]+$/u).withMessage('Please enter a valid name'),
            check('ordering').isInt({ min: 0, max: 100 }).withMessage('Ordering must be a number between 0 and 100'),
            check('status').not().equals('novalue').withMessage("Please choose status"),
            body('image').custom((value, { req }) => {
                if (req.file) {
                    return true;
                }
                throw new Error('Error upload');
            })
        ];
    }
};