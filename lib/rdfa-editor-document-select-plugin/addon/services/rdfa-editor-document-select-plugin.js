import Service from '@ember/service';
import normalizeLocation from '../utils/normalize-location';

const CARD_COMPONENT_ID = 'document-select-card';

/**
 * Service responsible for detecting and expanding predefined keywords
 *
 * @class RdfaEditorTextExpandPlugin
 * @extends EmberService
 */

export default class RdfaEditorDocumentSelectPlugin extends Service {
    constructor() {
        super(...arguments);
        this.scope = 'rdfa-editor-document-select-plugin';
        this.cardComponentId = CARD_COMPONENT_ID;
        this.insertDecisionDocumentsKeyword = /:docu/g;
    }

    addDocsSelectorHint(hrId, hintsRegistry, editor, rdfaBlock, location, listRoot){
        hintsRegistry.addHint(hrId, this.scope, {
            location,
            card: this.cardComponentId,
            info: {
                hrId, hintsRegistry, editor,
                location,
                scope: this.scope,
                rdfaBlock,
                listRoot
            }
        });
    }

    execute(hrId, rdfaBlocks, hintsRegistry, editor) {
        hintsRegistry.removeHintsInRdfaBlocks(rdfaBlocks, hrId, this.scope);
        const keyword = this.insertDecisionDocumentsKeyword;
        for (const rdfaBlock of rdfaBlocks) {
            if (!rdfaBlock.text) return;

            // check if a new block needs to be inserted
            const matches = rdfaBlock.text.matchAll(keyword);
            for (let match of matches) {
                if (match) {
                    const { 0: fullMatch, 1: term, index: start } = match;
                    const location = normalizeLocation([start, start + fullMatch.length], rdfaBlock.region);
                    this.addDocsSelectorHint(hrId, hintsRegistry, editor, rdfaBlock, location);
                }
            }

            // if the rdfaBlock belongs to a documents section, show highlight
            // Needs to check on children because rdfaBlocks only contains children
            const nodeAttributes = rdfaBlock.semanticNode.rdfaAttributes;
            if (
                nodeAttributes &&
                nodeAttributes.properties.includes('https://seeAlso')){
                const parent = rdfaBlock.semanticNode.parent;
                if(!parent.rdfaAttributes.properties.includes('https://documents')) continue;
                const location = parent.region;
                this.addDocsSelectorHint(hrId, hintsRegistry, editor, rdfaBlock, location, parent.domNode);
                break; // there may be multiple children of parent we just hinted, need only one hint
            }
        }
    }
}
