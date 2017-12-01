import {PropertyAssignmentStructure} from "./../../../structures";
import {StructureToText} from "./../../StructureToText";

export class PropertyAssignmentStructureToText extends StructureToText<PropertyAssignmentStructure> {
    getText(structure: PropertyAssignmentStructure) {
        return `${structure.name}: ${structure.initializer}`;
    }
}
