import {
	ProfileOutlined,
	ShopOutlined,
	LoginOutlined,
	LogoutOutlined,
	UserAddOutlined,
	UserOutlined,
	UnorderedListOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React from "react";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SiderDemo extends React.Component {
	state = {
		collapsed: false,
	};

	onCollapse = (collapsed) => {
		console.log(collapsed);
		this.setState({ collapsed });
	};

	render() {
		return (
			<Layout style={{ minHeight: "100vh" }}>
				<Sider
					collapsible
					collapsed={this.state.collapsed}
					onCollapse={this.onCollapse}
				>
					<div className="logo" />
					<Menu theme="dark" defaultSelectedKeys={["profile"]} mode="inline">
						<Menu.Item key="profile" icon={<ProfileOutlined />}>
							Profile
						</Menu.Item>
						<Menu.Item key="cart" icon={<UnorderedListOutlined />}>
							Cart
						</Menu.Item>
						<Menu.Item key="orders" icon={<ShopOutlined />}>
							Orders
						</Menu.Item>
						<SubMenu key="users" icon={<UserOutlined />} title="User">
							<Menu.Item icon={<LoginOutlined />} key="login">
								Login
							</Menu.Item>
							<Menu.Item icon={<UserAddOutlined />} key="register">
								Register
							</Menu.Item>
						</SubMenu>
						<Menu.Item
							icon={<LogoutOutlined />}
							key="logout"
						>
							Logout
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout className="site-layout">
					<Header className="site-layout-background" style={{ padding: 0 }} />
					<Content style={{ margin: "0 16px" }}>
						<div
							className="site-layout-background"
							style={{ padding: 24, minHeight: 360 }}
						>
							This is our content
						</div>
					</Content>
					<Footer style={{ textAlign: "center" }}>
						Ecommerce by Coding Pillow
					</Footer>
				</Layout>
			</Layout>
		);
	}
}

export default SiderDemo;
