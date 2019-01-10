import DS from 'ember-data';

let { Model, attr, belongsTo } = DS;

export default Model.extend({
	name: attr("string"),
	dateSent: attr("date"),
	final:attr("boolean"),
	session: belongsTo('session')
});
