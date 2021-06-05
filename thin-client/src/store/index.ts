import { message } from "antd";
import axios from "axios";
import { action, makeObservable, observable } from "mobx";
import moment from "moment";
import { ICallbackMessageStatus } from "../interfaces/ICallbackMessageStatus";
import serializeData from "../utilities/serializeData";
import DocCardStore from "./DocCardStore";
import DocItemCardStore from "./DocItemCardStore";

export default class RootStore {
  docSource: object[];
  docItemSource: object[];
  apiUrl: string;

  docTableLoading: boolean;
  docTableActiveKey: string | number | undefined;
  docItemTableLoading: boolean;
  docCardStore: DocCardStore;
  docItemCardStore: DocItemCardStore;

  constructor() {
    this.apiUrl = "http://localhost:8080";

    this.docCardStore = new DocCardStore(this, this);
    this.docItemCardStore = new DocItemCardStore(this, this);

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
    await this.loadDocData();
  }

  async loadDocData() {
    this.setDocTableLoading(true);
    const payload = await axios.get(`${this.apiUrl}/doc`);
    if (payload.data.status === ICallbackMessageStatus.Done) {
      const docSource = serializeData(payload.data.data).map((item) => {
        return { ...item, date: moment(item.date).format("DD.MM.YYYY") };
      });
      this.setDocSource(docSource);
    } else {
      message.error(payload.data.error.detail);
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
      message.error(payload.data.error.detail);
    }
    this.setDocItemTableLoading(false);
  }

  async onDocDelete(selectedKeys: number[] | string[] | undefined) {
    let count = 0;
    if (selectedKeys) {
      for (let key of selectedKeys) {
        const payload = await axios.delete(`${this.apiUrl}/doc/${key}`);
        if (payload.data.status !== ICallbackMessageStatus.Done) {
          message.error(payload.data.error.detail);
        }
        count++;
        if (count === selectedKeys.length) this.loadDocData();
      }
    }
  }
  async onDocItemDelete(selectedKeys: number[] | string[] | undefined) {
    let count = 0;
    if (selectedKeys) {
      for (let key of selectedKeys) {
        const payload = await axios.delete(
          `${this.apiUrl}/doc/${this.docTableActiveKey}/item/${key}`
        );
        if (payload.data.status !== ICallbackMessageStatus.Done) {
          message.error(payload.data.error.detail);
        }
        count++;
        if (count === selectedKeys.length)
          this.loadDocItemData(this.docTableActiveKey);
      }
    }
  }
}
