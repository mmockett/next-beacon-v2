'use strict';

const aliases = require('./middleware/aliases');
const natural = require('natural');
const classifier = new natural.LogisticRegressionClassifier();


let allQueries = [];
//Get all queries and store the questions in an array for later lookup
aliases.poll().then(() => {
	allQueries = aliases.get('');
	classifier.addDocument('test', 'false'); // add this otherwise all random queries return the first one in the list
	allQueries.forEach(query => {
		if(query.question) { classifier.addDocument(query.question, query.name); }
		if(query.label) { classifier.addDocument(query.label, query.name); }
	});
	classifier.train();
});


module.exports = (message) => {
	const name = classifier.classify(message);
	const exactMatch = allQueries.filter(q => q.name === message || q.question === message || q.label === message);
	return exactMatch.length ? exactMatch : aliases.get(name);
}
