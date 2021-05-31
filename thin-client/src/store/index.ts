import { makeObservable, observable } from "mobx";

export default class RootStore {
  hello: string;

  constructor() {
    this.hello = "hello from store";
    makeObservable(this, {
      hello: observable,
    });
  }
}
