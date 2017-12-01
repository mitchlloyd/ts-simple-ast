import {ConstructorDeclarationStructure} from "./../../structures";
import {StructureToText} from "./../StructureToText";

export class ConstructorDeclarationStructureToText extends StructureToText<ConstructorDeclarationStructure> {
    getText(structure: ConstructorDeclarationStructure) {
        return `constructor() {${this.getNewlineKind()}}`;
    }
}
