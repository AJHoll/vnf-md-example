import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React from "react";

export type UniversalListProps = {
  columns: ColumnsType<object>;
  dataSource?: object[];
  loading?: boolean;
  selectionType?: "radio" | "checkbox";
  onClickSelected?: (data: any, event: any) => void;
};

export default class UniversalList extends React.Component<UniversalListProps> {
  state = {
    selectedRowKeys: [],
    selectedKey: undefined,
  };

  render() {
    return (
      <Table
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
