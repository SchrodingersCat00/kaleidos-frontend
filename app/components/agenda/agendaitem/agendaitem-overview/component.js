import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
	sessionService: inject(),
	store: inject(),
	currentAgenda: alias('sessionService.currentAgenda'),
	postponeTargetSession: null,
	classNames: ["vl-layout-agenda__detail"],
	isShowingDetail: false,
	agendaitemToShowOptionsFor: null,
	isShowingPostponeModal: false,
	currentAgendaItem: null,
	activeAgendaItemSection: 'details',
	showOptions: false,

	isPostPonable: computed('sessionService.agendas.@each', function () {
		return this.get('sessionService.agendas').then(agendas => {
			if (agendas && agendas.length > 1) {
				return true;
			} else {
				return false;
			}
		})
	}),

	lastDefiniteAgenda: computed('sessionService.definiteAgendas.firstObject', async function () {
		const definiteAgendas = await this.get('sessionService.definiteAgendas');
		return definiteAgendas.get('lastObject');
	}),

	actions: {
		showDetail() {
			this.toggleProperty('isShowingDetail');
		},

		showOptions() {
			this.toggleProperty('showOptions');
		},

		async togglePostponed(agendaitem) {
			if (agendaitem) {
				let isPostponed = await agendaitem.get('isPostponed');
				if (isPostponed) {
					agendaitem.set('postponed', false);
					agendaitem.set('postponedToSession', null);
					agendaitem.save();
				} else {
					this.toggleProperty('isShowingPostponeModal');
				}
			}
		},

		async postponeAgendaItem(agendaitem) {
			let target = await this.get('postponeTargetSession');

			if (target) {
				agendaitem.set('postponedToSession', target);
			}
			agendaitem.set('postponed', true);

			await agendaitem.save();

			this.set('postponeTargetSession', null);
			this.set('isShowingPostponeModal', false);
		},

		chooseSession(session) {
			this.set('postponeTargetSession', session);
		},

		deleteItem(agendaitem) {
			agendaitem.destroyRecord().then(() => {
				this.set('agendaitem', null);
			});
		},

		toggleShowMore(agendaitem) {
			if (agendaitem.showDetails) {
				agendaitem.save();
			}
			agendaitem.toggleProperty("showDetails");
		},

		setAgendaItemSection(section) {
			this.set("activeAgendaItemSection", section);
		}
	}
});
