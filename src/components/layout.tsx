/*
 * @Author: duxinyues yongyuan253015@gmail.com
 * @Date: 2023-02-28 10:58:13
 * @LastEditors: duxinyues yongyuan253015@gmail.com
 * @LastEditTime: 2023-02-28 11:01:04
 * @FilePath: \next\src\components\layout.tsx
 * @Description:
 * Copyright (c) 2023 by ${duxinyues} email: ${yongyuan253015@gmail.com}, All Rights Reserved.
 */
import Head from "next/head";
import styles from "./layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Head>
        <title>Layouts Example</title>
      </Head>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
