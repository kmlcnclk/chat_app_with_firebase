import Head from 'next/head';
import React from 'react';
import LoginComponent from '../components/LoginComponent';

function Login() {
  return (
    <div>
      <Head>
        <title>Chatify - Login</title>
        <meta name="description" content="Chatify is a chat app for you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginComponent />
    </div>
  );
}

export default Login;
