import { Button, Row, Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import React from "react";
import * as Icons from "@ant-design/icons";
import { SizeType } from "antd/lib/config-provider/SizeContext";

export type UniversalListProps = {
  columns: ColumnsType<object>;
  dataSource?: object[];
  loading?: boolean;
  size?: SizeType;
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
  onClickSelected?: (data: any, event?: any) => void;
  onCreate?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  createBtnText?: React.ReactNode;
  createBtnDisabled?: boolean;
  customCreateBtn?: React.ReactNode;
  onEdit?: (
    selectedKey: string | number | undefined,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
  editBtnText?: React.ReactNode;
  editBtnDisabled?: boolean;
  customEditBtn?: React.ReactNode;
  onDelete?: (
    selectedRowKeys: string[] | number[] | undefined,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
  deleteBtnText?: React.ReactNode;
  deleteBtnDisabled?: boolean;
  customDeleteBtn?: React.ReactNode;
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
            style={{ minWidth: "40px", marginLeft: "5px" }}
            type="primary"
            children={this.props.createBtnText}
            onClick={this.props.onCreate}
            disabled={this.props.createBtnDisabled || false}
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
            style={{ minWidth: "40px", marginLeft: "5px" }}
            type="default"
            children={this.props.editBtnText}
            disabled={
              !this.state.selectedKey || this.props.editBtnDisabled === true
            }
            onClick={(event) => {
              if (this.props.onEdit && this.state.selectedKey)
                this.props.onEdit(this.state.selectedKey, event);
            }}
          />
        );
      }
    }
    // Кнопки удаления записи
    let deleteButtons: React.ReactNode;
    if (this.props.customDeleteBtn) {
      deleteButtons = this.props.customDeleteBtn;
    } else {
      if (this.props.onDelete) {
        deleteButtons = (
          <Button
            name="uni-delete-btn"
            icon={<Icons.DeleteOutlined />}
            style={{ minWidth: "40px", marginLeft: "5px" }}
            type="primary"
            danger
            children={this.props.deleteBtnText}
            disabled={
              this.state.selectedRowKeys.length === 0 ||
              this.props.deleteBtnDisabled === true
            }
            onClick={(event) => {
              if (this.props.onDelete && this.state.selectedRowKeys.length > 0)
                this.props.onDelete(this.state.selectedRowKeys, event);
              this.setState({
                selectedRowKeys: [],
                selectedKey: undefined,
              });
            }}
          />
        );
      }
    }

    return (
      <Row justify="start">
        {createButtons}
        {editButtons}
        {deleteButtons}
      </Row>
    );
  }

  render() {
    return (
      <Table
        size={this.props.size || "small"}
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
                if (this.state.selectedKey !== data.key) {
                  this.setState({
                    selectedRowKeys: [data.key],
                    selectedKey: data.key,
                  });
                  if (this.props.onClickSelected) {
                    this.props.onClickSelected(data, event);
                  }
                }
              }
            },
            onDoubleClick: (event) => {
              if (this.props.onEdit && this.state.selectedKey)
                this.props.onEdit(this.state.selectedKey, event);
            },
          };
        }}
        rowSelection={{
          type: this.props.selectionType,
          onSelect: (record, selected, selRows, event) => {
            this.setState({
              selectedKey: undefined,
              selectedRowKeys: selRows.map((item: any) => {
                return item.key;
              }),
            });
          },
          selectedRowKeys: this.state.selectedRowKeys,
          onChange: (selectedKeys) => {
            if (selectedKeys.length <= 1)
              if (this.props.onClickSelected)
                this.props.onClickSelected({ key: selectedKeys[0] });
            this.setState({
              selectedKey: undefined,
              selectedRowKeys: selectedKeys,
            });
          },
        }}
      />
    );
  }
}
