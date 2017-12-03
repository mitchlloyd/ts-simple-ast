import * as ts from "typescript";
import {expect} from "chai";
import {ObjectLiteralExpression, PropertyAssignment, ShorthandPropertyAssignment} from "./../../../../compiler";
import {PropertyAssignmentStructure, ShorthandPropertyAssignmentStructure, SpreadAssignmentStructure, GetAccessorDeclarationStructure,
    SetAccessorDeclarationStructure, MethodDeclarationStructure} from "./../../../../structures";
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

    /* Property Assignments */

    describe(nameof<ObjectLiteralExpression>(e => e.insertPropertyAssignments), () => {
        function doTest(text: string, index: number, structures: PropertyAssignmentStructure[], expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.insertPropertyAssignments(index, structures);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result.length).to.deep.equal(structures.length);
        }

        it("should insert the property assignments when none exist", () => {
            doTest("const t = {};", 0, [{ name: "prop1", initializer: "4" }, { name: "prop2", initializer: "5" }],
                "const t = {\n    prop1: 4,\n    prop2: 5\n};");
        });

        it("should insert the property assignments when none exist and there is some whitespace in the current object", () => {
            doTest("const t = {\n};", 0, [{ name: "prop", initializer: "5" }],
                "const t = {\n    prop: 5\n};");
        });

        it("should insert the property assignments at the beginning", () => {
            doTest("const t = {\n    prop: 5\n};", 0, [{ name: "prop1", initializer: `"test"` }],
                `const t = {\n    prop1: "test",\n    prop: 5\n};`);
        });

        it("should insert the property assignments in the middle", () => {
            doTest("const t = {\n    prop: 5,\n    prop3\n};", 1, [{ name: "prop2", initializer: "4" }],
                "const t = {\n    prop: 5,\n    prop2: 4,\n    prop3\n};");
        });

        it("should insert the property assignments at the end", () => {
            doTest("const t = {\n    prop: 5\n};", 1, [{ name: "prop1", initializer: "4" }],
                "const t = {\n    prop: 5,\n    prop1: 4\n};");
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.insertPropertyAssignment), () => {
        function doTest(text: string, index: number, structure: PropertyAssignmentStructure, expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.insertPropertyAssignment(index, structure);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result).to.be.instanceOf(PropertyAssignment);
        }

        it("should insert a property assignment", () => {
            doTest("const t = {\n    prop2: 5\n};", 0, { name: "prop1", initializer: "4" },
                "const t = {\n    prop1: 4,\n    prop2: 5\n};");
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.addPropertyAssignments), () => {
        function doTest(text: string, structures: PropertyAssignmentStructure[], expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.addPropertyAssignments(structures);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result.length).to.deep.equal(structures.length);
        }

        it("should add property assignments", () => {
            doTest("const t = {\n    prop1: 5\n};", [{ name: "prop2", initializer: "3" }, { name: "prop3", initializer: "2" }],
                "const t = {\n    prop1: 5,\n    prop2: 3,\n    prop3: 2\n};");
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.addPropertyAssignment), () => {
        function doTest(text: string, structure: PropertyAssignmentStructure, expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.addPropertyAssignment(structure);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result).to.be.instanceOf(PropertyAssignment);
        }

        it("should add a property assignment", () => {
            doTest("const t = {\n    prop1: 5\n};", { name: "prop2", initializer: "2" },
                "const t = {\n    prop1: 5,\n    prop2: 2\n};");
        });
    });

    /* Shorthand Property Assignments */

    describe(nameof<ObjectLiteralExpression>(e => e.insertShorthandPropertyAssignments), () => {
        function doTest(text: string, index: number, structures: ShorthandPropertyAssignmentStructure[], expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.insertShorthandPropertyAssignments(index, structures);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result.length).to.deep.equal(structures.length);
        }

        it("should insert the shorthand property assignments in the middle", () => {
            doTest("const t = {\n    prop: 5,\n    prop4\n};", 1, [{ name: "prop2" }, { name: "prop3" }],
                "const t = {\n    prop: 5,\n    prop2,\n    prop3,\n    prop4\n};");
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.insertShorthandPropertyAssignment), () => {
        function doTest(text: string, index: number, structure: ShorthandPropertyAssignmentStructure, expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.insertShorthandPropertyAssignment(index, structure);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result).to.be.instanceOf(ShorthandPropertyAssignment);
        }

        it("should insert a shorthand property assignment", () => {
            doTest("const t = {\n    prop2: 5\n};", 0, { name: "prop1" },
                "const t = {\n    prop1,\n    prop2: 5\n};");
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.addShorthandPropertyAssignments), () => {
        function doTest(text: string, structures: ShorthandPropertyAssignmentStructure[], expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.addShorthandPropertyAssignments(structures);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result.length).to.deep.equal(structures.length);
        }

        it("should add shorthand property assignments", () => {
            doTest("const t = {\n    prop1: 5\n};", [{ name: "prop2" }, { name: "prop3" }],
                "const t = {\n    prop1: 5,\n    prop2,\n    prop3\n};");
        });
    });

    describe(nameof<ObjectLiteralExpression>(e => e.addShorthandPropertyAssignment), () => {
        function doTest(text: string, structure: ShorthandPropertyAssignmentStructure, expectedText: string) {
            const {sourceFile, objectLiteralExpression} = getObjectLiteralExpression(text);
            const result = objectLiteralExpression.addShorthandPropertyAssignment(structure);
            expect(sourceFile.getFullText()).to.equal(expectedText);
            expect(result).to.be.instanceOf(ShorthandPropertyAssignment);
        }

        it("should add a shorthand property assignment", () => {
            doTest("const t = {\n    prop1: 5\n};", { name: "prop2" },
                "const t = {\n    prop1: 5,\n    prop2\n};");
        });
    });
});
