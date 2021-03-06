import CodeBlockWriter from "code-block-writer";
import { EnumMemberStructure } from "../../structures";
import { FactoryStructurePrinter } from "../FactoryStructurePrinter";
import { JSDocStructurePrinter } from "../doc";
import { CommaNewLineSeparatedStructuresPrinter } from "../formatting";

export class EnumMemberStructurePrinter extends FactoryStructurePrinter<EnumMemberStructure> {
    private readonly multipleWriter = new CommaNewLineSeparatedStructuresPrinter(this);

    printTexts(writer: CodeBlockWriter, structures: EnumMemberStructure[] | undefined) {
        this.multipleWriter.printText(writer, structures);
    }

    printText(writer: CodeBlockWriter, structure: EnumMemberStructure) {
        this.factory.forJSDoc().printDocs(writer, structure.docs);
        writer.write(structure.name);
        if (typeof structure.value === "string")
            writer.write(` = `).quote(structure.value);
        else if (typeof structure.value === "number")
            writer.write(` = ${structure.value}`);
        else if (structure.initializer != null)
            writer.write(` = ${structure.initializer}`);
    }
}
