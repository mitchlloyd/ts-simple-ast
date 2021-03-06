﻿import { expect } from "chai";
import { NamespaceDeclaration, NamespaceChildableNode } from "../../../compiler";
import { getInfoFromText } from "../testHelpers";

describe(nameof(NamespaceChildableNode), () => {
    describe(nameof<NamespaceChildableNode>(d => d.getParentNamespace), () => {
        it("should get the parent namespace when not using dot notation", () => {
            const {firstChild} = getInfoFromText<NamespaceDeclaration>("namespace MyNamespace { class MyClass {} }");
            expect(firstChild.getClasses()[0].getParentNamespace()).to.equal(firstChild);
        });

        it("should get the parent namespace when using dot notation", () => {
            const {firstChild} = getInfoFromText<NamespaceDeclaration>("namespace MyNamespace.MyOtherNamespace { class MyClass {} }");
            expect(firstChild.getClasses()[0].getParentNamespace()).to.equal(firstChild);
        });

        it("should get the parent namespace when using dot notation with the module keyword", () => {
            const {firstChild} = getInfoFromText<NamespaceDeclaration>("module MyNamespace.MyOtherNamespace { class MyClass {} }");
            expect(firstChild.getClasses()[0].getParentNamespace()).to.equal(firstChild);
        });

        it("should get the parent namespace for variable statements", () => {
            const {firstChild} = getInfoFromText<NamespaceDeclaration>("namespace MyNamespace.MyOtherNamespace { const v; }");
            expect(firstChild.getVariableStatements()[0].getParentNamespace()).to.equal(firstChild);
        });

        it("should return undefined when not in a namespace", () => {
            const {firstChild} = getInfoFromText<NamespaceDeclaration>("namespace MyNamespace.MyOtherNamespace { }");
            expect(firstChild.getParentNamespace()).to.equal(undefined);
        });
    });
});
