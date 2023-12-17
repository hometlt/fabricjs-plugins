/**
 * Mixin for tracking object states and enabling Undo/Redo operations.
 */
export declare const UndoMixin: {
    addUndoState(): void;
    initUndo(): void;
    undo(): void;
    disableHistory(): void;
    enableHistory(): void;
    redo(): void;
    undoable(): boolean;
    redoable(): boolean;
};
declare module "fabric" {
    namespace fabric {
        interface Object {
            disableHistory(): void;
            enableHistory(): void;
            addUndoState(): void;
            initUndo(): void;
            undo(): void;
            redo(): void;
            undoable(): boolean;
            redoable(): boolean;
        }
    }
}
