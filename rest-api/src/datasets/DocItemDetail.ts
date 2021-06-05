import { IDataset, IOperations } from 'src/controller/interfaces';

export default class DocItemDetail implements IDataset {
  context: any;
  operations: IOperations;
  constructor(context: any) {
    this.context = context;
    this.operations = {
      selectData: {
        query: `select doc_item.*
                from cmn_doc.doc_item doc_item
                where doc_item.id_doc = $(idDoc)`,
        bindingParams: { idDoc: null },
      },
      deleteRecord: {
        query: `select cmn_doc.doc_item__delete_record($(id))
                      ,cmn_doc.doc__after_edit($(idDoc))`,
        bindingParams: { id: null, idDoc: null },
      },
    };
  }
}
