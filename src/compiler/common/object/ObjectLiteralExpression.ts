import * as ts from "typescript";
import * as errors from "./../../../errors";
import {Expression} from "./../Expression";
import {Node} from "./../Node";
import {ObjectLiteralElementLike} from "./../../aliases";
import {verifyAndGetIndex, insertIntoCommaSeparatedNodes} from "./../../../manipulation";
import {PropertyAssignmentStructure, ShorthandPropertyAssignmentStructure, SpreadAssignmentStructure} from "./../../../structures";

export class ObjectLiteralExpression extends Expression<ts.ObjectLiteralExpression> {
    /**
     * Gets the properties.
     */
    getProperties(): ObjectLiteralElementLike[] {
        const properties: ts.NodeArray<ts.ObjectLiteralElementLike> = this.compilerNode.properties; // explicit type for validation
        return properties.map(p => this.global.compilerFactory.getNodeFromCompilerNode(p, this.sourceFile)) as ObjectLiteralElementLike[];
    }

    /**
     * Inserts properties at the specified index.
     * @param index - Index to insert.
     * @param structures - Structures that represent the code to insert.
     */
    insertProperties(index: number, structures: (PropertyAssignmentStructure | ShorthandPropertyAssignmentStructure | SpreadAssignmentStructure)[]) {
        index = verifyAndGetIndex(index, this.compilerNode.properties.length);

        insertIntoCommaSeparatedNodes({
            parent: this.getFirstChildByKindOrThrow(ts.SyntaxKind.SyntaxList),
            currentNodes: this.getProperties(),
            insertIndex: index,
            newTexts: structures.map(s => getStructureText(s)),
            useNewlines: true
        });

        return this.getProperties().slice(index, index + structures.length);
    }
}

function getStructureText(structure: PropertyAssignmentStructure | ShorthandPropertyAssignmentStructure | SpreadAssignmentStructure) {
    if ((structure as SpreadAssignmentStructure).expression != null) {
        const spreadStructure = structure as SpreadAssignmentStructure;
        return `...${spreadStructure.expression}`;
    }
    else if ((structure as PropertyAssignmentStructure).initializer != null) {
        const propertyAssignmentStructure = structure as PropertyAssignmentStructure;
        return `${propertyAssignmentStructure.name}: ${propertyAssignmentStructure.initializer}`;
    }
    else {
        const shorthandAssignmentStructure = structure as ShorthandPropertyAssignmentStructure;
        return `${shorthandAssignmentStructure.name}`;
    }
}
