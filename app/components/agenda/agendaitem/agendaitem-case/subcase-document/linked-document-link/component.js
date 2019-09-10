import Component from '@ember/component';
import { computed } from '@ember/object';
import isAuthenticatedMixin from 'fe-redpencil/mixins/is-authenticated-mixin';
import UploadDocumentMixin from 'fe-redpencil/mixins/upload-document-mixin';
import { inject } from '@ember/service';

export default Component.extend(isAuthenticatedMixin, UploadDocumentMixin, {
  globalError: inject(),
  fileService: inject(),
  classNames: ['vl-u-spacer-extended-bottom-s'],
  classNameBindings: ['aboutToDelete'],
  isShowingVersions: false,
  isUploadingNewVersion: false,
  uploadedFile: null,
  isEditing: false,
  documentToDelete: null,

  openClass: computed('isShowingVersions', function() {
    if (this.get('isShowingVersions')) {
      return 'js-vl-accordion--open';
    }
  }),

  lastDocumentVersion: computed('filteredDocumentVersions.@each', function() {
    return (this.get('filteredDocumentVersions') || []).objectAt(0);
  }),

  actions: {
    showVersions() {
      this.toggleProperty('isShowingVersions');
    },

    cancel() {
      this.set('documentToDelete', null);
      this.set('isVerifyingUnlink', false);
    },

    async verify() {
      const documentVersions = await this.get('documentToDelete.documentVersions');
      await this.unlinkDocumentVersions(documentVersions, this.get('item'));
      this.set('isVerifyingUnlink', false);
      // this.set('documentToDelete', null);
    },

    unlinkDocument(document) {
      this.set('documentToDelete', document);
      this.set('isVerifyingUnlink', true);
    },
  },
});
