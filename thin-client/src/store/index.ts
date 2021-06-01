import { message } from "antd";
import axios from "axios";
import { makeObservable, observable } from "mobx";
import moment from "moment";
import { ICallbackMessageStatus } from "../interfaces/ICallbackMessageStatus";
import serializeData from "../utilities/serializeData";

export default class RootStore {
  docSource: object[];
  docItemSource: object[];
  apiUrl: string;

  docTableLoading: boolean;
  docTableActiveKey: string | number | undefined;

  constructor() {
    this.apiUrl = "http://localhost:8080";

    this.docSource = [];
    this.docItemSource = [];

    this.docTableLoading = false;
    this.docTableActiveKey = undefined;

    makeObservable(this, {
      docSource: observable,
      docItemSource: observable,
      docTableLoading: observable,
      docTableActiveKey: observable,
    });
  }

  async componentDidMount() {
    this.docTableLoading = true;
    const payload = await axios.get(`${this.apiUrl}/doc`, { method: "GET" });
    if (payload.data.status === ICallbackMessageStatus.Done) {
      this.docSource = serializeData(payload.data.data).map((item) => {
        return { ...item, date: moment(item.date).format("DD.MM.YYYY") };
      });
    } else {
      message.error(payload.data.error);
    }
    this.docTableLoading = false;
  }
}
