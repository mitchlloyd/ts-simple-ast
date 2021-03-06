﻿import CodeBlockWriter from "code-block-writer";
import { StructurePrinter } from "../StructurePrinter";

export type StringStructureToTextItem = string | ((writer: CodeBlockWriter) => void);

export class StringStructurePrinter extends StructurePrinter<StringStructureToTextItem> {
    constructor() {
        super();
    }

    printText(writer: CodeBlockWriter, textOrWriterFunc: StringStructureToTextItem) {
        if (typeof textOrWriterFunc === "string")
            writer.write(textOrWriterFunc);
        else
            textOrWriterFunc(writer);
    }
}
