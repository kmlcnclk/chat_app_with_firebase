import React from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';

function MyLayout({ children }) {
  return (
    <div>
      <Head>
        <title>Chatify</title>
        <meta name="description" content="Chatify is a chat app for you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-[100vh]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}

export default MyLayout;
