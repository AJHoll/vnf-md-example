import { Form, FormInstance, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { observer } from "mobx-react";
import React from "react";
import UniversalCardLayout from "../layouts/UniversalCardLayout";
import RootStore from "../store";
import DocCardStore from "../store/DocCardStore";

type DocCardProps = {
  rootStore: RootStore;
};

export class DocCardClass extends React.Component<DocCardProps> {
  docCardStore: DocCardStore = this.props.rootStore.docCardStore;
  formRef: React.RefObject<FormInstance> = React.createRef();
  render() {
    return (
      <UniversalCardLayout
        title={this.docCardStore.cardTitle}
        visible={this.docCardStore.cardVisible}
        dataWasModified={this.docCardStore.dataWasModified}
        onCancel={() => this.docCardStore.onCancel()}
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
        <Form
          ref={this.formRef}
          onFinish={(values) => this.docCardStore.onFinish(values)}
          initialValues={{
            number: this.docCardStore.cardData?.number,
            date: this.docCardStore.cardData?.date,
            sum: this.docCardStore.cardData?.sum,
            description: this.docCardStore.cardData?.description,
          }}
        >
          <Form.Item
            label="Номер"
            name="number"
            rules={[
              { required: true, message: "Поле обязательно для заполнения!" },
            ]}
          >
            <Input
              onChange={(event) =>
                this.docCardStore.setNumber(event.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            label="Дата"
            name="date"
            rules={[
              { required: true, message: "Поле обязательно для заполнения!" },
            ]}
          >
            <Input
              type="date"
              onChange={(event) =>
                this.docCardStore.setDate(event.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Сумма" name="sum">
            <Input readOnly type="number" />
          </Form.Item>
          <Form.Item
            label="Примечание"
            name="description"
            rules={[
              { required: true, message: "Поле обязательно для заполнения!" },
            ]}
          >
            <TextArea
              onChange={(event) =>
                this.docCardStore.setDescription(event.target.value)
              }
            />
          </Form.Item>
        </Form>
      </UniversalCardLayout>
    );
  }
}

const DocCard = observer(DocCardClass);

export default DocCard;
