import * as ts from "typescript";
import {expect} from "chai";
import {ObjectLiteralExpression, ShorthandPropertyAssignment} from "./../../../../compiler";
import {PropertyAssignmentStructure, ShorthandPropertyAssignmentStructure, SpreadAssignmentStructure, ObjectLiteralElementLikeStructures} from "./../../../../structures";
import {getInfoFromText} from "./../../testHelpers";

describe(nameof(ObjectLiteralExpression), () => {
    function getObjectLiteralExpression(text: string) {
        const opts = getInfoFromText(text);
        const objectLiteralExpression = opts.sourceFile.getFirstDescendantByKindOrThrow(ts.SyntaxKind.ObjectLiteralExpression) as ObjectLiteralExpression;
        return {
            objectLiteralExpression,
            ...opts
        };
    }

    describe(nameof<ObjectLiteralExpression>(e => e.getProperties), () => {
        function doTest(text: string, props: string[]) {
            const {objectLiteralExpression} = getObjectLiteralExpression(text);
            expect(objectLiteralExpression.getProperties().map(p => p.getText())).to.deep.equal(props);
        }

        it("should get the properties from the object literal expression", () => {
            doTest("const t = { prop: 5, prop2: 8, prop3 };", ["prop: 5", "prop2: 8", "prop3"]);
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.insertProperties), () => {
        function doTest(text: string, index: number, structures: ObjectLiteralElementLikeStructures[], expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.insertProperties(index, structures);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result.length).to.deep.equal(structures.length);
        }

        it("should insert the properties when none exist", () => {
            doTest("const t = {};", 0, [{ name: "prop1" }, { name: "prop2", initializer: "5" }, { expression: "expr" }],
                "const t = {\n    prop1,\n    prop2: 5,\n    ...expr\n};");
        });

        it("should insert the properties when none exist and there is some whitespace in the current object", () => {
            doTest("const t = {\n};", 0, [{ name: "prop" }],
                "const t = {\n    prop\n};");
        });

        it("should insert the properties at the beginning", () => {
            doTest("const t = {\n    prop: 5\n};", 0, [{ name: "prop1" }],
                "const t = {\n    prop1,\n    prop: 5\n};");
        });

        it("should insert the properties in the middle", () => {
            doTest("const t = {\n    prop: 5,\n    prop3\n};", 1, [{ name: "prop2" }],
                "const t = {\n    prop: 5,\n    prop2,\n    prop3\n};");
        });

        it("should insert the properties at the end", () => {
            doTest("const t = {\n    prop: 5\n};", 1, [{ name: "prop1" }],
                "const t = {\n    prop: 5,\n    prop1\n};");
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.insertProperty), () => {
        function doTest(text: string, index: number, structure: ObjectLiteralElementLikeStructures, expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.insertProperty(index, structure);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result).to.be.instanceOf(ShorthandPropertyAssignment);
        }

        it("should insert a property", () => {
            doTest("const t = {\n    prop2: 5\n};", 0, { name: "prop1" },
                "const t = {\n    prop1,\n    prop2: 5\n};");
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.addProperties), () => {
        function doTest(text: string, structures: ObjectLiteralElementLikeStructures[], expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.addProperties(structures);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result.length).to.deep.equal(structures.length);
        }

        it("should add properties", () => {
            doTest("const t = {\n    prop1: 5\n};", [{ name: "prop2" }, { name: "prop3" }],
                "const t = {\n    prop1: 5,\n    prop2,\n    prop3\n};");
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.addProperty), () => {
        function doTest(text: string, structure: ObjectLiteralElementLikeStructures, expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.addProperty(structure);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result).to.be.instanceOf(ShorthandPropertyAssignment);
        }

        it("should add a property", () => {
            doTest("const t = {\n    prop1: 5\n};", { name: "prop2" },
                "const t = {\n    prop1: 5,\n    prop2\n};");
        });
    });
});
