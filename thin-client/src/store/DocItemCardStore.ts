import { message } from "antd";
import axios from "axios";
import { makeObservable, observable } from "mobx";
import moment from "moment";
import RootStore from ".";
import { ICallbackMessageStatus } from "../interfaces/ICallbackMessageStatus";

export default class DocItemCardStore {
  parentStore: RootStore;
  rootStore: RootStore;

  cardVisible: boolean;
  cardTitle: string;
  cardData: any;
  dataWasModified: boolean;

  constructor(parentStore: RootStore, rootStore: RootStore) {
    this.parentStore = parentStore;
    this.rootStore = rootStore;

    this.cardVisible = false;
    this.cardTitle = "Спецификация документа";
    this.dataWasModified = false;
    makeObservable(this, {
      cardVisible: observable,
    });
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

  async openCard(selectedId?: number | string | undefined) {
    let record: any = {
      id: -1,
      doc: undefined,
      number: "Б/Н",
      caption: "",
      sum: 0,
    };
    if (!selectedId) {
      // Когда вставляем новую запись
      this.setCardTitle("Новая спецификация документа");
      this.setCardData(record);
      this.setCardVisible(true);
    } else {
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
}
