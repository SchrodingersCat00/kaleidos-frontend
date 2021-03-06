const selectors = {
  vlModalComponents: {
    createNewAgendaModal: '[data-test-vl-modal="createNewAgendaModal"]',
  },
  agenda: {
    approveAgenda: '[data-test-agenda-approve-modal]',
  },
  baseModal: {
    container: '[data-test-vl-modal-container]',
    dialogWindow: '[data-test-vl-modal-dialogwindow]',
    close: '[data-test-vl-modal-close]',
  },
  manageInSettingsModal: {
    add: '[data-test-vl-model-manager-add]',
    edit: '[data-test-vl-model-manager-edit]',
    delete: '[data-test-vl-model-manager-delete]',
  },
  verify: {
    container: '[data-test-vl-modal-verify-container]',
    close: '[data-test-vl-modal-verify-close]',
    cancel: '[data-test-vl-modal-verify-cancel]',
    save: '[data-test-vl-modal-verify-save]',
  },
  modalDialog: '[data-test-vl-modal-dialog]',
};
export default selectors;
