import {PropertyDeclarationStructure} from "./../../structures";
import {StructureToText} from "./../StructureToText";

export class PropertyDeclarationStructureToText extends StructureToText<PropertyDeclarationStructure> {
    getText(structure: PropertyDeclarationStructure) {
        let code = "";
        if (structure.isStatic)
            code += "static ";
        code += structure.name;
        if (structure.hasQuestionToken)
            code += "?";
        if (structure.type != null && structure.type.length > 0)
            code += `: ${structure.type}`;
        code += ";";

        return code;
    }
}
