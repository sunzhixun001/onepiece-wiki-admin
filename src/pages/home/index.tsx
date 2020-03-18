import React, {ReactNode} from 'react';
import { Menu, Layout } from 'antd';
import { renderRoutes, RouteConfig, RouteConfigComponentProps } from "react-router-config";
import { Link } from 'react-router-dom';
import './index.css';
const { Header, Content, Footer } = Layout;


const { SubMenu } = Menu;

// interface Props {
//   route : {routes: RouteConfig[] | undefined};
// }
const App: React.FC<RouteConfigComponentProps<any>> = ({ route }) => {
  return (
    <div className="wrap">
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
          >
            <Menu.Item><Link to="/wiki">wiki</Link></Menu.Item>
            <Menu.Item><Link to="/timeline">时间线</Link></Menu.Item>
            <Menu.Item><Link to="/character">人物</Link></Menu.Item>
          </Menu>
        </Header>
        <Content>
          <div className="cw">{renderRoutes(route && route.routes)}</div>
        </Content>
      </Layout>
    </div>
    
  );
}
export default App;