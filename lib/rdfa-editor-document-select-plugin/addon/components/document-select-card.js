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
        this.isNewList = this.info.isNewList;
        this.documents = A([]);
        this.getRecords();
    }

    async insertDocumentsHeader(document){
        const info = this.info;
        const mappedLocation = info.hintsRegistry.updateLocationToCurrentIndex(info.hrId, info.location);
        let selection = info.editor.selectHighlight(mappedLocation);
        //TODO update to actual link
        const html = `<div><ul property="http://documents"><li href="${document.name}" property="http://seeAlso">${document.name}</li></ul></div>`;
        info.editor.update(selection, {
            set: { innerHTML: html }
        });
    }

    findList(richNode){
        let current = richNode;
        while (!current.rdfaAttributes || !current.rdfaAttributes.properties.includes('http://documents'))
            current = current.parent;

        return current;
    }

    failingTestCase(){
        const root = document.createElement('div');
        const ul = document.createElement('ul');
        ul.setAttribute('property', 'http://documents');
        const li = document.createElement('li');
        li.setAttribute('property', 'http://seeAlso');
        root.appendChild(ul);
        ul.appendChild(li);
        li.innerText = 'donut';
        console.log(root);
        const blocks = analyse(root);
        console.log(blocks); // problem -> does not contain http://documents rdfablock!
    }

    @action
    async decisionDocumentClicked(decisionDocument){
        this.failingTestCase();
        if (this.isNewList) {
            this.insertDocumentsHeader(decisionDocument);
            this.info.hintsRegistry.removeHintsAtLocation(this.info.location);
            this.isNewList = false;
            return;
        }

        // const listNode = this.findList(this.info.rdfaBlock.richNodes[0]).domNode;
        const mappedLocation = this.info.hintsRegistry.updateLocationToCurrentIndex(this.info.hrId, this.info.location);
        // this is not working yet
        const listNode = this.info.editor.selectContext(this.info.editor.richNode.region, { property: "http://documents"});

        this.info.editor.update(listNode, {
            set: { innerHTML: '<p>Hello</p>' },
            desc: 'Test'
        });


        // TODO: update naar URL
        // const filteredPresentDocuments = [...listNode.childNodes].filter(node => {
        //     return node.getAttribute('href') === decisionDocument.name;
        // });
        // const nodeToRemove = filteredPresentDocuments.length > 0 ? filteredPresentDocuments[0] : undefined;

        // if (nodeToRemove) {
        //     // remove document
        //     listNode.removeChild(nodeToRemove);
        // } else {
        //     // insert document
        //     const newEl = document.createElement('li');
        //     newEl.setAttribute("property", "https://seeAlso");
        //     newEl.setAttribute("href", decisionDocument.name);
        //     newEl.textContent = decisionDocument.name;
        //     listNode.appendChild(newEl);
        // }

        // // if no documents present in document, remove list
        // if (listNode.childNodes.length === 0){
        //     listNode.parentNode.removeChild(listNode);
        //     this.isNewList = true;
        // }

        this.info.hintsRegistry.removeHintsInRdfaBlocks([this.info.rdfaBlock], this.info.hrId, this.info.scope);
    }

    async getRecords(){
        const agendaItemId = this.router.currentRoute.parent.params.agendaitem_id;
        this.isLoading = true;
        this.agendaitem = await this.store.findRecord('agendaitem', agendaItemId);
        const documents = await this.agendaitem.documents;
        const lastDocuments = await Promise.all(documents.map(async (d) => {
            const newest = await d.lastDocument;
            return newest;
        }));
        this.documents.pushObjects(lastDocuments);
        this.isLoading = false;
    }
}