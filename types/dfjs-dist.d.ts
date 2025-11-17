declare module "pdfjs-dist/legacy/build/pdf.mjs" {
  export interface PDFTextItem {
    str: string;
    transform?: number[];
    width?: number;
    height?: number;
    fontName?: string;
  }

  export interface PDFTextContent {
    items: PDFTextItem[];
    styles: Record<string, unknown>;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<PDFTextContent>;
    // add other methods if needed
  }

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface PDFSource {
    url?: string;
    data?: Uint8Array | ArrayBuffer | Buffer;
    // add more options if needed
  }

  export function getDocument(src: PDFSource): {
    promise: Promise<PDFDocumentProxy>;
  };
}
