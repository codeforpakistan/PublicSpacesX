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
		console.log(k);
		gCategoryByPlaceTypes[e] = k;
	});
}

gFilterAllPlaces = { 
	"DS_SUBTIPO_EQUIPAMENTO" : { $in: gPlaceTypes }, 
	"DS_DEP_ADMINISTRATIVA" : { $ne: "Particular" } 
}

gEventTypes = {
'Encontro desportivo',
'Encontro cultural',
'Encontro manutenção',
'Encontro jardinagem',
'Encontro pets',
'Outro encontro',
};

