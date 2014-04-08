var handleError = require('../../modules/handleError').response;
var Org = require('../../models/Org').model;

module.exports = function (req, res) {
	Org.find({ $or: [{ admins: req.user._id }, { members: req.user._id }] }, function (err, orgs) {
		if (err) return handleError(res, err, 7);
		if (!orgs) {
			res.send(204, 'No Content : User does not belong to any orgs.');
			return;
		}
		res.json(200, orgs);
	})
}