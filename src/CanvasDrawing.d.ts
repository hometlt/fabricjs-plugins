/**
 * Augment declarations to add custom methods to fabric.Canvas interface
 */
declare module "fabric" {
    namespace fabric {
        interface Canvas {
            drawingClass: (options: any) => fabric.Object;
            disableDrawing(): void;
            isDrawing(): boolean;
            _tableDrawingMouseDown(o: fabric.IEvent): void;
            _tableDrawingMouseMove(o: fabric.IEvent): void;
            _tableDrawingMouseUp(): void;
            enableDrawing(klass: (new (options: any) => fabric.Object)): void;
        }
    }
}
export {};
