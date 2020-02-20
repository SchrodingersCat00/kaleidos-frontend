import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { EditAgendaitemOrSubcase } from 'fe-redpencil/mixins/edit-agendaitem-or-subcase';
import isAuthenticatedMixin from 'fe-redpencil/mixins/is-authenticated-mixin';

export default Component.extend(EditAgendaitemOrSubcase, isAuthenticatedMixin, {
	store: inject(),
	classNames: ["vl-u-spacer-extended-bottom-l"],
	item: null,
	propertiesToSet: Object.freeze(['themes']),

	themes: computed('item.themes', {
    async get() {
      const { item } = this;
      if (item) {
        return await item.get('themes').then((themes) => {
          return themes.toArray();
        })
      }
    },
    set: function (key, value) {
      return value;
    }
  }),
});
