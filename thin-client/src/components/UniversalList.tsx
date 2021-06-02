import { Button, Row, Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import React from "react";
import * as Icons from "@ant-design/icons";

export type UniversalListProps = {
  columns: ColumnsType<object>;
  dataSource?: object[];
  loading?: boolean;
  scroll?:
    | ({
        x?: string | number | true | undefined;
        y?: string | number | undefined;
      } & {
        scrollToFirstRowOnChange?: boolean | undefined;
      })
    | undefined;
  pagination?: false | TablePaginationConfig | undefined;
  selectionType?: "radio" | "checkbox";
  onClickSelected?: (data: any, event: any) => void;
  onCreate?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  createBtnText?: React.ReactNode;
  customCreateBtn?: React.ReactNode;
  onEdit?: (
    selectedKey: string | number | undefined,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
  editBtnText?: React.ReactNode;
  customEditBtn?: React.ReactNode;
};

export default class UniversalList extends React.Component<UniversalListProps> {
  state = {
    selectedRowKeys: [],
    selectedKey: undefined,
  };

  getTitle() {
    // Кнопки создания записи
    let createButtons: React.ReactNode;
    if (this.props.customCreateBtn) {
      createButtons = this.props.customCreateBtn;
    } else {
      if (this.props.onCreate)
        createButtons = (
          <Button
            name="uni-create-btn"
            icon={<Icons.PlusOutlined />}
            style={{ width: "40px", marginLeft: "5px" }}
            type="primary"
            children={this.props.createBtnText}
            onClick={this.props.onCreate}
          />
        );
    }
    // Кнопки редактирования записи
    let editButtons: React.ReactNode;
    if (this.props.customEditBtn) {
      editButtons = this.props.customEditBtn;
    } else {
      if (this.props.onEdit) {
        editButtons = (
          <Button
            name="uni-edit-btn"
            icon={<Icons.EditOutlined />}
            style={{ width: "40px", marginLeft: "5px" }}
            type="default"
            children={this.props.editBtnText}
            onClick={(event) => {
              if (this.props.onEdit)
                this.props.onEdit(this.state.selectedKey, event);
            }}
          />
        );
      }
    }
    return (
      <Row justify="start">
        {createButtons}
        {editButtons}
      </Row>
    );
  }

  render() {
    return (
      <Table
        title={() => this.getTitle()}
        scroll={this.props.scroll}
        pagination={this.props.pagination}
        columns={this.props.columns}
        dataSource={this.props.dataSource}
        loading={this.props.loading || false}
        onRow={(data: any, index) => {
          return {
            onClick: (event) => {
              // тычки по строкам аннулируют выделение если выбран единственный элемент
              if (
                this.state.selectedRowKeys.length === 0 ||
                (this.state.selectedRowKeys.length === 1 &&
                  this.state.selectedKey !== undefined)
              ) {
                this.setState({
                  selectedRowKeys: [data.key],
                  selectedKey: data.key,
                });
                if (this.props.onClickSelected) {
                  this.props.onClickSelected(data, event);
                }
              }
            },
            onDoubleClick: (event) => {
              if (this.props.onEdit)
                this.props.onEdit(this.state.selectedKey, event);
            },
          };
        }}
        rowSelection={{
          type: this.props.selectionType,
          onSelect: (record, selected, selRows, event) => {
            this.setState({
              selectedRowKeys: selRows.map((item: any) => {
                return item.key;
              }),
            });
          },
          selectedRowKeys: this.state.selectedRowKeys,
          onChange: (selectedKeys) => {
            this.setState({
              selectedRowKeys: selectedKeys,
              selectedKey: undefined,
            });
          },
        }}
      />
    );
  }
}
