import { message } from "antd";
import axios from "axios";
import { action, makeObservable, observable } from "mobx";
import RootStore from ".";
import { ICallbackMessageStatus } from "../interfaces/ICallbackMessageStatus";

export type DocItemCardDataType = {
  key?: string | number | undefined,
  id: number | undefined,
  doc: number,
  number: string,
  caption: string,
  sum?: number | undefined
}

export default class DocItemCardStore {


  parentStore: RootStore;
  rootStore: RootStore;

  cardVisible: boolean;
  cardTitle: string;
  cardData: DocItemCardDataType;
  dataWasModified: boolean;

  constructor(parentStore: RootStore, rootStore: RootStore) {
    this.parentStore = parentStore;
    this.rootStore = rootStore;

    this.cardVisible = false;
    this.cardTitle = 'Спецификация документа';
    this.dataWasModified = false;

    this.cardData = {
      id: -1,
      doc: -1,
      number: '',
      caption: '',
      sum: 0,
    }

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
      setCaption: action,
      setSum: action,
    })
  }

  setNumber(number: string) {
    this.cardData.number = number;
    this.setDataWasModified(true);
  }
  setCaption(caption: string) {
    this.cardData.caption = caption;
    this.setDataWasModified(true);
  }
  setSum(sum: number) {
    this.cardData.sum = sum;
    this.setDataWasModified(true);
  }

  setCardVisible(cardVisible: boolean) {
    if (!cardVisible) this.setDataWasModified(false);
    this.cardVisible = cardVisible;
  }
  setCardTitle(cardTitle: string) {
    this.cardTitle = cardTitle;
  }
  setCardData(cardData: any) {
    this.cardData = cardData;
  }
  setDataWasModified(dataWasModified: boolean) {
    this.dataWasModified = dataWasModified;
  }

  async openCard(idDoc: string | number, selectedId?: number | string | undefined) {
    let record: any = {
      id: -1,
      doc: +idDoc,
      number: 'Б/Н',
      caption: '',
      sum: 0,
    }
    if (!selectedId) { // Когда вставляем новую запись
      this.setCardTitle('Новая позиция документа')
      this.setCardData(record);
      this.setCardVisible(true);
    } else {
      const payload = await axios.get(`${this.rootStore.apiUrl}/doc/${idDoc}/item/${selectedId}`)
      if (payload.data.status === ICallbackMessageStatus.Done) {
        record = {
          id: payload.data.data.id,
          doc: idDoc,
          number: payload.data.data.number,
          caption: payload.data.data.caption,
          sum: payload.data.data.sum,
        }
        this.setCardTitle(`${record.caption}`);
        this.setCardData(record);
        this.setCardVisible(true);
      }
    }
  }

  async openCardForEdit(idDoc: string | number, selectedKey: number | string | undefined) {
    await this.openCard(idDoc, selectedKey);
  }

  async openCardForInsert(idDoc: string | number) {
    this.setDataWasModified(true);
    await this.openCard(idDoc);
  }

  onCancel() {
    this.setCardVisible(false);
  }

  async onFinish() {
    let payload;
    if (this.cardData.id === -1) {
      payload = await axios.post(`${this.rootStore.apiUrl}/doc/${this.cardData.doc}/item`, {
        number: this.cardData.number,
        caption: this.cardData.caption,
        sum: this.cardData.sum,
      });
      if (payload.data.status === ICallbackMessageStatus.Done) {
        this.parentStore.loadDocItemData(this.cardData.doc);
        this.parentStore.loadDocData();
      } else {
        console.error(payload.data)
        message.error(payload.data.error.detail);
      }
    } else {
      payload = await axios.patch(`${this.rootStore.apiUrl}/doc/${this.cardData.doc}/item/${this.cardData.id}`, {
        number: this.cardData.number,
        caption: this.cardData.caption,
        sum: this.cardData.sum,
      });
      if (payload.data.status === ICallbackMessageStatus.Done) {
        this.parentStore.loadDocItemData(this.cardData.doc);
        this.parentStore.loadDocData();
      } else {
        console.error(payload.data)
        message.error(payload.data.error.detail);
      }
    }
    this.setCardVisible(false);
  }
}