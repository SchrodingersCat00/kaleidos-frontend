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

/**
 * TODO:
 *  Nieuw agendapunt maken voor testen!
 *  Selected documents pushen naar agendaItem.treatments.firstObject.documents
 *  Title inserten (shortTitle + title)
 *  + andere dingen
 */

export default class DocumentSelectCard extends Component {
    @service router;
    @service store;

    @tracked isLoading;
    @tracked hasHeader;

    constructor(){
        super(...arguments);
        this.info = this.args.info;
        this.hasHeader = this.info.headerRoot ? true : false;
        if(!this.info.headerRoot){
            // was invoked with keyword
            this.headerRoot = this.createHeaderRoot();
        } else {
            // was invoked because header was detected
            this.headerRoot = this.info.headerRoot;
        }
        // headerData = { title:str, shortTitle:str, documents:[], meetingNumber:str, meetingPlannedStart:str}
        this.headerData = {}; // data that will be passed to the nodes
        this.headerData.documents = A([]);
        this.getDecisionSheetData();
    }

    async insertNodeInDecisionSheet(){
        const info = this.info;
        const mappedLocation = info.hintsRegistry.updateLocationToCurrentIndex(info.hrId, info.location);
        let selection = info.editor.selectHighlight(mappedLocation);
        const html = this.headerRoot.childNodes.length > 0 ? this.headerRoot.outerHTML : '';
        console.log(this.headerRoot);
        info.editor.update(selection, {
            set: { innerHTML: html }
        });
    }

    createHeaderRoot(){
        /**
         * Creates a Node containing the structure of the header
         */
        const div = document.createElement('div');
        const logo = document.createElement('img');
        const h1 = document.createElement('h1');
        const h2 = document.createElement('h2');
        h1.setAttribute('class', 'underline');
        h2.setAttribute('class', 'underline');
        const shortTitle = document.createElement('p');
        const title = document.createElement('p');
        const ul = document.createElement('ul');
        div.setAttribute('property', 'https://header');
        logo.setAttribute('src', '/assets/logo_vlaamse_regering.svg');
        logo.setAttribute('alt', 'Logo of the Flemish government');
        ul.setAttribute('property', 'https://documents');
        ul.setAttribute('id', 'documentList');
        div.appendChild(logo);
        div.appendChild(h1);
        div.appendChild(h2);
        div.appendChild(shortTitle);
        div.appendChild(title);
        div.appendChild(ul);
        return div;
    }

    @action
    insertDecisionSheetHeader(){
        /**
         * Insert the data in the root Node and add it
         * to the decision document
         */
        this.insertDataInRoot();
        this.insertNodeInDecisionSheet();
        this.info.hintsRegistry.removeHintsAtLocation(this.info.location);
    }

    insertDataInRoot(){
        /**
         * inserts the data from headerData into rootNode
         */
        const [logo, h1, h2, shortTitle, title, ul] = this.headerRoot.childNodes;
        h1.textContent = this.headerData.meetingNumberRepresentation;
        h2.textContent = 'Betreft:';
        // TODO newline werkt niet: 2 aparte paragraphs?
        shortTitle.textContent = this.headerData.shortTitle;
        title.textContent = this.headerData.title;
        this.addDocumentsToListNode(ul);
    }

    @action
    updateDocumentListDataInNode(){
        const [logo, h1, h2, shortTitle, title, ul] = this.headerRoot.childNodes;
        this.addDocumentsToListNode(ul);
    }

    clearHtmlNodeChildren(node){
        while (node.firstChild) node.removeChild(node.lastChild);
    }

    addDocumentsToListNode(listNode){
        /**
         * add document nodes to a listNode
         */
        // clear root children
        this.clearHtmlNodeChildren(listNode);
        for(let document of this.headerData.documents.filter(x => x.isSelected)){
            this.addDecisionDocumentToHtmlList(listNode, document);
        }
    }

    addDecisionDocumentToHtmlList(listNode, decisionDocument) {
        const li = document.createElement('li');
        li.setAttribute('property', 'https://seeAlso');
        li.setAttribute('href', decisionDocument.uri); // needs to be updated to real name
        li.textContent = decisionDocument.name;
        listNode.appendChild(li);
    }

    @action
    async decisionDocumentClicked(decisionDocument){
        if (decisionDocument.isSelected == undefined){
            decisionDocument.isSelected = true;
        } else {
            decisionDocument.isSelected = !decisionDocument.isSelected;
        }
    }

    async getDecisionSheetData(){
        this.isLoading = true;
        const agendaItemId = this.router.currentRoute.parent.params.agendaitem_id; // TODO doe zoals hier onder
        const meeting = this.router.currentRoute.parent.parent.parent.attributes.meeting;
        this.agendaitem = await this.store.findRecord('agendaitem', agendaItemId);
        let documents = await this.agendaitem.documents;
        documents = documents ? documents : []; // if no documents are found for agendaitem
        this.headerData.documents = await Promise.all(
            documents.map(async (d) => await d.lastDocument)
        );
        this.headerData.shortTitle = this.agendaitem.shortTitle;
        this.headerData.title = this.agendaitem.title;
        this.headerData.meetingNumberRepresentation = meeting.numberRepresentation;
        console.log(meeting.plannedStart);
        const treatments = await this.agendaitem.treatments;
        const treatment = treatments.firstObject;
        // treatment.set('documents', []);
        // treatment.save();
        this.isLoading = false;
    }
}