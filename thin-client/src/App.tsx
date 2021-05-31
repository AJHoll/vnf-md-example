import { Input, Layout } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { inject, observer } from "mobx-react";
import RootStore from "./store";

const App = observer(
  class App extends React.Component {
    rootStore = new RootStore();
    render() {
      return (
        <Layout>
          <Layout.Header style={{ paddingTop: "10px" }}>
            <Title style={{ color: "#fff" }}>Master-Detail</Title>
          </Layout.Header>
          <Layout.Content>
            {this.rootStore.hello}
            <Input
              defaultValue={this.rootStore.hello}
              onChange={(event) => {
                this.rootStore.hello = event.target.value;
              }}
            />
          </Layout.Content>
        </Layout>
      );
    }
  }
);
export default App;
