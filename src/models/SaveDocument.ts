import Document from './Document';

interface SaveDocument<TData> {
    documentChange: TData,
    document: Document,
}

export default SaveDocument;