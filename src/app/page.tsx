/*
 * @Author: duxinyues yongyuan253015@gmail.com
 * @Date: 2023-02-28 10:46:20
 * @LastEditors: duxinyues yongyuan253015@gmail.com
 * @LastEditTime: 2023-02-28 11:04:17
 * @FilePath: \next\src\app\page.tsx
 * @Description:
 * Copyright (c) 2023 by ${duxinyues} email: ${yongyuan253015@gmail.com}, All Rights Reserved.
 */
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Layout>
      <Sidebar />
      测试
    </Layout>
  );
}
