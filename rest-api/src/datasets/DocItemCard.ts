import { IDataset, IOperations } from 'src/controller/interfaces';

export default class DocItemCard implements IDataset {
  context: any;
  operations: IOperations;

  constructor(context: any) {
    this.context = context;
    this.operations = {
      selectData: {
        query: `select doc_item.*
                from cmn_doc.doc_item doc_item
                where doc_item.id_doc = $(idDoc)
                  and doc_item.id = $(idDocItem)`,
        bindingParams: { idDoc: null, idDocItem: null },
      },
    };
  }
}
