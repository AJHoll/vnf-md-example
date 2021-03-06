import { IDataset, IOperations } from 'src/controller/interfaces';

export default class DocList implements IDataset {
  context: any;
  operations: IOperations;
  constructor(context: any) {
    this.context = context;

    this.operations = {
      selectData: {
        query: `select doc.*
                from cmn_doc.doc doc`,
        bindingParams: {},
      },
      deleteRecord: {
        query: `select cmn_doc.doc__delete_record($(id))`,
        bindingParams: { id: null },
      },
    };
  }
}
