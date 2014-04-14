var express = require('express');
var handleError = require('../modules/handleError').response;
var Receiver = require('../models/Receiver.js').model;

var router = express.Router();

router.route('/')
	.get(require('./receivers/_list'))
	.put(require('./receivers/create'))

// If :receiver param is present, set req.org to the right organization
router.param('receiver', function (req, res, next, id) {
	Receiver.findById(id)
		.populate('owner')
		.exec(function (err, docs) {
		if (err) {
			return next(err);
		}
		else if (!docs) {
			res.send(404, 'Failed to find Receiver.');
			return;
		}
		req.receiver = docs;
		next();
	});
});

// Member Authorization
router.use('/:receiver', function (req, res, next) {
	if (req.receiver.owner.admins.indexOf(req.user._id) === -1 && req.receiver.admin.members.indexOf(req.user._id) === -1) {
		res.send(401, 'Unauthorized');
		return;
	} else {
		next();
	}
})

router.route('/:receiver')
	.get(require('./receivers/get'))

// Admin Authorization
router.use(function (req, res, next) {
	if (req.receiver.owner.admins.indexOf(req.user._id) === -1) {
		res.send(401, 'Unauthorized');
	} else {
		next();
	}
})

router.route('/:receiver')
	.post(require('./receivers/update'))
	.delete(require('./receivers/delete'))

module.exports = router;