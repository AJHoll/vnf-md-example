import { Form, FormInstance, Input } from "antd";
import { observer } from "mobx-react";
import React from "react";
import UniversalCardLayout from "../layouts/UniversalCardLayout";
import RootStore from "../store";
import DocItemCardStore from "../store/DocItemCardStore";

type DocItemCardProps = {
  rootStore: RootStore;
};

export class DocItemCardClass extends React.Component<DocItemCardProps> {
  docItemCardStore: DocItemCardStore = this.props.rootStore.docItemCardStore;
  formRef: React.RefObject<FormInstance> = React.createRef();
  render() {
    return (
      <UniversalCardLayout
        title={this.docItemCardStore.cardTitle}
        visible={this.docItemCardStore.cardVisible}
        dataWasModified={this.docItemCardStore.dataWasModified}
        onCancel={() => this.docItemCardStore.onCancel()}
        onOk={() => {
          if (this.formRef.current) {
            try {
              this.formRef.current.submit();
            } catch (err) {
              console.error(err);
            }
          }
        }}
      >
        <Form ref={this.formRef}>
          <Form.Item>
            <Input />
          </Form.Item>
        </Form>
      </UniversalCardLayout>
    );
  }
}

const DocItemCard = observer(DocItemCardClass);

export default DocItemCard;
