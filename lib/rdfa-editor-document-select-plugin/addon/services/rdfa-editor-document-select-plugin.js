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
        this.cardComponentId = 'document-select-card';
    }

    execute(hrId, rdfaBlocks, hintsRegistry, editor) {
        hintsRegistry.removeHintsInRdfaBlocks(rdfaBlocks, hrId, this.scope);
        const keyword = /:docu/g;
        for (const rdfaBlock of rdfaBlocks) {
            if (!rdfaBlock.text) return;

            // find if a new block needs to be inserted
            const matches = rdfaBlock.text.matchAll(keyword);
            for (let match of matches) {
                if (match) {
                    const { 0: fullMatch, 1: term, index: start } = match;

                    const absoluteLocation = normalizeLocation([start, start + fullMatch.length], rdfaBlock.region);

                    hintsRegistry.addHint(hrId, this.scope, {
                        location: absoluteLocation,
                        card: this.cardComponentId,
                        info: {
                            hrId, hintsRegistry, editor,
                            location: absoluteLocation,
                            scope: this.scope,
                            rdfaBlock,
                            isNewList: true
                        }
                    });
                }
            }

            // if the rdfaBlock belongs to a documents section, show highlight
            if (rdfaBlock.context && rdfaBlock.context.filter(({predicate, subject, object}) => predicate === 'http://documents').length > 0){
                const location = [rdfaBlock.start, rdfaBlock.end];
                console.log(rdfaBlocks);
                hintsRegistry.addHint(hrId, this.scope, {
                    location,
                    card: this.cardComponentId,
                    info: {
                        hrId, hintsRegistry, editor,
                        location,
                        rdfaBlock,
                        scope: this.scope,
                        isNewList: false
                    }
                });
            }
        }
    }
}
