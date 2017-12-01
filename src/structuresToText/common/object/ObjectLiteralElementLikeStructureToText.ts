import {ObjectLiteralElementLikeStructures, SpreadAssignmentStructure, PropertyAssignmentStructure, ShorthandPropertyAssignmentStructure} from "./../../../structures";
import * as errors from "./../../../errors";
import {ManipulationSettingsContainer} from "./../../../ManipulationSettings";
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

    constructor(manipulationSettings: ManipulationSettingsContainer) {
        super(manipulationSettings);
        this.spreadAssignmentStructureToText = new SpreadAssignmentStructureToText(manipulationSettings);
        this.propertyAssignmentStructureToText = new PropertyAssignmentStructureToText(manipulationSettings);
        this.shorthandPropertyAssignmentStructureToText = new ShorthandPropertyAssignmentStructureToText(manipulationSettings);
        this.getAccessorDeclarationStructureToText = new GetAccessorDeclarationStructureToText(manipulationSettings);
        this.setAccessorDeclarationStructureToText = new GetAccessorDeclarationStructureToText(manipulationSettings);
        this.methodDeclarationStructureToText = new MethodDeclarationStructureToText(manipulationSettings, {
            isAmbient: false // it's not ambient in this context
        });
    }

    getText(structure: ObjectLiteralElementLikeStructures) {
        if (isSpreadAssignmentStructure(structure))
            return this.spreadAssignmentStructureToText.getText(structure);
        else if (isPropertyAssignmentStructure(structure))
            return this.propertyAssignmentStructureToText.getText(structure);
        else if (isShorthandPropertyAssignmentStructure(structure))
            return this.shorthandPropertyAssignmentStructureToText.getText(structure);
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
