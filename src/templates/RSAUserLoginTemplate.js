import React, { useEffect, useState } from "react";
import { Layout } from "antd";
export default function RSAUserLoginTemplate({ Component }) {
  const { Sider, Content } = Layout;
  const [{width, height}, setSize] = useState({width: window.innerWidth, height: window.innerHeight});

  useEffect(() => {
    window.onresize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  }, [])

  return (
    <>
      <Layout>
        <Sider width={width / 2} style={{height:height, backgroundImage: "url(https://picsum.photos/2000)", backgroundRepeat: "no-repeat"}}></Sider>
        <Content>
          <Component/>
        </Content>
      </Layout>
    </>
  );
}
   