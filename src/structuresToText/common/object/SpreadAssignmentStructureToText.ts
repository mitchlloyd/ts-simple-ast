import {SpreadAssignmentStructure} from "./../../../structures";
import {StructureToText} from "./../../StructureToText";

export class SpreadAssignmentStructureToText extends StructureToText<SpreadAssignmentStructure> {
    getText(structure: SpreadAssignmentStructure) {
        return `...${structure.expression}`;
    }
}
