import Component from '@ember/component';
import { computed } from '@ember/object';
import isAuthenticatedMixin from 'fe-redpencil/mixins/is-authenticated-mixin';
import UploadDocumentMixin from 'fe-redpencil/mixins/upload-document-mixin';
import { inject } from '@ember/service';
import EmberObject from '@ember/object';

export default Component.extend(isAuthenticatedMixin, UploadDocumentMixin, {
  globalError: inject(),
  fileService: inject(),
  classNames: ['vl-u-spacer-extended-bottom-s'],
  classNameBindings: ['aboutToDelete'],
  isShowingVersions: false,
  isUploadingNewVersion: false,
  uploadedFile: null,
  fileName: null,
  isEditing: false,
  documentToDelete: null,

  aboutToDelete: computed('document.aboutToDelete', function() {
    if (this.document) {
      if (this.document.get('aboutToDelete')) {
        return 'deleted-state';
      }
    }
  }),

  numberVr: computed('document.numberVr', function() {
    return this.get('document.numberVr');
  }),

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

    delete() {},
    saveChanges() {},
    add(file) {
      this.set('uploadedFile', file);
      this.send('uploadedFile', file);
      //   const { item, uploadedFile, fileName } = this;
      //   this.set('isLoading', true);
      //   try {
      //     const document = await this.get('document');
      //     const newVersion = await document.get('lastDocumentVersion');
      //     uploadedFile.set('fileName', fileName);
      //     const newDocumentVersion = await this.createNewDocumentVersion(
      //       uploadedFile,
      //       document,
      //       newVersion.get('versionNumber')
      //     );
      //     document.set('lastDocumentVersion', newDocumentVersion);
      //   } catch (e) {
      //     // TODO: Handle errors
      //   } finally {
      //     await item.hasMany('documentVersions').reload();
      //     if (!this.get('isDestroyed')) {
      //       this.set('isUploadingNewVersion', false);
      //       this.set('isLoading', false);
      //     }
      //   }
    },

    async openUploadDialog() {
      const uploadedFile = this.get('uploadedFile');
      if (uploadedFile && uploadedFile.id) {
        await this.fileService.removeFile(uploadedFile.id);
        this.set('uploadedFile', null);
      }
      this.toggleProperty('isUploadingNewVersion');
    },

    async toggleIsEditing() {
      if (!this.get('document.numberVr')) {
        this.get('document').rollbackAttributes();
        const lastVersion = await this.document.get('lastDocumentVersion');
        this.document.set('numberVr', lastVersion.get('nameToDisplay'));
      }
      this.toggleProperty('isEditing');
    },

    async saveDocuments() {
      this.set('isLoading', true);
      const documentVersion = await this.get('document.lastDocumentVersion');
      await documentVersion.save();
      const item = await this.attachDocumentVersionsToModel([documentVersion], this.get('item'));
      await item.save();
      this.set('isLoading', false);
      this.toggleProperty('isEditing');
    },

    cancel() {
      this.set('documentToDelete', null);
      this.set('isVerifyingDelete', false);
    },

    verify() {
      this.globalError.showToast.perform(
        EmberObject.create({
          title: 'Opgelet!',
          message: 'Document wordt verwijderd.',
          type: 'warning-undo',
          modelIdToDelete: this.documentToDelete.get('id'),
        })
      );
      this.fileService.get('deleteDocumentWithUndo').perform(this.documentToDelete);
      this.set('isVerifyingDelete', false);
      this.set('documentToDelete', null);
    },

    deleteDocument(document) {
      this.set('documentToDelete', document);
      this.set('isVerifyingDelete', true);
    },

    toggleFreezeAccessLevel(document) {
      document.toggleProperty('freezeAccessLevel');
      document.save();
    },
  },
});
