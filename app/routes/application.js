import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  moment: inject(),
  intl: inject(),
  currentSession: inject(),
  routeAfterAuthentication: "agendas",

  beforeModel() {
    this.intl.setLocale('nl-be');
  }
});