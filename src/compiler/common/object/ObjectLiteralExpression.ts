import * as ts from "typescript";
import * as errors from "./../../../errors";
import {Expression} from "./../Expression";
import {Node} from "./../Node";
import {ObjectLiteralElementLike} from "./../../aliases";
import {verifyAndGetIndex, insertIntoCommaSeparatedNodes} from "./../../../manipulation";
import {ObjectLiteralElementLikeStructureToText} from "./../../../structuresToText";
import {PropertyAssignmentStructure, ShorthandPropertyAssignmentStructure, SpreadAssignmentStructure, ObjectLiteralElementLikeStructures} from "./../../../structures";

export class ObjectLiteralExpression extends Expression<ts.ObjectLiteralExpression> {
    /**
     * Gets the properties.
     */
    getProperties(): ObjectLiteralElementLike[] {
        const properties: ts.NodeArray<ts.ObjectLiteralElementLike> = this.compilerNode.properties; // explicit type for validation
        return properties.map(p => this.global.compilerFactory.getNodeFromCompilerNode(p, this.sourceFile)) as ObjectLiteralElementLike[];
    }

    /**
     * Adds a property.
     * @param structure - Structure that represents the property to add.
     */
    addProperty(structure: ObjectLiteralElementLikeStructures) {
        return this.addProperties([structure])[0];
    }

    /**
     * Adds properties.
     * @param structures - Structure that represents the properties to add.
     */
    addProperties(structures: ObjectLiteralElementLikeStructures[]) {
        return this.insertProperties(this.compilerNode.properties.length, structures);
    }

    /**
     * Inserts a property at the specified index.
     * @param index - Index to insert.
     * @param structure - Structure that represents the property to insert.
     */
    insertProperty(index: number, structure: ObjectLiteralElementLikeStructures) {
        return this.insertProperties(index, [structure])[0];
    }

    /**
     * Inserts properties at the specified index.
     * @param index - Index to insert.
     * @param structures - Structures that represent the properties to insert.
     */
    insertProperties(index: number, structures: ObjectLiteralElementLikeStructures[]) {
        index = verifyAndGetIndex(index, this.compilerNode.properties.length);
        const newTexts = structures.map(s => {
            // todo: pass in the StructureToText to the function below
            const writer = this.getWriter();
            const structureToText = new ObjectLiteralElementLikeStructureToText(writer);
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
