import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { downloadFilePrompt } from 'fe-redpencil/utils/file-utils';
import { A } from '@ember/array';

/**
 * @param modelToAddDocumentVersionTo:String Is the model where the relation of document-version should be set to.
 */
export default Mixin.create({
  store: service(),
  fileService: service(),

  documentsInCreation: A([]), // When creating new documents
  document: null, // When adding a new version to an existing document

  modelToAddDocumentVersionTo: null,

  createNewDocument(title, type, confidential, documentVersion) {
    const creationDate = moment()
      .utc()
      .toDate();
    return this.store.createRecord('document', {
      created: creationDate,
      title: title,
      type: type,
      documentVersions: documentVersion ? A([documentVersion]) : undefined, // Optional
      freezeAccessLevel: confidential,
    });
  },

  async createNewDocumentVersion(uploadedFile, document, chosenFileName) {
    document = await document;
    const latestVersionNumber = document ? document.get('lastDocumentVersion') || 0 : 0;
    return this.store.createRecord('document-version', {
      document, // Optional
      versionNumber: latestVersionNumber + 1,
      file: uploadedFile,
      created: moment()
        .utc()
        .toDate(),
      chosenFileName, // Optional
    });
  },

  async saveDocuments(freezeAccessLevel) {
    this.set('isLoading', true);
    const documents = this.get('documentsInCreation');

    const savedDocuments = await Promise.all(
      documents.map(async (document) => {
        const documentVersion = await document.get('documentVersions.firstObject');
        document.set('freezeAccessLevel', freezeAccessLevel);

        return documentVersion.save().then((documentVersion) => {
          return document.save().then((document) => {
            this.fileService.convertDocumentVersion(documentVersion);
            return document;
          });
        });
      })
    );

    this.set('documentsInCreation', A([]));
    this.set('isLoading', false);
    return savedDocuments;
  },

  async attachDocumentsToModel(documents, model) {
    const modelName = await model.get('constructor.modelName');
    // Don't do anything if other than these
    if (!['meeting-record', 'decision'].includes(modelName)) {
      return model;
    }

    const modelDocuments = await model.get('documents');
    if (modelDocuments) {
      model.set(
        'documents',
        A(Array.prototype.concat(modelDocuments.toArray(), documents.toArray()))
      );
    } else {
      model.set('documents', documents);
    }
    return model;
  },

  async attachDocumentVersionsToModel(documentVersions, model) {
    const modelName = await model.get('constructor.modelName');
    // Don't do anything for these models
    if (['meeting-record', 'decision'].includes(modelName)) {
      return model;
    }

    const modelDocumentVersions = await model.get('documentVersions');
    if (modelDocumentVersions) {
      model.set(
        'documentVersions',
        A(Array.prototype.concat(modelDocumentVersions.toArray(), documentVersions.toArray()))
      );
    } else {
      model.set('documentVersions', documentVersions);
    }
    return model;
  },

  actions: {
    async uploadedFile(uploadedFile) {
      const documentVersion = await this.createNewDocumentVersion(uploadedFile);
      let document;
      if (this.get('document')) {
        document = this.get('document');
      } else {
        document = this.createNewDocument(
          uploadedFile.get('filenameWithoutExtension'),
          undefined,
          undefined,
          documentVersion
        );
        this.get('documentsInCreation').pushObject(document);
      }
      documentVersion.set('document', document);
    },

    async downloadFile(version) {
      const documentVersion = await version;
      let file = await documentVersion.get('file');
      downloadFilePrompt(this, file, documentVersion.get('name'));
    },

    async removeDocument(document) {
      this.get('documentsInCreation').removeObject(document);
      const file = await document.get('documentVersions.firstObject.file');
      if (file.get('id')) {
        file.destroyRecord();
      }
      document.get('documentVersions.firstObject').rollbackAttributes();
      document.rollbackAttributes();
    },

    async showDocumentVersionViewer(documentVersion) {
      window.open(`/document/${(await documentVersion).get('id')}`);
    },
  },
});