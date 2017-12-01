import {ShorthandPropertyAssignmentStructure} from "./../../../structures";
import {StructureToText} from "./../../StructureToText";

export class ShorthandPropertyAssignmentStructureToText extends StructureToText<ShorthandPropertyAssignmentStructure> {
    getText(structure: ShorthandPropertyAssignmentStructure) {
        return `${structure.name}`;
    }
}
