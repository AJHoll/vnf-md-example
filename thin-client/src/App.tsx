import { Divider, Layout, PageHeader } from "antd";
import React from "react";
import { observer } from "mobx-react";
import RootStore from "./store";
import UniversalList from "./components/UniversalList";
import { ColumnsType } from "antd/lib/table";

const App = observer(
  class App extends React.Component {
    rootStore = new RootStore();
    async componentDidMount() {
      await this.rootStore.componentDidMount();
    }

    docColumns: ColumnsType<object> = [
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

    render() {
      return (
        <Layout>
          <Layout.Content style={{ marginLeft: "30px", marginRight: "30px" }}>
            <PageHeader title="Master-detail sample by AJHoll" />
            <UniversalList
              key="doc-table"
              columns={this.docColumns}
              dataSource={this.rootStore.docSource}
              loading={this.rootStore.docTableLoading}
              onClickSelected={(data, event) => {
                this.rootStore.docTableActiveKey = data.key;
                console.log(this.rootStore);
              }}
            />
            <Divider />
          </Layout.Content>
        </Layout>
      );
    }
  }
);
export default App;
