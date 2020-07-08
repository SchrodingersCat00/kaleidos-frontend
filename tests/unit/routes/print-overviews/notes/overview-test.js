import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | print-overviews/notes/overview', (hooks) => {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:print-overviews/notes/overview');
    assert.ok(route);
  });
});
