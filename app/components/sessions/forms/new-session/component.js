import Component from '@ember/component';
import { inject as service } from '@ember/service';
import CONFIG from 'fe-redpencil/utils/config';
import moment from 'moment';

export default Component.extend({
  store: service(),
  agendaService: service(),
  newsletterService: service(),
  toaster: service(),
  formatter: service(),
  kind: null,
  selectedKindUri: null,

  async createAgenda(meeting, date) {
    const fallBackDate = this.formatter.formatDate(null);
    const agenda = this.store.createRecord('agenda', {
      name: 'Ontwerpagenda',
      createdFor: meeting,
      created: date || fallBackDate,
      modified: date || fallBackDate,
    });

    return await agenda.save();
  },

  async createAgendaItemToApproveMinutes(agenda, closestMeeting) {
    if (!closestMeeting) {
      return;
    }
    const fallBackDate = this.formatter.formatDate(null);
    const agendaitem = this.store.createRecord('agendaitem', {
      created: fallBackDate,
      agenda: agenda,
      priority: 1,
      shortTitle: `Goedkeuring van het verslag van de vergadering van ${moment(
        closestMeeting.plannedstart
      ).format('dddd DD-MM-YYYY')}.`,
      formallyOk: CONFIG.notYetFormallyOk,
      mandatees: [],
      documentVersions: [],
      approvals: [],
      isApproval: true
    });
    return await agendaitem.save();
  },

  actions: {
    async createNewSession() {
      const { isDigital, extraInfo, selectedKindUri } = this;
      this.set('isLoading', true);
      const kindUriToAdd = selectedKindUri || CONFIG.defaultKindUri;
      const date = this.formatter.formatDate(null);
      const startDate = this.get('startDate') || date;
      const newMeeting = this.store.createRecord('meeting', {
        isDigital,
        extraInfo,
        plannedStart: startDate,
        created: date,
        kind: kindUriToAdd,
      });
      const closestMeeting = await this.agendaService.getClosestMeetingAndAgendaId(startDate);

      newMeeting
        .save()
        .then(async (meeting) => {
          const agenda = await this.createAgenda(meeting, date);
          await this.createAgendaItemToApproveMinutes(agenda, closestMeeting);
          await this.newsletterService.createNewsItemForMeeting(meeting);

          // TODO: Should fix sessionNrBug
          // await this.agendaService.assignNewSessionNumbers();
        })
        .catch(() => {
          this.toaster.error();
        })
        .finally(() => {
          this.set('isLoading', false);
          this.successfullyAdded();
        });
    },

    async selectStartDate(val) {
      this.set('startDate', this.formatter.formatDate(val));
    },

    cancelForm(event) {
      this.cancelForm(event);
    },

    successfullyAdded() {
      this.successfullyAdded();
    },

    setKind(kind) {
      this.set('selectedKindUri', kind);
    },
  },
});
