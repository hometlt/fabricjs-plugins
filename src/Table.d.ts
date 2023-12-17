/**
 * This code appears to be a TypeScript class definition for a table object using FabricJS, a powerful and extensible JavaScript library for working with the HTML5 canvas. This class extends the fabric.Group class, which is a part of the FabricJS library. The table object is designed to have rows, columns, and cells that can be interactively manipulated within an HTML canvas.
 *
 * Here's a brief overview of the key features and functionalities provided by this class:
 *
 * Properties and Styling:
 *
 * The table has various customizable properties such as stroke color, stroke width, fill color, font size, and more.
 * It has options for specifying the appearance of header cells, active cells, and hover effects.
 * Rows, Columns, and Cells:
 *
 * Rows and columns can be added or removed dynamically.
 * The cells within the table can be customized, and their content can be modified.
 * Selection and Interaction:
 *
 * The class supports selecting cells, rows, and columns.
 * It allows for deleting selected rows and columns.
 * Selection can be merged or unmerged, and the selection bounds can be obtained.
 * The class provides methods for inserting new rows and columns.
 * Cell Text and Styling:
 *
 * Text properties such as font color and cell padding can be customized.
 * Events:
 *
 * The class triggers events for actions like modifying, resizing, and selecting.
 * Rendering:
 *
 * The render method is overridden to provide custom rendering, including visual cues for active selection and hover effects.
 * Additional Functionality:
 *
 * The class includes functionality for handling resizing of rows and columns.
 * It provides methods for checking if certain operations (e.g., merging, unmerging) are available based on the current selection.
 * Undo Mechanism:
 *
 * There is an initialization of an undo mechanism for reverting changes.
 */
import { fabric } from "fabric";
import "./Transformations";
/**
 * FabricJS Table Object
 */
declare class FabricTable extends fabric.Group {
    /**
     * default FabricJS properties
     */
    type: string;
    /**
     * Selected Cells Properties
     */
    fillActive: string;
    /**
     * Cell Highlighting On Hover. null to disable
     */
    fillHover: string;
    /**
     * Text Properties
     */
    fillText: string;
    /**
     * Header Cells Properties
     */
    fillHeader: string;
    /**
     * Rows And Columns Properties
     */
    cellPadding: number;
    fontSize: number;
    minRowHeight: number;
    minColumnWidth: number;
    /**
     * Rows/Columns Resizing Area
     */
    resizerSize: number;
    /**
     * columns data
     */
    columns: fabric.TableColumnOptions[];
    /**
     * rows data
     */
    rows: fabric.TableRowOptions[];
    /**
     * cells data
     */
    cells: fabric.TableCellOptions[][];
    /**
     * array of selected cells
     */
    selection: fabric.TableCell[];
    stateProperties: string[];
    cacheProperties: string[];
    propertyApplyOrder: string[];
    /**
     * private properties
     */
    private _cellsmodified;
    private _rowsmodified;
    private _columnsmodified;
    private _modifiedRow;
    private _modifiedColumn;
    private _scalingMinX;
    private _scalingMinY;
    private _cols;
    private _rows;
    private _cells;
    private _selectionBegin;
    private _hoverCell;
    private _selectionLast;
    private _currentSelectionBounds;
    private _currentSelectionCells;
    private _cellsMap;
    private _textMap;
    private _rowInitialHeight;
    private _columnInitialWidth;
    constructor(o: Partial<fabric.TableOptions>);
    onSet(options: {
        [key: string]: any;
    }): void;
    private _cleanCache;
    enableHover(): void;
    enableSelection(): void;
    setColumns(value: fabric.TableColumnOptions[]): void;
    getColumns(): fabric.TableColumnOptions[];
    setHeaderColumn(i: number, header?: boolean): void;
    setHeaderRow(i: number, header?: boolean): void;
    setRows(value: fabric.TableRowOptions[]): void;
    setCellText(col: number, row: number, text: string): void;
    getRows(): fabric.TableRowOptions[];
    deleteSelectedRows(): void;
    deleteRow(position: number): void;
    mergeSelection(): void;
    unmergeSelection(): void;
    getSelectionBounds(): fabric.TableSelectionBounds;
    isHeaderCell(cell: fabric.TableCell): boolean;
    hoverCell(cell: fabric.TableCell): void;
    setSelection(newSelection?: fabric.TableCell[]): void;
    clearSelection(): void;
    selectCell({ x, y }: {
        x: number;
        y: number;
    }): void;
    deleteSelectedColumns(): void;
    deleteColumn(position: number): void;
    selectRange(rangeBegin: {
        x: number;
        y: number;
    }, rangeEnd: {
        x: number;
        y: number;
    }): void;
    setCells(cells: fabric.TableCellOptions[][]): void;
    insertColumn(position?: number, width?: number): void;
    insertRow(position?: number, height?: number): void;
    getCells(options?: fabric.TableCellDataOptions): fabric.TableCellOutput[][];
    toObject(propertiesToInclude?: string[]): fabric.IObjectOptions;
    toDatalessObject(propertiesToInclude: string[]): any;
    render(ctx: CanvasRenderingContext2D): void;
    isSelectionMergeble(): boolean;
    isSelectionUnmergeble(): boolean;
    isInsertColumnAvailableForSelection(): boolean;
    isInsertRowAvailableForSelection(): boolean;
    isRemoveColumnAvailableForSelection(): boolean;
    isRemoveRowAvailableForSelection(): boolean;
    private _unhoverCell;
    private __setcolumns;
    private __setrows;
    private __setcells;
    private __setheight;
    private __setwidth;
    private _renderGrabControl;
    private _renderIconControl;
    private _renderInvisible;
    private _getControls;
    private _unlockMovement;
    private _lockMovement;
    private __unhoverCell;
    private _getCellFill;
    private selectionBegin;
    private _selectionProcess;
    private selectionFinish;
    private _refillCells;
    private _addCellToSelection;
    private _addRowToSelection;
    private _addColumnToSelection;
    setCoords(skipCorners: boolean): this;
    private _updateRowsAndColumnsControls;
    private _getCellData;
    private _setCellText;
    private _createCell;
    private rowResizingBegin;
    private _getCurrentRow;
    private _getCurrentColumn;
    private columnResizingBegin;
    private rowResizing;
    private columnResizing;
    private columnResizingFinish;
    private rowResizingFinish;
    private _updateLines;
    private _updateCellsGeometry;
    private _updateTableWidth;
    private _updateTableHeight;
    private _updateColumns;
    private _updateRows;
    private _deleteColumn;
    private _deleteRow;
    private _deleteCell;
    private _deleteCells;
    defaultProperties: fabric.TableOptions;
}
declare module "fabric" {
    namespace fabric {
        /**
         * Table Column Initialization Options
         */
        interface TableColumnOptions {
            /**
             * width in px
             */
            width?: number;
            /**
             * is header column
             */
            header?: boolean;
        }
        /**
         * Data Related to Table Column
         */
        interface TableColumn extends TableColumnOptions {
            /**
             * column index
             */
            index: number;
            /**
             * offset related to left side of the table in px
             */
            left?: number;
        }
        /**
         * Table Row Initialization Options
         */
        interface TableRowOptions {
            /**
             * height in px
             */
            height?: number;
            /**
             * is header row
             */
            header?: boolean;
        }
        /**
         * Data Related to Table Row
         */
        interface TableRow extends TableRowOptions {
            /**
             * row index
             */
            index: number;
            /**
             * offset related to top side of the table in px
             */
            top?: number;
        }
        /**
         * Table Cell Initialization Options
         */
        interface TableCellOptions {
            /**
             * colspan
             */
            colspan?: number;
            /**
             * rowspan
             */
            rowspan?: number;
            /**
             * cell text data
             */
            text?: string;
        }
        /**
         * Data Related to Table Cell
         */
        interface TableCell extends TableCellOptions {
            /**
             * row data element
             */
            r: TableRow;
            /**
             * column data element
             */
            c: TableColumn;
            /**
             * column width in px
             */
            width?: number;
            /**
             * column height in px
             */
            height?: number;
            /**
             * associated rectangle object in the group
             */
            o?: Rect;
            /**
             * associated text object in the group
             */
            t?: Text;
        }
        /**
         * Table Cells Selection Bounds
         */
        interface TableSelectionBounds {
            /**
             * first selected column
             */
            x: number;
            /**
             * first selected row
             */
            y: number;
            /**
             * eelection width
             */
            w: number;
            /**
             * eelection height
             */
            h: number;
            /**
             * last selected column
             */
            x2: number;
            /**
             * last selected row
             */
            y2: number;
        }
        /**
         * Data Related to Table Cell
         */
        interface TableCellOutput extends TableCellOptions {
            /**
             * column index
             */
            x?: number;
            /**
             * row index
             */
            y?: number;
            /**
             * cell height in px
             */
            height?: number;
            /**
             * cell width in px
             */
            width?: number;
            /**
             * offset related to top side of the table in px
             */
            top?: number;
            /**
             * offset related to left side of the table in px
             */
            left?: number;
            /**
             * coordinates array related to left top corner of the table in px
             */
            coords?: [IPoint, IPoint, IPoint, IPoint];
        }
        /**
         * Additional Table Intilization properties
         */
        interface TableOptions extends IGroupOptions {
            controls?: any;
            columns?: TableColumnOptions[];
            rows?: TableRowOptions[];
            cells?: TableCellOptions[][];
            fillText?: string | null;
            fillHover?: string | null;
            cellPadding?: number;
            fontSize?: number;
            fillActive?: string | null;
            fillHeader?: string | null;
            minRowHeight?: number;
            minColumnWidth?: number;
            resizerSize?: number;
        }
        /**
         * Options to retrive more data about Table Cells
         */
        interface TableCellDataOptions {
            includeAll?: boolean;
            includeOffset?: boolean;
            includePosition?: boolean;
            includeWidth?: boolean;
            includeHeight?: boolean;
            includeCoords?: boolean;
        }
        class Table extends FabricTable {
        }
    }
}
export {};
