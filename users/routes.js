var data = {
	"users": [
		{
			"firstname":"John",
			"lastname":"Smith",
			"username":"jsmith"
		},
		{
			"firstname":"Sally",
			"lastname":"Turp",
			"username":"sally"
		}
	]
};

function getUsers(req, res) {
	var users = [];
	data.users.forEach(function (user, i) {
		users.push({ id:i, firstname: user.firstname, lastname: user.lastName, username: user.username });
	});
	res.json({users: users});
}

function getUser(req, res) {
	var id = req.params.id;
	if (id >= 0 && id < data.users.length) {
		res.json({ user: data.users[id] });
	} else {
		res.json(false);
	}
}

function setup(app) {
	app.get('/users', getUsers);
	app.get('/user/:id', getUser);
}

module.exports = setup;
