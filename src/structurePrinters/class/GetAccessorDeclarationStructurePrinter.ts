﻿import CodeBlockWriter from "code-block-writer";
import { GetAccessorDeclarationStructure } from "../../structures";
import { StringUtils } from "../../utils";
import { StructurePrinterFactory } from "../../factories";
import { FactoryStructurePrinter } from "../FactoryStructurePrinter";
import { BlankLineFormattingStructuresPrinter } from "../formatting";

export class GetAccessorDeclarationStructurePrinter extends FactoryStructurePrinter<GetAccessorDeclarationStructure> {
    private readonly blankLineWriter = new BlankLineFormattingStructuresPrinter(this);

    constructor(factory: StructurePrinterFactory, private readonly options: { isAmbient: boolean; }) {
        super(factory);
    }

    printTexts(writer: CodeBlockWriter, structures: GetAccessorDeclarationStructure[] | undefined) {
        this.blankLineWriter.printText(writer, structures);
    }

    printText(writer: CodeBlockWriter, structure: GetAccessorDeclarationStructure) {
        this.factory.forJSDoc().printDocs(writer, structure.docs);
        this.factory.forDecorator().printTexts(writer, structure.decorators);
        this.factory.forModifierableNode().printText(writer, structure);
        writer.write(`get ${structure.name}`);
        this.factory.forTypeParameterDeclaration().printTextsWithBrackets(writer, structure.typeParameters);
        writer.write("(");
        this.factory.forParameterDeclaration().printTexts(writer, structure.parameters);
        writer.write(")");
        writer.conditionalWrite(!StringUtils.isNullOrWhitespace(structure.returnType), `: ${structure.returnType}`);
        writer.spaceIfLastNot().inlineBlock(() => {
            this.factory.forBodyText(this.options).printText(writer, structure);
        });
    }
}
