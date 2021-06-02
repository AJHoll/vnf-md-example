import { message } from "antd";
import axios from "axios";
import { action, makeObservable, observable } from "mobx";
import moment from "moment";
import { ICallbackMessageStatus } from "../interfaces/ICallbackMessageStatus";
import serializeData from "../utilities/serializeData";

export default class RootStore {
  docSource: object[];
  docItemSource: object[];
  apiUrl: string;

  docTableLoading: boolean;
  docTableActiveKey: string | number | undefined;
  docItemTableLoading: boolean;

  constructor() {
    this.apiUrl = "http://localhost:8080";

    this.docSource = [];
    this.docTableLoading = false;
    this.docTableActiveKey = undefined;

    this.docItemSource = [];
    this.docItemTableLoading = false;

    makeObservable(this, {
      docSource: observable,
      docItemSource: observable,
      docTableLoading: observable,
      docTableActiveKey: observable,
      docItemTableLoading: observable,
      setDocSource: action,
      setDocTableLoading: action,
      setDocTableActiveKey: action,
      setDocItemSource: action,
      setDocItemTableLoading: action,
    });
  }
  setDocSource(docSource: object[]) {
    this.docSource = docSource;
  }
  setDocTableLoading(docTableLoading: boolean) {
    this.docTableLoading = docTableLoading;
  }
  async setDocTableActiveKey(docTableActiveKey: string | number | undefined) {
    this.docTableActiveKey = docTableActiveKey;
    await this.loadDocItemData(docTableActiveKey);
  }

  setDocItemSource(docItemSource: object[]) {
    this.docItemSource = docItemSource;
  }

  setDocItemTableLoading(docItemTableLoading: boolean) {
    this.docItemTableLoading = docItemTableLoading;
  }

  async componentDidMount() {
    this.setDocTableLoading(true);
    const payload = await axios.get(`${this.apiUrl}/doc`, { method: "GET" });
    if (payload.data.status === ICallbackMessageStatus.Done) {
      const docSource = serializeData(payload.data.data).map((item) => {
        return { ...item, date: moment(item.date).format("DD.MM.YYYY") };
      });
      this.setDocSource(docSource);
    } else {
      message.error(payload.data.error);
    }
    this.setDocTableLoading(false);
  }

  async loadDocItemData(docTableActiveKey: string | number | undefined) {
    this.setDocItemTableLoading(true);
    const payload = await axios.get(
      `${this.apiUrl}/doc/${docTableActiveKey}/item`
    );
    if (payload.data.status === ICallbackMessageStatus.Done) {
      const docItemSource = serializeData(payload.data.data);
      this.setDocItemSource(docItemSource);
    } else {
      message.error(payload.data.error);
    }
    this.setDocItemTableLoading(false);
  }
}
