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
              console.error(err)
            }
          }
        }}
      >
        <Form
          ref={this.formRef}

          initialValues={{
            number: this.docItemCardStore.cardData.number,
            caption: this.docItemCardStore.cardData.caption,
            sum: this.docItemCardStore.cardData.sum,
          }}
          onFinish={() => this.docItemCardStore.onFinish()}
        >
          <Form.Item name="number" label="Номер" rules={[{ required: true, message: 'Поле обязательно для заполнения!' }]}>
            <Input onChange={(event) => { this.docItemCardStore.setNumber(event.target.value); }} />
          </Form.Item>
          <Form.Item name="caption" label="Наименование">
            <Input onChange={(event) => { this.docItemCardStore.setCaption(event.target.value); }} />
          </Form.Item>
          <Form.Item name="sum" label="Сумма" rules={[{ required: true, message: 'Поле обязательно для заполнения!' }]}>
            <Input type="number" onChange={(event) => { this.docItemCardStore.setSum(+event.target.value); }} />
          </Form.Item >
        </Form>
      </UniversalCardLayout>
    );
  }
}

const DocItemCard = observer(DocItemCardClass);

export default DocItemCard;
