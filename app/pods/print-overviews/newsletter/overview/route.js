import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject } from '@ember/service';
import {
  setCalculatedGroupPriorities,
  groupAgendaitemsByGroupname,
  sortByPriority
} from 'fe-redpencil/utils/agenda-item-utils';

export default Route.extend({
  sessionService: inject(),
  agendaService: inject(),

  type: 'newsletter',
  allowEmptyGroups: true,

  queryParams: {
    definite: {
      refreshModel: true,
    },
  },

  async model(params) {
    const session = await this.modelFor('print-overviews');
    const agenda = await this.modelFor(`print-overviews.${this.type}`);
    const agendaitems = await this.store.query('agendaitem', {
      filter: {
        agenda: {
          id: agenda.get('id'),
        },
      },
      include: 'mandatees',
      sort: 'priority',
    });
    const announcements = this.filterAnnouncements(agendaitems.filter((agendaitem) => agendaitem.showAsRemark), params);

    const {
      draftAgendaitems, groupedAgendaitems,
    } = await this.parseAgendaItems(
      agendaitems, params
    );

    await this.agendaService.groupAgendaItemsOnGroupName(draftAgendaitems);

    const groupsArray = sortByPriority(groupedAgendaitems, this.allowEmptyGroups);

    return hash({
      currentAgenda: agenda,
      groups: groupsArray,
      agendaitems: draftAgendaitems.sortBy('priority'),
      announcements: announcements.sortBy('priority'),
      meeting: session,
    });
  },

  async parseAgendaItems(agendaitems, params) {
    let draftAgendaitems = agendaitems.filter((agendaitem) => !agendaitem.showAsRemark && !agendaitem.isApproval);

    draftAgendaitems = await this.filterAgendaitems(draftAgendaitems, params);

    await setCalculatedGroupPriorities(draftAgendaitems);

    const groupedAgendaitems = Object.values(groupAgendaitemsByGroupname(draftAgendaitems));
    return {
      draftAgendaitems,
      groupedAgendaitems,
    };
  },

  filterAnnouncements(announcements) {
    return announcements.filter((agendaitem) => agendaitem.showInNewsletter);
  },

  async filterAgendaitems(agendaitems, params) {
    if (params.definite !== 'true') {
      return agendaitems;
    }
    const newsLetterByIndex = await Promise.all(agendaitems.map(async(agendaitem) => {
      try {
        const agendaActivity = await agendaitem.get('agendaActivity');
        const subcase = await agendaActivity.get('subcase');
        const newsletterInfo = await subcase.get('newsletterInfo');
        return newsletterInfo.inNewsletter;
      } catch (exception) {
        console.warn('An exception occurred: ', exception);
        return false;
      }
    }));
    const filtered = [];
    agendaitems.map((agendaitem, index) => {
      if (newsLetterByIndex[index]) {
        filtered.push(agendaitem);
      }
      return null;
    });
    return filtered;
  },
});
