import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
	remark: attr('string'),
  label: attr('string'),
	date: attr('date'),
	subcases: belongsTo('subcase'),
	code: belongsTo('subcase-phase-code')
});