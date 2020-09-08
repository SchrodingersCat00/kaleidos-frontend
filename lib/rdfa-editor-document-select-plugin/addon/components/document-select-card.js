import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { A } from '@ember/array';
import {analyse} from '@lblod/marawa/rdfa-context-scanner'

/**
 * Card that prompts the user to confirm text insert
 *
 * @class TextExpandConfirmCard
 * @extends Glimmer.Component
 */

export default class DocumentSelectCard extends Component {
    @service router;
    @service store;

    @tracked agendaitem;
    @tracked isLoading;

    constructor(){
        super(...arguments);
        this.info = this.args.info;
        this.listRoot = this.info.listRoot ? this.info.listRoot : this.createListHeader();
        this.documents = A([]);
        this.getRecords();
    }

    async insertHtmlListInDocument(){
        const info = this.info;
        const mappedLocation = info.hintsRegistry.updateLocationToCurrentIndex(info.hrId, info.location);
        let selection = info.editor.selectHighlight(mappedLocation);
        const html = this.listRoot.childNodes.length > 0 ? this.listRoot.outerHTML : '';
        info.editor.update(selection, {
            set: { innerHTML: html }
        });
    }

    createListHeader(){
        const ul = document.createElement('ul');
        ul.setAttribute('property', 'https://documents');
        return ul;
    }

    clearHtmlNodeChildren(node){
        while (node.firstChild) node.removeChild(node.lastChild);
    }

    @action
    updateDocumentsInDecisionSheet(){
        // clear root children
        this.clearHtmlNodeChildren(this.listRoot);
        for(let document of this.documents.filter(x => x.isSelected)){
            this.addDecisionDocumentToHtmlList(document);
        }
        this.insertHtmlListInDocument();
        this.info.hintsRegistry.removeHintsAtLocation(this.info.location);
    }

    addDecisionDocumentToHtmlList(decisionDocument) {
        const li = document.createElement('li');
        li.setAttribute('property', 'https://seeAlso');
        li.setAttribute('href', decisionDocument.name); // needs to be updated to real name
        li.textContent = decisionDocument.name;
        this.listRoot.appendChild(li);
    }

    @action
    async decisionDocumentClicked(decisionDocument){
        if (decisionDocument.isSelected == undefined){
            decisionDocument.isSelected = true;
        } else {
            decisionDocument.isSelected = !decisionDocument.isSelected;
        }
    }

    async getRecords(){
        const agendaItemId = this.router.currentRoute.parent.params.agendaitem_id;
        this.isLoading = true;
        this.agendaitem = await this.store.findRecord('agendaitem', agendaItemId);
        const documents = await this.agendaitem.documents;
        if(!documents) {
            this.isLoading = false;
            return;
        }
        const lastDocuments = await Promise.all(
            documents.map(async (d) => await d.lastDocument)
        );
        this.documents.pushObjects(lastDocuments);
        this.isLoading = false;
    }
}