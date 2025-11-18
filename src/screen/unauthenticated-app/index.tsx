import { useState } from "react";
import styled from "@emotion/styled";

import { Card } from "antd";
import { LoginScreen } from "./login";
import { ErrorBox } from "components/lib";

import left from "assets/images/left.svg";
import right from "assets/images/right.svg";
import logo from "assets/images/logo.png";

export const UnauthenticatedApp = () => {
  const [error, setError] = useState<Error | null>(null);

  return (
    <Container>
      <Header>
        <Logo src={logo} alt="" />
        <div>小鱼游商家后台</div>
      </Header>
      <Background />
      <ShadowCard>
        <Title>请登录</Title>
        <LoginScreen onError={setError} />
        <ErrorBox error={error} />
      </ShadowCard>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: left bottom, right bottom;
  background-size: calc(((100vw - 40rem) / 2) - 3.2rem),
    calc(((100vw - 40rem) / 2) - 3.2rem), cover;
  background-image: url(${left}), url(${right});
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 5rem 0;
  font-size: 2.8rem;
  text-align: center;
  font-weight: 500;
`;
const Logo = styled.img`
  margin-right: 1.2rem;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
`;

const ShadowCard = styled(Card)`
  width: 40rem;
  min-height: 56rem;
  padding: 3.2rem 4rem;
  border-radius: 0.3rem;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
  text-align: center;
  border-radius: 2.4rem;
`;

const Title = styled.h2`
  margin-bottom: 2.4rem;
  color: rgb(94, 108, 132);
`;
