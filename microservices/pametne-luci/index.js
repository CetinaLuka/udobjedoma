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
app.use(express.json());

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
app.delete('/luci/:sobaId/:lucId', (req, res) => {
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
	console.log(req.params.sobaId);
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
				posljiSporocilo("Luč z id "+req.params.lucId+" je bila prižgana");
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
				posljiSporocilo("Luč z id "+req.params.lucId+" je bila ugasnjena");
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
				posljiSporocilo("Luč z id "+req.params.lucId+" sledi urniku");
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
				posljiSporocilo("Luč z id "+req.params.lucId+" ne sledi urniku");
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
function posljiSporocilo(text) {
	var obvestilo = {
		userId: [],
		  showDateTim: new Date().toISOString(),
		  wasShown: false,
		  text: text,
		  extService: "Pametne luči"
	};
	fetch("http://studentdocker.informatika.uni-mb.si:2207/notification", {
		method: 'post',
		body: JSON.stringify(obvestilo),
		headers: { 'Content-Type': 'application/json' }
		}	
	)
	.then(function (response) {
		return response.json();
	}).then(function (data) {
		console.log(data);
	});
}

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})