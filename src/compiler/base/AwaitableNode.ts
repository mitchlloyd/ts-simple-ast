import { Constructor } from "../../Constructor";
import * as errors from "../../errors";
import { AwaitableNodeStructure } from "../../structures";
import { callBaseFill } from "../callBaseFill";
import { insertIntoParentTextRange, removeChildren, FormattingKind } from "../../manipulation";
import { Node } from "../common";
import { NamedNode } from "../base";
import { ts, SyntaxKind } from "../../typescript";

export type AwaitableNodeExtensionType = Node<ts.Node & { awaitModifier?: ts.AwaitKeywordToken; }>;

export interface AwaitableNode {
    /**
     * If it's an awaited node.
     */
    isAwaited(): boolean;
    /**
     * Gets the await token or undefined if none exists.
     */
    getAwaitKeyword(): Node<ts.AwaitKeywordToken> | undefined;
    /**
     * Gets the await token or throws if none exists.
     */
    getAwaitKeywordOrThrow(): Node<ts.AwaitKeywordToken>;
    /**
     * Sets if the node is awaited.
     * @param value - If it should be awaited or not.
     */
    setIsAwaited(value: boolean): this;
}

export function AwaitableNode<T extends Constructor<AwaitableNodeExtensionType>>(Base: T): Constructor<AwaitableNode> & T {
    return class extends Base implements AwaitableNode {
        isAwaited() {
            return this.compilerNode.awaitModifier != null;
        }

        getAwaitKeyword(): Node<ts.AwaitKeywordToken> | undefined {
            const awaitModifier = this.compilerNode.awaitModifier;
            return this.getNodeFromCompilerNodeIfExists(awaitModifier);
        }

        getAwaitKeywordOrThrow(): Node<ts.AwaitKeywordToken> {
            return errors.throwIfNullOrUndefined(this.getAwaitKeyword(), "Expected to find an await token.");
        }

        setIsAwaited(value: boolean) {
            const awaitModifier = this.getAwaitKeyword();
            const isSet = awaitModifier != null;

            if (isSet === value)
                return this;

            if (awaitModifier == null) {
                insertIntoParentTextRange({
                    insertPos: getAwaitInsertPos(this),
                    parent: this,
                    newText: " await"
                });
            }
            else {
                removeChildren({
                    children: [awaitModifier],
                    removePrecedingSpaces: true
                });
            }

            return this;
        }

        fill(structure: Partial<AwaitableNodeStructure>) {
            callBaseFill(Base.prototype, this, structure);

            if (structure.isAwaited != null)
                this.setIsAwaited(structure.isAwaited);

            return this;
        }
    };
}

function getAwaitInsertPos(node: Node) {
    if (node.getKind() === SyntaxKind.ForOfStatement)
        return node.getFirstChildByKindOrThrow(SyntaxKind.ForKeyword).getEnd();

    throw new errors.NotImplementedError("Expected a for of statement node.");
}
