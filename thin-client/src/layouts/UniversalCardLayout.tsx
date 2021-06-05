import { Button, Drawer, Dropdown, Menu, Modal, Row, Space } from "antd";
import { observer } from "mobx-react";
import React, { ReactText } from "react";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

interface IDrawerCardLayoutProps {
  onOk?: () => void;
  onOkAndClose?: () => void;
  submitButtonTitle?: React.ReactNode;
  title?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  visible?: boolean;
  placement?: "right" | "top" | "bottom" | "left" | undefined;
  onCancel?: (event: React.MouseEvent<HTMLElement, MouseEvent> | any) => void;
  footerJustify?:
    | "end"
    | "start"
    | "center"
    | "space-around"
    | "space-between"
    | undefined;
  cancelButtonTitle?: React.ReactNode;
  dataWasModified?: boolean;
}

const DrawerCardLayout = observer(
  class DrawerCardLayout extends React.Component<IDrawerCardLayoutProps> {
    handleOkButtonClick(key: ReactText) {
      if (key === "save") {
        if (this.props.onOk) this.props.onOk();
      }
      if (key === "save-and-close") {
        if (this.props.onOkAndClose) this.props.onOkAndClose();
      }
    }
    handleOnClose: (event: any) => void = (event) => {
      if (this.props.dataWasModified) {
        const modal = Modal.confirm({
          centered: true,
          okText: "Да",
          cancelText: "Нет",
          title: "Вы уверены?",
          content:
            "Данные в карточке были изменены. Вы точно уверены, что хотите выйти?",
          onOk: (event) => {
            if (this.props.onCancel) this.props.onCancel(event);
            modal.destroy();
          },
        });
      } else {
        if (this.props.onCancel) this.props.onCancel(event);
      }
    };
    render() {
      let saveButton: React.ReactNode;
      if (this.props.onOkAndClose) {
        saveButton = (
          <Dropdown.Button
            disabled={!this.props.dataWasModified}
            overlay={
              <Menu
                onClick={(info) => {
                  this.handleOkButtonClick(info.key);
                }}
              >
                <Menu.Item
                  key="save"
                  children="Сохранить"
                  disabled={!this.props.dataWasModified}
                />
                <Menu.Item
                  key="save-and-close"
                  children="Сохранить и закрыть"
                  disabled={!this.props.dataWasModified}
                />
              </Menu>
            }
            onClick={this.props.onOk}
            type="primary"
            children={this.props.submitButtonTitle || "Сохранить"}
            placement="topRight"
          />
        );
      } else {
        saveButton = (
          <Button
            onClick={this.props.onOk}
            type="primary"
            icon={<CheckCircleOutlined />}
            children={this.props.submitButtonTitle || "Сохранить"}
            disabled={!this.props.dataWasModified}
          />
        );
      }

      return (
        <Drawer
          destroyOnClose
          closable={true}
          maskClosable={false}
          keyboard={true}
          title={this.props.title}
          width={this.props.width || "40%"}
          height={this.props.height || "100%"}
          visible={this.props.visible}
          placement={this.props.placement || "right"}
          onClose={this.handleOnClose}
          footer={
            <Row justify={this.props.footerJustify || "end"}>
              <Space direction="horizontal">
                <Button
                  onClick={this.handleOnClose}
                  style={{ marginRight: 8 }}
                  icon={<CloseCircleOutlined />}
                  children={
                    this.props.dataWasModified
                      ? this.props.cancelButtonTitle || "Отмена"
                      : "Закрыть"
                  }
                />
                {saveButton}
              </Space>
            </Row>
          }
          children={this.props.children}
        />
      );
    }
  }
);

export default DrawerCardLayout;
