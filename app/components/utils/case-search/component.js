import Component from '@ember/component';
import {inject} from "@ember/service";
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import {isEmpty} from '@ember/utils';
import DS from 'ember-data';
import {task, timeout} from "ember-concurrency";
import {computed, observer} from "@ember/object";
import moment from "moment";


export default Component.extend(DataTableRouteMixin, {
  store: inject(),
  muSearch: inject(),
  size: 5,
  sort: "title",
  action: "",
  onSelect: null,
  textSearchFields: ['title', 'shortTitle', 'data', 'subcaseTitle', 'subcaseSubTitle'],
  isLoading: false,
  isArchived: false,
  searchText: null,
  mandatees: [],
  dateFrom: null,
  dateTo: null,
  decisionsOnly: false,
  page: 0,


  postProcessDates: function (_case) {
    const sessionDates = _case.get('sessionDates');
    if (sessionDates) {
      if (Array.isArray(sessionDates)) {
        const moments = sessionDates.map(sessionDate => moment(sessionDate));
        _case.set('sessionDates', moments[moments.length - 1])
      } else {
        _case.set('sessionDates', moment(sessionDates));
      }
    }
  },
  model: computed("searchText", function () {
    return DS.PromiseArray.create({
      promise: (() => {
        let params = {};
        const searchModifier = ':sqs:';

        const textSearchKey = this.textSearchFields.join(',');
        let queryParams = {
          filter: {
            // 'is-archived': params.isArchived // Cannot post-filter on mu-cl-resources. field MUST be included in search-object keys
          },
          page: {
            size: this.size,
            number: this.page
          },
          sort: this.sort // Currently only "sessionDates available in search config"
        };
        queryParams.filter[searchModifier + textSearchKey] = this.searchText;

        let searchDocumentType = this.decisionsOnly ? 'casesByDecisionText' : 'cases';
        if (!isEmpty(this.mandatees)) {
          queryParams.filter['creators,mandatees'] = this.mandatees;
        }
        if (!isEmpty(this.dateFrom)) {
          queryParams.filter[':gte:sessionDates'] = this.dateFrom;
        }
        if (!isEmpty(this.dateTo)) {
          queryParams.filter[':lte:sessionDates'] = this.dateTo;
        }
        const postProcessDates = this.postProcessDates;
        return this.muSearch.query(searchDocumentType,
          queryParams,
          "case",
          {'session-dates': 'sessionDates'})
          .then((res) => {
            this.set('isLoading', false);
            res.forEach(postProcessDates);
            return res;
          }).catch((error) => {
            console.log(error);
            this.set('isLoading', false);
            return [];
          })
      })()
    })

  }),

  actions: {
    async selectCase(caseItem, event) {
      if (event) {
        event.stopPropagation();
      }
      this.onSelect(caseItem);
    },
    selectSize(size) {
      this.set('size', size);
    },
    filterCases(filter) {
      this.set('page', 0);
      const stoppingSearch = Boolean(!filter.searchText);
      if (stoppingSearch) {
        this.set('searchText', null);
        this.set('mandatees', null);
        this.set('dateFrom', null);
        this.set('dateTo', null);
        this.set('sort', null);
      } else {
        this.set('searchText', filter.searchText);
        this.set('mandatees', filter.mandatees);
        this.set('dateFrom', filter.dateFrom);
        this.set('dateTo', filter.dateTo);
        this.set('decisionsOnly', filter.searchInDecisionsOnly);
      }
    },

  }


});
