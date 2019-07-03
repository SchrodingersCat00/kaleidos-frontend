import DS from 'ember-data';
import { computed } from '@ember/object';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
	created: attr('date'),
	chosenFileName: attr('string'),
	identificationNumber: attr('string'),
	versionNumber: attr('number'),
	serialNumber: attr('string'),

	document: belongsTo('document', { inverse: null }),
	subcase: belongsTo('subcase', { inverse: null }),
	agendaitem: belongsTo('agendaitem', { inverse: null }),
	announcement: belongsTo('announcement'),
	file: belongsTo('file'),
	convertedFile: belongsTo('file', { inverse: null }),
	newsletter: belongsTo('newsletter-info'),

	nameToDisplay: computed('chosenFileName', 'document', 'file', function () {
		const chosenFileName = this.get('chosenFileName');
		if (chosenFileName) {
			return chosenFileName;
		} else if (this.get('file.filename')) {
			return this.get('file.filename');
		} else if (this.get('document.title')) {
			return this.get('document.title')
		} else {
			return this.get('file.name');
		}
	})
});
