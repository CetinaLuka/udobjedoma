const express = require('express');
const app = express();
const port = 3000;
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://soa-user:soa-user@cluster0.ululh.mongodb.net/<dbname>?retryWrites=true&w=majority";
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require('./swagger-output.json');
const fetch = require("node-fetch");
const { v4: uuidv4 } = require('uuid');
const Bree = require('bree');

const amqplib = require('amqplib');
var assert = require('assert');
var util = require('util');

var rabbit_user = "student";
var rabbit_pwd = "student123";
var rabbit_host = "172.17.0.94";
var rabbit_port = "5672";
var vhost = "";

var storitev_uporabniki = "http://172.17.0.36:8081";

const bree = new Bree({
	jobs: [
		{
			name: 'lights',
      		interval: 'at 2:00 am'
		}
	]
})
bree.start();

app.use(express.json());
var cors = require('cors');
app.use(cors());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get('/', (req, res) => {
	// #swagger.description = 'Korenska končna točka. Preusmeri na naslov /swagger'
	res.redirect('/swagger');
});

app.get('/luci', (req, res) => {
	// #swagger.description = 'Končna točka, ki vrača podatke o vseh sobah in njihovih lučeh'

	res.setHeader('Content-Type', 'application/json');
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		if (err) return console.error(err)
		const collection = client.db("udobjedoma").collection("luci");
		const allItems = collection.find().toArray().then(results => {
			console.log(results);
			res.send(results);
			client.close();
			/*
			#swagger.responses[200] = {
				schema: { $ref: "#/definitions/SeznamSob"},
				description: 'Soba z vsemi pripadajočimi lučmi'
			}
			*/
		})
			.catch(error => {
				return res.status(404).send(false);
				console.error(error);
				client.close();
			});
	});
});
//podatki o eni sobi
app.get('/luci/:sobaId', (req, res) => {
	/*
		#swagger.description = 'Končna točka, ki vrača podatke za sobo z Id, ki se pošlje v zahtevi'
		#swagger.parameters['sobaId'] = {
		  type: 'string',
		  description: 'Id sobe'
		}
	*/

	console.log(req.params.sobaId);
	res.setHeader('Content-Type', 'application/json');
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		if (err) return console.error(err)
		const collection = client.db("udobjedoma").collection("luci");
		const allItems = collection.findOne({ _id: ObjectId(req.params.sobaId) }).then(results => {
			console.log(results);
			res.status(200);
			res.send(results);
			client.close();
			/*
			#swagger.responses[200] = {
				schema: { $ref: "#/definitions/Soba"},
				description: 'Soba z vsemi pripadajočimi lučmi'
			}
			*/
		})
			.catch(error => {
				console.error(error);
				res.status(400).send(false);
				client.close();
			});
	});
});
//dodaj luč
app.post('/luci/:sobaId', function (req, res) {
	/*
		#swagger.description = 'Končna točka, ki doda novo luč v sobo z id, ki je bil poslan z zahtevo.'
		#swagger.parameters['sobaId'] = {
		  type: 'string',
		  description: 'Id sobe v katero želimo dodati luč'
		}
		#swagger.parameters['posodobljenaLuc'] = {
		  schema: { $ref: "#/definitions/Luc"},
		  description: 'Json nove luci',
		  in: 'body'
		}
	*/
	console.log(req.body);
	res.setHeader('Content-Type', 'application/json');
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		if (err) return console.error(err)
		var novaLuc = req.body;
		novaLuc.lucId = ObjectId();
		const collection = client.db("udobjedoma").collection("luci");
		const insertItem = collection.updateOne(
			{ _id: ObjectId(req.params.sobaId) },
			{ $push: { luci: novaLuc } }
		).then(results => {
			res.status(200);
			res.send(novaLuc);
			client.close();
			/*
			#swagger.responses[200] = {
				schema: { $ref: "#/definitions/Luc"},
				description: 'Luč'
			}
			*/
		})
			.catch(error => {
				console.error(error);
				res.status(400).send(false);
				client.close();
			});
	});
});
//posodobi luc
app.put('/luci/:sobaId/:lucId', (req, res) => {
	/*
		#swagger.description = 'Končna točka za posodobitev luči'
		#swagger.parameters['sobaId'] = {
		  type: 'string',
		  description: 'Id sobe v kateri želimo posodobiti luč'
		}
		#swagger.parameters['lucId'] = {
		  type: 'string',
		  description: 'Id luči, ki jo želimo posodobiti'
		}
		#swagger.parameters['novaLuc'] = {
		  schema: { $ref: "#/definitions/Luc"},
		  description: 'Json nove luci',
		  in: 'body'
		}
	*/
	console.log(req.params.sobaId);
	res.setHeader('Content-Type', 'application/json');
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		if (err) return console.error(err)
		const collection = client.db("udobjedoma").collection("luci");
		const deleteItem = collection.updateOne(
			{ _id: ObjectId(req.params.sobaId), "luci.lucId": ObjectId(req.params.lucId) },
			{
				$set: {
					"luci.$.luc": req.body.luc, "luci.$.prizgana": req.body.prizgana, "luci.$.svetlost": req.body.svetlost,
					"luci.$.barva": req.body.barva, "luci.$.prizgiOb": req.body.prizgiOb, "luci.$.ugasniOb": req.body.ugasniOb,
					"luci.$.slediUrniku": req.body.slediUrniku,
				}
			}
		)
			.then(result => {
				res.status(200);
				res.redirect("/luci/" + req.params.sobaId);
				client.close();
			})
			.catch(error => {
				console.error(error);
				res.status(400).send(false);
				client.close();
			});
	});
});
//izbrisi luc
app.delete('/luci/delete/:sobaId/:lucId', (req, res) => {
	/*
		#swagger.description = 'Končna točka, ki izbriše luč'
		#swagger.parameters['sobaId'] = {
		  type: 'string',
		  description: 'Id sobe iz katere želimo izbrisati luč'
		}
		#swagger.parameters['lucId'] = {
		  type: 'string',
		  description: 'Id luči, ki jo želimo izbrisati'
		}
	*/
	console.log(req.params.sobaId);
	res.setHeader('Content-Type', 'application/json');
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	client.connect(err => {
		if (err) return console.error(err)
		const collection = client.db("udobjedoma").collection("luci");
		const deleteItem = collection.updateOne(
			{ "_id": ObjectId(req.params.sobaId) },
			{ $pull: { "luci": { lucId: ObjectId(req.params.lucId) } } }
		)
			.then(result => {
				res.status(200);
				res.redirect("/luci/" + req.params.sobaId);
				client.close();
			})
			.catch(error => {
				console.error(error);
				res.status(400).send(false);
				client.close();
			});
	});
});


//prizgi luc
app.get('/luci/prizgi/:sobaId/:lucId', (req, res) => {
	/*
		#swagger.description = 'Končna točka, ki prižge izbrano luč'
		#swagger.parameters['sobaId'] = {
		  type: 'string',
		  description: 'Id sobe v kateri želimo prižgati luč'
		}
		#swagger.parameters['lucId'] = {
		  type: 'string',
		  description: 'Id luči, ki jo želimo prižgati'
		}
	*/

	if (req.headers.authorization) {

		fetch(storitev_uporabniki+'/verificirajZeton', {
			method: 'get',
			headers: { 'Authorization': req.headers.authorization }
		}).then(function (response) {
			return response.json()
		}).then(function (data) {
			if (data.status == 'OK') {
				res.setHeader('Content-Type', 'application/json');
				const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
				client.connect(err => {
					if (err) return console.error(err)
					const collection = client.db("udobjedoma").collection("luci");
					const deleteItem = collection.updateOne(
						{ _id: ObjectId(req.params.sobaId), "luci.lucId": ObjectId(req.params.lucId) },
						{ $set: { "luci.$.prizgana": true } },
						{ multi: false }
					)
						.then(result => {
							posljiSporocilo("Luč z id " + req.params.lucId + " je bila prižgana", req.headers.authorization, req.query.id);
							var url = `/luci/prizgi/${req.params.lucId}/${req.params.sobaId}`;
							var correlation = uuidv4();
							log("INFO", url, "luc prizgana", correlation);
							res.status(200);
							res.redirect("/luci/" + req.params.sobaId);
							client.close();
						})
						.catch(error => {
							console.error(error);
							var url = `/luci/prizgi/${req.params.lucId}/${req.params.sobaId}`;
							var correlation = uuidv4();
							log("ERROR", url, "error reading from db", correlation);
							res.status(400).send(false);
							client.close();
						});
				});
			}
			else {
				console.log("token not ok");
				var url = `/luci/prizgi/${req.params.lucId}/${req.params.sobaId}`;
				var correlation = uuidv4();
				log("ERROR", url, "token not ok", correlation);
				res.status(400).send(false);
			}
		}).
			catch(error => {
				console.log("token error");
				var url = `/luci/prizgi/${req.params.lucId}/${req.params.sobaId}`;
				var correlation = uuidv4();
				log("ERROR", url, "token error", correlation);
				res.status(400).send(false);
			});
	}
	else {
		var url = `/luci/prizgi/${req.params.lucId}/${req.params.sobaId}`;
		var correlation = uuidv4();
		log("ERROR", url, "no headers preset in request", correlation);
		res.status(400).send(false);
	}

});
//ugasni luc
app.get('/luci/ugasni/:sobaId/:lucId', (req, res) => {
	/*
		#swagger.description = 'Končna točka, ki ugasne izbrano luč'
		#swagger.parameters['sobaId'] = {
		  type: 'string',
		  description: 'Id sobe v kateri želimo ugasniti luč'
		}
		#swagger.parameters['lucId'] = {
		  type: 'string',
		  description: 'Id luči, ki jo želimo ugasniti'
		}
	*/
	if (req.headers.authorization) {

		fetch(storitev_uporabniki+'/verificirajZeton', {
			method: 'get',
			headers: { 'Authorization': req.headers.authorization }
		}).then(function (response) {
			return response.json()
		}).then(function (data) {
			if (data.status == 'OK') {
				res.setHeader('Content-Type', 'application/json');
				const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
				client.connect(err => {
					if (err) return console.error(err)
					const collection = client.db("udobjedoma").collection("luci");
					const luc = collection.updateOne(
						{ _id: ObjectId(req.params.sobaId), "luci.lucId": ObjectId(req.params.lucId) },
						{ $set: { "luci.$.prizgana": false } }
					)
						.then(result => {
							posljiSporocilo("Luč z id " + req.params.lucId + " je bila ugasnjena", req.headers.authorization, req.query.id);
							var url = `/luci/ugasni/${req.params.lucId}/${req.params.sobaId}`;
							var correlation = uuidv4();
							log("INFO", url, "luc ugasnjena", correlation);
							res.status(200);
							res.redirect("/luci/" + req.params.sobaId);
							client.close();
						})
						.catch(error => {
							console.error(error);
							var url = `/luci/ugasni/${req.params.lucId}/${req.params.sobaId}`;
							var correlation = uuidv4();
							log("ERROR", url, "error reading from db", correlation);
							res.status(400).send(false);
							client.close();
						});
				});
			}
			else {
				console.log("token not ok");
				var url = `/luci/ugasni/${req.params.lucId}/${req.params.sobaId}`;
				var correlation = uuidv4();
				log("ERROR", url, "token not ok", correlation);
				res.status(400).send(false);
			}
		}).
			catch(error => {
				console.log("token error");
				var url = `/luci/ugasni/${req.params.lucId}/${req.params.sobaId}`;
				var correlation = uuidv4();
				log("ERROR", url, "token error", correlation);
				res.status(400).send(false);
			});
	}
	else {
		var url = `/luci/ugasni/${req.params.lucId}/${req.params.sobaId}`;
		var correlation = uuidv4();
		log("ERROR", url, "no headers preset in request", correlation);
		res.status(400).send(false);
	}



});
//vklopi sledenje urniku
app.get('/luci/slediurniku/:sobaId/:lucId', (req, res) => {
	/*
		#swagger.description = 'Končna točka, ki vklopi sledenje urniku pri izbrani luči'
		#swagger.parameters['sobaId'] = {
		  type: 'string',
		  description: 'Id sobe v kateri želimo vklopiti sledenje urniku'
		}
		#swagger.parameters['lucId'] = {
		  type: 'string',
		  description: 'Id luči, ki ji želimo vklopiti sledenje urniku'
		}
	*/

	if (req.headers.authorization) {

		fetch(storitev_uporabniki+'/verificirajZeton', {
			method: 'get',
			headers: { 'Authorization': req.headers.authorization }
		}).then(function (response) {
			return response.json()
		}).then(function (data) {
			if (data.status == 'OK') {
				res.setHeader('Content-Type', 'application/json');
				res.setHeader('Content-Type', 'application/json');
				const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
				client.connect(err => {
					if (err) return console.error(err)
					const collection = client.db("udobjedoma").collection("luci");
					const luc = collection.updateOne(
						{ _id: ObjectId(req.params.sobaId), "luci.lucId": ObjectId(req.params.lucId) },
						{ $set: { "luci.$.slediUrniku": true } }
					)
						.then(result => {
							posljiSporocilo("Luč z id " + req.params.lucId + " sledi urniku", req.headers.authorization, req.query.id);
							var url = `/luci/slediurniku/${req.params.lucId}/${req.params.sobaId}`;
							var correlation = uuidv4();
							log("INFO", url, "sledenje urniku vklopljeno", correlation);
							res.status(200);
							res.redirect("/luci/" + req.params.sobaId);
							client.close();
						})
						.catch(error => {
							console.error(error);
							var url = `/luci/slediurniku/${req.params.lucId}/${req.params.sobaId}`;
							var correlation = uuidv4();
							log("ERROR", url, "error reading from db", correlation);
							client.close();
						});
				});
			}
			else {
				console.log("token not ok");
				var url = `/luci/slediurniku/${req.params.lucId}/${req.params.sobaId}`;
				var correlation = uuidv4();
				log("ERROR", url, "token not ok", correlation);
				res.status(400).send(false);
			}
		}).
			catch(error => {
				console.log("token error");
				var url = `/luci/slediurniku/${req.params.lucId}/${req.params.sobaId}`;
				var correlation = uuidv4();
				log("ERROR", url, "token error",correlation);
				res.status(400).send(false);
			});
	}
	else {
		var url = `/luci/slediurniku/${req.params.lucId}/${req.params.sobaId}`;
		var correlation = uuidv4();
		log("ERROR", url, "no headers preset in request", correlation);
		res.status(400).send(false);

	}
});
//izklopi sledenje urniku
app.get('/luci/neslediurniku/:sobaId/:lucId', (req, res) => {
	/*
		#swagger.description = 'Končna točka, ki izklopi sledenje urniku pri izbrani luči'
		#swagger.parameters['sobaId'] = {
		  type: 'string',
		  description: 'Id sobe v kateri želimo izklopiti sledenje urniku'
		}
		#swagger.parameters['lucId'] = {
		  type: 'string',
		  description: 'Id luči, ki ji želimo izklopiti sledenje urniku'
		}
	*/

	if (req.headers.authorization) {

		fetch(storitev_uporabniki+'/verificirajZeton', {
			method: 'get',
			headers: { 'Authorization': req.headers.authorization }
		}).then(function (response) {
			return response.json()
		}).then(function (data) {
			if (data.status == 'OK') {
				res.setHeader('Content-Type', 'application/json');
				const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
				client.connect(err => {
					if (err) return console.error(err)
					const collection = client.db("udobjedoma").collection("luci");
					const luc = collection.updateOne(
						{ _id: ObjectId(req.params.sobaId), "luci.lucId": ObjectId(req.params.lucId) },
						{ $set: { "luci.$.slediUrniku": false } }
					)
						.then(result => {
							console.log("ne sledi");
							console.log("ID: "+req.query.id);
							posljiSporocilo("Luč z id " + req.params.lucId + " ne sledi urniku", req.headers.authorization, req.query.id);
							var url = `/luci/neslediurniku/${req.params.lucId}/${req.params.sobaId}`;
							var correlation = uuidv4();
							log("INFO", url, "sledenje urniku izklopljeno", correlation);
							res.status(200);
							res.redirect("/luci/" + req.params.sobaId);
							client.close();
						})
						.catch(error => {
							console.error(error);
							var url = `/luci/neslediurniku/${req.params.lucId}/${req.params.sobaId}`;
							var correlation = uuidv4();
							log("ERROR", url, "error reading from database", correlation);
							res.status(400).send(false);
							client.close();
						});
				});
			}
			else {
				console.log("token not ok");
				var url = `/luci/neslediurniku/${req.params.lucId}/${req.params.sobaId}`;
				var correlation = uuidv4();
				log("ERROR", url, "token not ok", correlation);
				res.status(400).send(false);
			}
		}).
			catch(error => {
				console.log("token error");
				var url = `/luci/neslediurniku/${req.params.lucId}/${req.params.sobaId}`;
				var correlation = uuidv4();
				console.log(correlation);
				log("ERROR", url, "there has been an error retrieving the verification token", correlation);
				res.status(400).send(false);
			});

	}
	else {
		console.log("no headers present");
		var url = `/luci/neslediurniku/${req.params.lucId}/${req.params.sobaId}`;
		var correlation = uuidv4();
		log("ERROR", url, "no headers preset in request", correlation);
		res.status(400).send(false);
	}
});
function posljiSporocilo(text, auth, id) {
	console.log("ext service");
	var obvestilo = {
		userId: [],
		showDateTime: new Date(),
		wasShown: false,
		text: text,
		extService: "Pametne luči"
	};
	obvestilo.userId.push(id);
	fetch("http://172.17.0.52:3000/notification", {
		method: 'post',
		body: JSON.stringify(obvestilo),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': auth
		}
	}
	)
		.then(function (response) {
			console.log("ext service uspeh");
			console.log(response);
			return response.json();
		}).then(function (data) {
			console.log("ext service uspeh");
			console.log(data);
		})
		.catch(error => { console.log("ext service napaka"); console.log(error) })
}

async function log(type, url, message, correlation) {
	var amql_url = util.format("amqp://%s:%s@%s:%s/%s", rabbit_user, rabbit_pwd, rabbit_host, rabbit_port, vhost);

	console.log("Publishing");
	var conn = await amqplib.connect(amql_url, "heartbeat=60");
	var ch = await conn.createChannel()
	var exch = 'IRR-1';
	var q = 'IRR-1-logs';
	var rkey = '';
	await ch.assertExchange(exch, 'direct', { durable: true }).catch(console.error);
	await ch.assertQueue(q, { durable: true });
	await ch.bindQueue(q, exch);

	var date = new Date();
	var msg = date.toISOString() + ' ' + type + ' ' + url + ' Correlation: ' + correlation + ' - <* ' + message + ' *>';
	await ch.publish(exch, rkey, Buffer.from(msg));
	setTimeout(function () {
		ch.close();
		conn.close();
	}, 500);
}

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})