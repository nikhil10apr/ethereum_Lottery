const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'lotterydb';

// Create a new MongoClient
const client = new MongoClient(url);

//app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	console.log('Request for "/"');
	
	res.send('Hello World!');
});

app.put('/updateAccounts', (req, res) => {
	console.log('Request for "/"');
	const accDetails = req.body.accounts.map(function(account) {
		return {accNo: account, alloted: false};
	});
	client.connect(function(err) {
	  console.log("Connected successfully to server");

	  const db = client.db(dbName);
	  db.collection('accounts').insertMany(accDetails.slice(1), function(err, result) {
	  	if(err) { res.send(err); }
		res.send(result);
	  });
	});
});

app.post('/assignAccount', (req, res) => {
	console.log('Request for "/assignAccount"');
	client.connect(function(err) {
	  console.log("Connected successfully to server");

	  const db = client.db(dbName);
	  db.collection('accounts').findOne({alloted: false}, function(err, accountDetail) {
	  	if(err) { res.send(err); return; }
	  	console.log('Account Found...', accountDetail);
	  	accountDetail.alloted = true;
	  	db.collection('accounts').findAndModify({accNo: accountDetail.accNo}, [['_id','asc']], {$set: {alloted: true}}, {}, function(err, response) {
		  	if(err) { res.send(err); return;}
	  		console.log('Account Updated...', response);
		  	db.collection('entry').findAndModify({userId: req.body.userId}, [['_id','asc']], {$set : { account: accountDetail.accNo }}, {}, function(err, result) {
			  	if(err) { res.send(err); }
	  			console.log('Account Alloted...');
			  	
				res.send({account: accountDetail.accNo});
			  });
		  });
	  	
	  });
	});
});

app.delete('/updateAccounts', (req, res) => {
	console.log('Request for "/"');
	client.connect(function(err) {
	  console.log("Connected successfully to server");

	  const db = client.db(dbName);
	  db.collection('accounts').deleteMany({}, function(err, result) {
	  	if(err) { res.send(err); }
		res.send('Deleted All Records');
	  });
	});
});

app.post('/newUser', (req, res) => {
	// Use connect method to connect to the Server
	client.connect(function(err) {
	  console.log("Connected successfully to server");

	  const db = client.db(dbName);
	  db.collection('entry').insertOne({
	  	name: req.body.name,
	  	userId: req.body.userId,
	  	phone: req.body.phone,
	  	email: req.body.email,
	  	type: 'player'
	  }, function(err, result) {
	  	if(err) { res.send(err); }
		res.send(result);
	  });
	});
});

app.post('/validateUser', (req, res) => {
	// Use connect method to connect to the Server
	client.connect(function(err) {
	  console.log("Connected successfully to server");

	  const db = client.db(dbName);
	  db.collection('entry').find({
	  	userId: req.body.userId,
	  	phone: req.body.phone
	  }).toArray(function(err, response) {
	  	if(err) { res.send(err); }
		res.send(response);
	  });
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));