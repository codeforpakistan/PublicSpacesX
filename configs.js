// Configs
gLati = -25.441105;
gLongi = -49.276855;
gZoom = 12;


// Place types
gPlaceTypesByCategory = {
	"Parques e Praças": [
		"Bosque",
		"Praças",
		"Parques",
		"Zoológico",
		"Parque",
	],
	"Bibliotecas e Casas de leitura": [
		"Gibitecas",
		"Biblioteca Especializada",
		"Bibliotecas Temáticas",
		"Casa da Leitura",
		"Bibliotecas Escolares",
		"Estação da Leitura",
	],
	"Museus": [
		"Espaço Expositivo de Artes",
		"Museu",
	],
	"Centro de Cultura":[
		"Centro de Cultura",
	],
	"Esporte": [
		"Academia ao Ar Livre",
		"Centro de Esporte e Lazer",
		"Centro de Atividade Física",
	],
	"Feiras e Mercados": [
		"Feira",
		"Mercado",
		"Feira Gastronômica",
		"Feira Livre",
		"Feira Orgânica",
		"Feira Especial",
		"Feira Noturna",
		"Feira do Litoral",
	],
	"Outros": [
		"Plantação Rural",
	]
};

gPlaceTypes = _.flatten(gPlaceTypesByCategory);

gCategoryByPlaceTypes = {};
for (k in gPlaceTypesByCategory) {
	gPlaceTypesByCategory[k].forEach(function(e) {
		gCategoryByPlaceTypes[e] = k;
	});
}

gFilterAllPlaces = { 
	"DS_SUBTIPO_EQUIPAMENTO" : { $in: gPlaceTypes }, 
	"DS_DEP_ADMINISTRATIVA" : { $ne: "Particular" } 
};

gPlaceIcons = {
	"Academia ao Ar Livre": 'arlivre.png',
	"Casa da Leitura": 'casaleitura.png',
	"Feiras e Mercados": 'feira.png',
	"Parques e Praças": 'parque.png',
	"Bibliotecas e Casas de leitura": 'biblioteca.png',
	"Centro de Cultura": 'centrocul.png',
	"Esporte": 'esporte.png',
	"Museus": 'museu.png',
	"Plantação Rural":	'outros.png',
	"Praças": 'praca.png',
};

gEventTypes = [
	'Encontro desportivo',
	'Encontro cultural',
	'Encontro manutenção',
	'Encontro jardinagem',
	'Encontro pets',
	'Outro encontro',
];

gEventIcons = {
	'Encontro desportivo': 'enc_sport.png',
	'Encontro cultural': "enc_cultu.png",
	'Encontro de manutenção': 'enc_manut.png',
	'Encontro de jardinagem': 'enc_jardin.png',
	'Encontro para pets': 'enc_pets.png',
	'Outro encontro': 'enc_outros.png',
};

