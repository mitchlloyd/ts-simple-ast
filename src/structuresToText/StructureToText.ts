import {ManipulationSettingsContainer} from "./../ManipulationSettings";

export abstract class StructureToText<TStructure> {
    constructor(private readonly manipulationSettings: ManipulationSettingsContainer) {
    }

    abstract getText(structure: TStructure): string;

    /**
     * Helper method for getting the texts from an array of structures.
     * @param structures - Structures.
     */
    getTexts(structures: TStructure[]) {
        return structures.map(s => this.getText(s));
    }

    /**
     * Helper method for getting the text from a structure with indentation.
     * @param structure - Structure.
     * @param indentationText - Indentation text.
     */
    getTextWithIndentationText(structure: TStructure, indentationText: string) {
        // todo: remove this method... the caller should handle this
        const text = this.getText(structure);
        return indentationText + text.split(this.getNewlineKind()).join(this.getNewlineKind() + indentationText);
    }

    /**
     * Helper method for getting the texts from structures with indentation.
     * @param indentationText - Indentation text.
     */
    getTextsWithIndentationText(structures: TStructure[], indentationText: string) {
        return structures.map(s => this.getTextWithIndentationText(s, indentationText));
    }

    protected getNewlineKind() {
        return this.manipulationSettings.getNewLineKind() as string;
    }

    protected getIndentationText() {
        return this.manipulationSettings.getIndentationText() as string;
    }
}
