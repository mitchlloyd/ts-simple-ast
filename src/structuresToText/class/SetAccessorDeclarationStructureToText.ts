import {SetAccessorDeclarationStructure} from "./../../structures";
import {StructureToText} from "./../StructureToText";

export class SetAccessorDeclarationStructureToText extends StructureToText<SetAccessorDeclarationStructure> {
    getText(structure: SetAccessorDeclarationStructure) {
        let code = ``;
        if (structure.isStatic)
            code += "static ";
        code += `set ${structure.name}()`;
        if (structure.returnType != null && structure.returnType.length > 0)
            code += `: ${structure.returnType}`;
        code += " {" + this.getNewlineKind() + "}";
        return code;
    }
}
