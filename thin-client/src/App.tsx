import { Divider, Layout, PageHeader } from "antd";
import React from "react";
import { observer } from "mobx-react";
import RootStore from "./store";
import UniversalList from "./components/UniversalList";
import { ColumnsType } from "antd/lib/table";
import DocCard from "./components/DocCard";
import DocItemCard from "./components/DocItemCard";

const App = observer(
  class App extends React.Component {
    rootStore = new RootStore();
    async componentDidMount() {
      await this.rootStore.componentDidMount();
    }

    docColumns: ColumnsType<any> = [
      {
        key: 1,
        title: "Номер",
        dataIndex: "number",
      },
      {
        key: 2,
        title: "Дата",
        dataIndex: "date",
      },
      {
        key: 3,
        title: "Сумма",
        dataIndex: "sum",
      },
      {
        key: 4,
        title: "Примечание",
        dataIndex: "description",
      },
    ];
    docItemColumns: ColumnsType<object> = [
      {
        key: 1,
        title: "Номер",
        dataIndex: "number",
      },
      {
        key: 2,
        title: "Наименование",
        dataIndex: "caption",
      },
      {
        key: 3,
        title: "Сумма",
        dataIndex: "sum",
      },
    ];
    render() {
      return (
        <Layout>
          <Layout.Content style={{ marginLeft: "30px", marginRight: "30px" }}>
            <PageHeader
              title="Master-detail sample by AJHoll"
              style={{ margin: "0", padding: "0" }}
            />
            <Divider>Документ</Divider>
            <DocCard rootStore={this.rootStore} />
            <UniversalList
              key="doc-table"
              columns={this.docColumns}
              dataSource={this.rootStore.docSource}
              loading={this.rootStore.docTableLoading}
              onClickSelected={async (data, event) => {
                await this.rootStore.setDocTableActiveKey(data.key);
              }}
              scroll={{ y: "200px" }}
              pagination={false}
              onCreate={(event) => {
                console.log("create");
              }}
              onEdit={(selectedKey, event) => {
                console.log("edit", selectedKey);
              }}
              onDelete={(selectedKeys, event) => {
                console.log("delete", selectedKeys);
              }}
            />
            <Divider>Спецификация</Divider>
            <DocItemCard rootStore={this.rootStore} />
            <UniversalList
              key="doc-item-table"
              columns={this.docItemColumns}
              dataSource={this.rootStore.docItemSource}
              loading={this.rootStore.docItemTableLoading}
              scroll={{ y: "200px" }}
              pagination={false}
            />
            <Divider></Divider>
          </Layout.Content>
        </Layout>
      );
    }
  }
);
export default App;
