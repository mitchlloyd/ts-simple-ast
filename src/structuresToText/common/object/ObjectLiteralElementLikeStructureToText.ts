import CodeBlockWriter from "code-block-writer";
import {ObjectLiteralElementLikeStructures, SpreadAssignmentStructure, PropertyAssignmentStructure, ShorthandPropertyAssignmentStructure} from "./../../../structures";
import * as errors from "./../../../errors";
import {StructureToText} from "./../../StructureToText";
import {GetAccessorDeclarationStructureToText} from "./../../class/GetAccessorDeclarationStructureToText";
import {SetAccessorDeclarationStructureToText} from "./../../class/SetAccessorDeclarationStructureToText";
import {MethodDeclarationStructureToText} from "./../../class/MethodDeclarationStructureToText";
import {SpreadAssignmentStructureToText} from "./SpreadAssignmentStructureToText";
import {PropertyAssignmentStructureToText} from "./PropertyAssignmentStructureToText";
import {ShorthandPropertyAssignmentStructureToText} from "./ShorthandPropertyAssignmentStructureToText";

export class ObjectLiteralElementLikeStructureToText extends StructureToText<ObjectLiteralElementLikeStructures> {
    private readonly spreadAssignmentStructureToText: SpreadAssignmentStructureToText;
    private readonly propertyAssignmentStructureToText: PropertyAssignmentStructureToText;
    private readonly shorthandPropertyAssignmentStructureToText: ShorthandPropertyAssignmentStructureToText;
    private readonly getAccessorDeclarationStructureToText: GetAccessorDeclarationStructureToText;
    private readonly setAccessorDeclarationStructureToText: SetAccessorDeclarationStructureToText;
    private readonly methodDeclarationStructureToText: MethodDeclarationStructureToText;

    constructor(writer: CodeBlockWriter) {
        super(writer);
        this.spreadAssignmentStructureToText = new SpreadAssignmentStructureToText(writer);
        this.propertyAssignmentStructureToText = new PropertyAssignmentStructureToText(writer);
        this.shorthandPropertyAssignmentStructureToText = new ShorthandPropertyAssignmentStructureToText(writer);
        this.getAccessorDeclarationStructureToText = new GetAccessorDeclarationStructureToText(writer);
        this.setAccessorDeclarationStructureToText = new GetAccessorDeclarationStructureToText(writer);
        this.methodDeclarationStructureToText = new MethodDeclarationStructureToText(writer, {
            isAmbient: false // it's not ambient in this context
        });
    }

    writeText(structure: ObjectLiteralElementLikeStructures) {
        if (isSpreadAssignmentStructure(structure))
            this.spreadAssignmentStructureToText.writeText(structure);
        else if (isPropertyAssignmentStructure(structure))
            this.propertyAssignmentStructureToText.writeText(structure);
        else if (isShorthandPropertyAssignmentStructure(structure))
            this.shorthandPropertyAssignmentStructureToText.writeText(structure);
        else
            throw errors.getNotImplementedForNeverValueError(structure);
    }
}

function isSpreadAssignmentStructure(structure: ObjectLiteralElementLikeStructures): structure is SpreadAssignmentStructure {
    return (structure as SpreadAssignmentStructure).expression != null;
}

function isPropertyAssignmentStructure(structure: ObjectLiteralElementLikeStructures): structure is PropertyAssignmentStructure {
    return (structure as PropertyAssignmentStructure).initializer != null;
}

function isShorthandPropertyAssignmentStructure(structure: ObjectLiteralElementLikeStructures): structure is ShorthandPropertyAssignmentStructure {
    return (structure as ShorthandPropertyAssignmentStructure).name != null;
}
