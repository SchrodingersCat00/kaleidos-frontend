import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['vl-u-spacer--large'],
  selectedMeeting: null,

  items: computed('meetings', 'type', 'nearestMeeting', function() {
    if (this.type === 'future') {
      const nearestMeeting = this.get('nearestMeeting.firstObject');
      if (!nearestMeeting) {
        return this.meetings;
      }
      return this.meetings.filter((item) => item.get('id') !== nearestMeeting.get('id'));
    }
    return this.meetings;
  }),

  hasActiveAgendas: computed('meetings', async function() {
    const meetings = await this.get('meetings');
    if (meetings && meetings.length > 0) {
      return true;
    }
    return false;
  }),

  actions: {
    selectAgenda(meeting) {
      this.selectAgenda(meeting);
    },
  },
});
