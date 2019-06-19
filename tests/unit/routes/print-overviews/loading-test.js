import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | print-overviews/loading', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:print-overviews/loading');
    assert.ok(route);
  });
});