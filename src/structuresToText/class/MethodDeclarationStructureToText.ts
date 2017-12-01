import {ManipulationSettingsContainer} from "./../../ManipulationSettings";
import {MethodDeclarationStructure} from "./../../structures";
import {StructureToText} from "./../StructureToText";

export class MethodDeclarationStructureToText extends StructureToText<MethodDeclarationStructure> {
    constructor(manipulationSettings: ManipulationSettingsContainer, private readonly opts: { isAmbient: boolean; }) {
        super(manipulationSettings);
    }

    getText(structure: MethodDeclarationStructure) {
        let code = "";
        if (structure.isStatic)
            code += "static ";
        code += `${structure.name}()`;
        if (structure.returnType != null && structure.returnType.length > 0)
            code += `: ${structure.returnType}`;

        if (this.opts.isAmbient)
            code += ";";
        else
            code += ` {` + this.getNewlineKind() + `}`;

        return code;
    }
}
