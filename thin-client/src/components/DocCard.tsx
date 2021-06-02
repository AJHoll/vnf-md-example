import { observer } from "mobx-react";
import React from "react";
import RootStore from "../store";

type DocCardProps = {
  rootStore: RootStore;
};

const DocCard = observer(
  class DocCard extends React.Component<DocCardProps> {
    render() {
      return <h1>{this.props.rootStore.docTableActiveKey}</h1>;
    }
  }
);

export default DocCard;
