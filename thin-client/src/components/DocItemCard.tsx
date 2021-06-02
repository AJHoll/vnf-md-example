import { observer } from "mobx-react";
import React from "react";
import RootStore from "../store";

type DocItemCardProps = {
  rootStore: RootStore;
};

const DocItemCard = observer(
  class DocItemCard extends React.Component<DocItemCardProps> {
    render() {
      return <h1>{this.props.rootStore.docTableActiveKey}</h1>;
    }
  }
);

export default DocItemCard;
