﻿import * as ts from "typescript";
import * as errors from "./../../errors";
import {Node} from "./../common";

export type ModiferableNodeExtensionType = Node<ts.Node>;
export type ModifierTexts = "export" | "default" | "declare" | "abstract";

export interface ModifierableNode {
    getModifiers(): Node<ts.Node>[];
    getCombinedModifierFlags(): ts.ModifierFlags;
    getFirstModifierByKind(kind: ts.SyntaxKind): Node<ts.Node> | undefined;
    addModifier(text: ModifierTexts): Node<ts.Modifier>;
}

export function ModifierableNode<T extends Constructor<ModiferableNodeExtensionType>>(Base: T): Constructor<ModifierableNode> & T {
    return class extends Base implements ModifierableNode {
        /**
         * Gets the node's modifiers.
         */
        getModifiers() {
            return this.node.modifiers == null ? [] : this.node.modifiers.map(m => this.factory.getNodeFromCompilerNode(m));
        }

        /**
         * Gets the combined modifier flags.
         */
        getCombinedModifierFlags() {
            return ts.getCombinedModifierFlags(this.node);
        }

        /**
         * Gets the first modifier of the specified syntax kind or undefined if none found.
         * @param kind - Syntax kind.
         */
        getFirstModifierByKind(kind: ts.SyntaxKind) {
            for (let modifier of this.getModifiers()) {
                if (modifier.getKind() === kind)
                    return modifier;
            }

            return undefined;
        }

        /**
         * Add a modifier with the specified text.
         * @param text - Modifier text to add.
         * @returns The added modifier.
         * @internal
         */
        addModifier(text: ModifierTexts): Node<ts.Modifier> {
            const modifiers = (this.node.modifiers || []) as ts.NodeArray<ts.Modifier>;
            const hasModifier = modifiers.some(m => m.getText() === text);
            if (hasModifier)
                return this.getModifiers().filter(m => m.getText() === text)[0] as Node<ts.Modifier>;

            // get insert position
            let insertPos = this.node.pos;
            getAddAfterModifierTexts(text).forEach(addAfterText => {
                for (let modifier of modifiers) {
                    if (modifier.getText() === addAfterText) {
                        if (insertPos < modifier.end)
                            insertPos = modifier.end;
                        break;
                    }
                }
            });

            // insert setup
            let startPos: number;
            let insertText: string;
            const isFirstModifier = insertPos === this.node.pos;
            if (isFirstModifier) {
                insertText = text + " ";
                startPos = insertPos;
            }
            else {
                insertText = " " + text;
                startPos = insertPos + 1;
            }

            // insert
            const sourceFile = this.getRequiredSourceFile();
            sourceFile.insertText(insertPos, insertText);

            return this.getModifiers().filter(m => m.getStart() === startPos)[0] as Node<ts.Modifier>;
        }
    };
}

function getAddAfterModifierTexts(text: string): string[] {
    switch (text) {
        case "export":
            return [];
        case "default":
            return ["export"];
        case "declare":
            return ["export", "default"];
        case "abstract":
            return ["export", "default", "declare"];
        default:
            throw new errors.NotImplementedError(`Not implemented modifier: ${text}`);
    }
}