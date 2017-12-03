import * as ts from "typescript";
import CodeBlockWriter from "code-block-writer";
import * as errors from "./../../../errors";
import {Expression} from "./../Expression";
import {Node} from "./../Node";
import {ObjectLiteralElementLike} from "./../../aliases";
import {verifyAndGetIndex, insertIntoCommaSeparatedNodes} from "./../../../manipulation";
import {StructureToText, PropertyAssignmentStructureToText, ShorthandPropertyAssignmentStructureToText, SpreadAssignmentStructureToText,
    GetAccessorDeclarationStructureToText, SetAccessorDeclarationStructureToText, MethodDeclarationStructureToText} from "./../../../structuresToText";
import {PropertyAssignmentStructure, ShorthandPropertyAssignmentStructure, SpreadAssignmentStructure, ObjectLiteralElementLikeStructures} from "./../../../structures";

export class ObjectLiteralExpression extends Expression<ts.ObjectLiteralExpression> {
    /**
     * Gets the properties.
     */
    getProperties(): ObjectLiteralElementLike[] {
        const properties: ts.NodeArray<ts.ObjectLiteralElementLike> = this.compilerNode.properties; // explicit type for validation
        return properties.map(p => this.global.compilerFactory.getNodeFromCompilerNode(p, this.sourceFile)) as ObjectLiteralElementLike[];
    }

    /* Property Assignments */

    /**
     * Adds a property assignment.
     * @param structure - Structure that represents the property assignment to add.
     */
    addPropertyAssignment(structure: PropertyAssignmentStructure) {
        return this.addPropertyAssignments([structure])[0];
    }

    /**
     * Adds property assignments.
     * @param structures - Structure that represents the property assignments to add.
     */
    addPropertyAssignments(structures: PropertyAssignmentStructure[]) {
        return this.insertPropertyAssignments(this.compilerNode.properties.length, structures);
    }

    /**
     * Inserts a property assignment at the specified index.
     * @param index - Index to insert.
     * @param structure - Structure that represents the property assignment to insert.
     */
    insertPropertyAssignment(index: number, structure: PropertyAssignmentStructure) {
        return this.insertPropertyAssignments(index, [structure])[0];
    }

    /**
     * Inserts property assignments at the specified index.
     * @param index - Index to insert.
     * @param structures - Structures that represent the property assignments to insert.
     */
    insertPropertyAssignments(index: number, structures: PropertyAssignmentStructure[]) {
        return this._insertProperty(index, structures, writer => new PropertyAssignmentStructureToText(writer));
    }

    /* Shorthand Property Assignments */

    /**
     * Adds a shorthand property assignment.
     * @param structure - Structure that represents the property assignment to add.
     */
    addShorthandPropertyAssignment(structure: ShorthandPropertyAssignmentStructure) {
        return this.addShorthandPropertyAssignments([structure])[0];
    }

    /**
     * Adds shorthand property assignments.
     * @param structures - Structure that represents the shorthand property assignments to add.
     */
    addShorthandPropertyAssignments(structures: ShorthandPropertyAssignmentStructure[]) {
        return this.insertShorthandPropertyAssignments(this.compilerNode.properties.length, structures);
    }

    /**
     * Inserts a shorthand property assignment at the specified index.
     * @param index - Index to insert.
     * @param structure - Structure that represents the shorthand property assignment to insert.
     */
    insertShorthandPropertyAssignment(index: number, structure: ShorthandPropertyAssignmentStructure) {
        return this.insertShorthandPropertyAssignments(index, [structure])[0];
    }

    /**
     * Inserts shorthand property assignments at the specified index.
     * @param index - Index to insert.
     * @param structures - Structures that represent the shorthand property assignments to insert.
     */
    insertShorthandPropertyAssignments(index: number, structures: ShorthandPropertyAssignmentStructure[]) {
        return this._insertProperty(index, structures, writer => new ShorthandPropertyAssignmentStructureToText(writer));
    }

    /**
     * @internal
     */
    private _insertProperty<T>(index: number, structures: T[], createStructureToText: (writer: CodeBlockWriter) => StructureToText<T>) {
        index = verifyAndGetIndex(index, this.compilerNode.properties.length);
        const newTexts = structures.map(s => {
            // todo: pass in the StructureToText to the function below
            const writer = this.getWriter();
            const structureToText = createStructureToText(writer);
            structureToText.writeText(s);
            return writer.toString();
        });

        insertIntoCommaSeparatedNodes({
            parent: this.getFirstChildByKindOrThrow(ts.SyntaxKind.SyntaxList),
            currentNodes: this.getProperties(),
            insertIndex: index,
            newTexts,
            useNewlines: true
        });

        return this.getProperties().slice(index, index + structures.length);
    }
}
