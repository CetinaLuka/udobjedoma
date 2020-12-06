const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
        title: "Pametne luci",
        description: "Mikrostoritev za upravljanje pametnih luči"
    },
	basePath: "/",    
    host: "localhost:3000",
    schemes: ['http'],
	produces: ['application/json'],
	definitions: {
		Soba: {
			_id:"5fc0d0252a5e2bde4b6b3d15",
			soba: "Kuhinja",
			luci:[
				{
					lucId:"5fc0d07a7e6387bddd65459b",
					luc:"Luc na stropu",
					prizgana:true,
					svetlost:60,
					barva:"#FFFFFF",
					prizgiOb:"07:00",
					ugasniOb:"23:00",
					slediUrniku:false
				}
			]
		},
		SeznamSob: [
			{
				
					
				_id:"5fc0d0252a5e2bde4b6b3d15",
				soba: "Kuhinja",
				luci:[
					{
						lucId:"5fc0d07a7e6387bddd65459b",
						luc:"Luc na stropu",
						prizgana:true,
						svetlost:60,
						barva:"#FFFFFF",
						prizgiOb:"07:00",
						ugasniOb:"23:00",
						slediUrniku:false
					}
				]
			}
		],
		Luc: {
			lucId:"5fc0d07a7e6387bddd65459b",
			luc:"Luc na stropu",
			prizgana:true,
			svetlost:60,
			barva:"#FFFFFF",
			prizgiOb:"07:00",
			ugasniOb:"23:00",
			slediUrniku:false
		}
	}
};
 
const outputFile = './swagger-output.json'
const endpointsFiles = ['./index.js']
 
swaggerAutogen(outputFile, endpointsFiles, doc).then( () => {
	require('./index.js')
})