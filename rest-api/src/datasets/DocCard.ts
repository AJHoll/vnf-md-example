import { IDataset, IOperations } from 'src/controller/interfaces';

export default class DocCard implements IDataset {
  context: any;
  operations: IOperations;
  constructor(context: any) {
    this.context = context;
    this.operations = {
      selectData: {
        query: `select doc.*
                from cmn_doc.doc doc
                where doc.id = $(id)`,
        bindingParams: { id: null },
      },
      insertRecord: {
        query: `select cmn_doc.doc__insert_record() as id`,
        bindingParams: {},
      },
      updateRecord: {
        query: `select cmn_doc.doc__set_number($(id), $(number))
                      ,cmn_doc.doc__set_date($(id),$(date))
                      ,cmn_doc.doc__set_description($(id), $(description))
                      ,cmn_doc.doc__after_edit($(id))`,
        bindingParams: {
          id: null,
          number: null,
          date: null,
          description: null,
        },
      },
    };
  }
}
