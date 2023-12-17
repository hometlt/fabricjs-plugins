declare module "fabric" {
    namespace fabric {
        interface IObservable<T> {
            on(events: {
                [key: string]: (e: fabric.IEvent) => void;
            }): void;
        }
        interface Object {
            _cacheContext: CanvasRenderingContext2D;
            _cacheCanvas: HTMLCanvasElement;
            callSuper: any;
        }
        interface Canvas {
            _currentTransform: fabric.Transform;
        }
        interface Transform {
            gestureScale: number;
        }
        interface IUtil {
            fireEvent: (eventName: string, options: any) => void;
            commonEventInfo: (eventData: Event, transform: fabric.Transform, x: number, y: number) => void;
            wrapWithFireEvent: (eventName: string, actionHandler: Function) => (eventData: Event, transform: fabric.Transform, x: number, y: number) => boolean;
            wrapWithFixedAnchor: (actionHandler: Function) => Function;
            getLocalPoint: (transform: fabric.Transform, originX: string, originY: string, x: number, y: number) => Point;
            isTransformCentered: (transform: fabric.Transform) => boolean;
            changeSize: (eventData: Event, transform: fabric.Transform, x: number, y: number) => boolean;
            cos: (value: number) => number;
            sin: (value: number) => number;
        }
        interface IControlsUtils {
            changeSize: (eventData: MouseEvent, transformData: fabric.Transform, x: number, y: number) => boolean;
        }
        const controlsUtils: IControlsUtils;
    }
}
export {};
