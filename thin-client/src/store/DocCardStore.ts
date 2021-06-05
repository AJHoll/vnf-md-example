import { message } from "antd";
import axios from "axios";
import { action, makeObservable, observable } from "mobx";
import moment from "moment";
import RootStore from ".";
import { ICallbackMessageStatus } from "../interfaces/ICallbackMessageStatus";

export type DocCardDataType = {
  key?: string | number | undefined;
  id: number | undefined;
  number: string | undefined;
  date: string | undefined;
  sum?: number | undefined;
  description?: string | undefined;
};

export default class DocCardStore {
  parentStore: RootStore;
  rootStore: RootStore;

  cardVisible: boolean;
  cardTitle: string;
  cardData: DocCardDataType;
  dataWasModified: boolean;

  constructor(parentStore: RootStore, rootStore: RootStore) {
    this.parentStore = parentStore;
    this.rootStore = rootStore;

    this.cardVisible = false;
    this.cardTitle = "Документ";
    this.cardData = {
      key: undefined,
      id: undefined,
      number: "",
      date: undefined,
      sum: 0,
      description: "",
    };
    this.dataWasModified = false;

    makeObservable(this, {
      cardVisible: observable,
      cardTitle: observable,
      cardData: observable,
      dataWasModified: observable,
      setCardVisible: action,
      setCardTitle: action,
      setCardData: action,
      setDataWasModified: action,
      setNumber: action,
      setDate: action,
      setDescription: action,
    });
  }

  setNumber(number: string) {
    this.cardData.number = number;
    this.setDataWasModified(true);
  }
  setDate(date: string) {
    this.cardData.date = date;
    this.setDataWasModified(true);
  }
  setDescription(description: string) {
    this.cardData.description = description;
    this.setDataWasModified(true);
  }

  setCardVisible(cardVisible: boolean) {
    if (!cardVisible) this.setDataWasModified(false);
    this.cardVisible = cardVisible;
  }
  setCardTitle(cardTitle: string) {
    this.cardTitle = cardTitle;
  }
  setCardData(cardData: DocCardDataType) {
    this.cardData = cardData;
  }
  setDataWasModified(dataWasModified: boolean) {
    this.dataWasModified = dataWasModified;
  }

  async openCard(selectedId?: number | string | undefined) {
    let record: DocCardDataType = {
      id: -1,
      number: "Б/Н",
      date: moment(new Date()).format("YYYY-MM-DD"),
    };
    if (!selectedId) {
      // Когда вставляем новую запись
      this.setCardTitle("Новый документ");
      this.setCardData(record);
      this.setCardVisible(true);
    } else {
      const payload = await axios.get(
        `${this.rootStore.apiUrl}/doc/${selectedId}`
      );
      if (payload.data.status === ICallbackMessageStatus.Done) {
        record = {
          id: payload.data.data.id,
          number: payload.data.data.number,
          date: moment(payload.data.data.date).format("YYYY-MM-DD"),
          sum: payload.data.data.sum,
          description: payload.data.data.description,
        };
        this.setCardTitle(
          `Документ от ${moment(payload.data.data.date).format(
            "DD.MM.YYYY"
          )} № ${record.number}`
        );
        this.setCardData(record);
        this.setCardVisible(true);
      } else {
        message.error(payload.data.error.detail);
      }
    }
  }

  async openCardForEdit(selectedKey: number | string | undefined) {
    await this.openCard(selectedKey);
  }

  async openCardForInsert() {
    this.setDataWasModified(true);
    await this.openCard();
  }

  onCancel() {
    this.setCardVisible(false);
  }

  async onFinish(values: any) {
    let payload;
    if (this.cardData.id === -1) {
      payload = await axios.post(`${this.rootStore.apiUrl}/doc`, this.cardData);
      if (payload.data.status === ICallbackMessageStatus.Done) {
        this.parentStore.loadDocData();
      } else {
        message.error(payload.data.error.detail);
      }
    } else {
      payload = await axios.patch(
        `${this.rootStore.apiUrl}/doc/${this.cardData.id}`,
        this.cardData
      );
      if (payload.data.status === ICallbackMessageStatus.Done) {
        this.parentStore.loadDocData();
      } else {
        message.error(payload.data.error.detail);
      }
    }
    this.setCardVisible(false);
  }
}
