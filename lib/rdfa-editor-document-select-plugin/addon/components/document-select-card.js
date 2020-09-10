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
 * fonts fixen
 *
 */

export default class DocumentSelectCard extends Component {
    @service router;
    @service store;

    @tracked isLoading;
    @tracked hasHeader;

    weekdayMap = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
    monthMap = [
        'januari',
        'februari',
        'maart',
        'april',
        'mei',
        'juni',
        'juli',
        'augustus',
        'september',
        'oktober',
        'november',
        'december'
    ]

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
         * <div main>
         *  <header>
         *   <img logo/>
         *   <h1>Vergadering van datum</h1>
         *  </header>
         *  <h1>meetingNumber</h1>
         *  <h2>Betreft: </h2>
         *  <p>shortTitle</p>
         *  <p>title</p>
         *  <ul>documents</ul>
         *  <h2>Beslissing:</h2>
         *  <p>De Vlaamse Regering beslist:</p>
         */
        const main = document.createElement('div');
        main.setAttribute('class', 'document.bvr');
        main.setAttribute('property', 'https://header');
        const header = document.createElement('div');
        header.setAttribute('class', 'header');
        const logo = document.createElement('img');
        logo.setAttribute('src', '/assets/logo_vlaamse_regering_cropped.svg');
        logo.setAttribute('alt', 'Logo of the Flemish government');
        logo.setAttribute('class', 'vr-logo-wrapper');
        const date = document.createElement('p');
        header.appendChild(logo);
        header.appendChild(date);
        const meetingNumber = document.createElement('h1');
        const betreft = document.createElement('h2');
        const shortTitle = document.createElement('p');
        const title = document.createElement('p');
        const documentsList = document.createElement('ul');
        documentsList.setAttribute('property', 'https://documents');
        documentsList.setAttribute('id', 'documentList');
        const beslissing = document.createElement('h2');
        const de_vlaamse_reg_beslist = document.createElement('p');
        main.appendChild(header);
        main.appendChild(meetingNumber)
        main.appendChild(betreft);
        main.appendChild(shortTitle);
        main.appendChild(title);
        main.appendChild(documentsList);
        main.appendChild(beslissing);
        main.appendChild(de_vlaamse_reg_beslist);
        return main;
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
        const data = this.headerData;
        const [
            header,
            meetingNr,
            betreft,
            shortTitle,
            title,
            documentsList,
            beslissing,
            de_vlaamse_reg_beslist
        ] = this.headerRoot.childNodes;
        const [logo, dateNode] = header.childNodes;
        const weekday = this.weekdayMap[data.meetingPlannedStart.getDay()];
        const date = data.meetingPlannedStart.getDate();
        const month = this.monthMap[data.meetingPlannedStart.getMonth()];
        const year = data.meetingPlannedStart.getFullYear();
        dateNode.textContent = `Vergadering van ${weekday} ${date} ${month} ${year}`;
        console.log(data.meetingPlannedStart)
        meetingNr.textContent = data.meetingNumberRepresentation;
        betreft.textContent = 'Betreft:';
        // TODO newline werkt niet: 2 aparte paragraphs?
        shortTitle.textContent = data.shortTitle;
        title.textContent = data.title;
        this.addDocumentsToListNode(documentsList);
        beslissing.textContent = 'Beslissing:';
        de_vlaamse_reg_beslist.textContent = 'De Vlaamse Regering beslist:';
    }

    @action
    updateDocumentListDataInNode(){
        const [header, h1, h2, shortTitle, title, ul] = this.headerRoot.childNodes;
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
        this.headerData.meetingPlannedStart = meeting.plannedStart;
        const treatments = await this.agendaitem.treatments;
        const treatment = treatments.firstObject;
        // treatment.set('documents', []);
        // treatment.save();
        this.isLoading = false;
    }
}