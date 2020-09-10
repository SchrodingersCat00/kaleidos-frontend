import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject } from '@ember/service';

const {
  Model, attr, belongsTo, hasMany
} = DS;

export default Model.extend({
  intl: inject(),
  agendaitem: belongsTo('agendaitem'), // { inverse: null } ?
  subcase: belongsTo('subcase'), // { inverse: null } ?
  report: belongsTo('document', {
    inverse: null,
  }),
  reportRichText: attr('string'),
  newsletterInfo: belongsTo('newsletter-info'),
  decisionResultCode: belongsTo('decision-result-code', {
    inverse: null,
  }),
  modified: attr('datetime'),
  created: attr('datetime'),
  documents: hasMany('document-version', { inverse: null }),
  treatmentApproval: computed('report', function() {
    return this.intl.t('signed-document-decision', {
      name: this.get('report.lastDocument.name'),
    });
  }),
});
