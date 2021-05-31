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
      insertRecord: {
        query: `select cmn_doc.doc_item__insert_record($(idDoc)) as id`,
        bindingParams: { idDoc: null },
      },
      updateRecord: {
        query: `select cmn_doc.doc_item__set_number($(id), $(number))
                      ,cmn_doc.doc_item__set_caption($(id),$(caption))
                      ,cmn_doc.doc_item__set_sum($(id), $(sum))
                      ,cmn_doc.doc_item__set_order($(id), $(order))
                      ,cmn_doc.doc_item__after_edit($(id))
                      ,cmn_doc.doc__after_edit($(idDoc))`,
        bindingParams: {
          id: null,
          idDoc: null,
          number: null,
          caption: null,
          sum: null,
          order: null,
        },
      },
    };
  }
}
