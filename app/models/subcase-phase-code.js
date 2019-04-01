import DS from 'ember-data';

const { Model, attr, hasMany, belongsTo } = DS;

export default Model.extend({
	label: attr('string'),
	scopeNote: attr('string'),
	subcasephases: hasMany('subcase-phase'),
	subcasephaseCodes: hasMany('subcase-phase-code'),
	superphase: belongsTo('subcase-phase-code')
});