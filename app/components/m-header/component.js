import Component from '@ember/component';
import isAuthenticatedMixin from 'fe-redpencil/mixins/is-authenticated-mixin';

export default Component.extend(isAuthenticatedMixin, {
	classNames: ['vl-u-display-block'],

	actions: {
		logout() {
			this.currentAuthenticatedSession.logout()
		}
	}
});
