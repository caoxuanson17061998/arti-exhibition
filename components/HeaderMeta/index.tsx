import Head from "next/head";
import React from "react";

interface HeaderMetaProps {
  title?: string | undefined;
  description?: string | undefined;
}
function HeaderMeta(props: HeaderMetaProps): JSX.Element {
  return (
    <Head>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <meta itemProp="name" content={props.title} />
      <meta itemProp="description" content={props.description} />

      {/* Preload Red Rose font for better performance */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Red+Rose:wght@300;400;500;600;700&display=swap"
        as="style"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Red+Rose:wght@300;400;500;600;700&display=swap"
      />
    </Head>
  );
}
export default HeaderMeta;
