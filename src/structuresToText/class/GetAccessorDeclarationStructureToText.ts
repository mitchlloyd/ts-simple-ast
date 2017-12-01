import {GetAccessorDeclarationStructure} from "./../../structures";
import {StructureToText} from "./../StructureToText";

export class GetAccessorDeclarationStructureToText extends StructureToText<GetAccessorDeclarationStructure> {
    getText(structure: GetAccessorDeclarationStructure) {
        let code = "";
        if (structure.isStatic)
            code += "static ";
        code += `get ${structure.name}()`;
        if (structure.returnType != null && structure.returnType.length > 0)
            code += `: ${structure.returnType}`;
        code += " {" + this.getNewlineKind() + "}";
        return code;
    }
}
