import * as ts from "typescript";
import {expect} from "chai";
import {ObjectLiteralExpression} from "./../../../../compiler";
import {PropertyAssignmentStructure, ShorthandPropertyAssignmentStructure, SpreadAssignmentStructure} from "./../../../../structures";
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
        type StructureTypes = PropertyAssignmentStructure | ShorthandPropertyAssignmentStructure | SpreadAssignmentStructure;
        function doTest(text: string, index: number, structures: StructureTypes[], expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            objectLiteralExpression.insertProperties(index, structures);
            expect(sourceFile.getFullText()).to.equal(expectedText);
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
});
