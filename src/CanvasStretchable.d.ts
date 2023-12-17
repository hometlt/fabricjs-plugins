export declare function getProportions(photo: any, container: any): {
    scale: number;
    width: number;
    height: number;
};
/**
 * Augment declarations to add custom methods to fabric.Canvas interface
 */
declare module "fabric" {
    namespace fabric {
        interface Canvas {
            originalHeight: number;
            originalWidth: number;
            setOriginalSize(w: number | HTMLImageElement, h?: number): void;
            centerAndZoomOut(): void;
            zoomIn(): void;
            zoomOut(): void;
            setStretchable(val: boolean): void;
            setMouseWheelZoom(val: boolean): void;
        }
    }
}
