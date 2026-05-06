# Campus Secondhand Trading Platform DB System

数据库原理课程作业 —— 校园二手交易平台数据库系统

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/hahahah2026/campus-secondhand-db)
[![Online Demo](https://img.shields.io/badge/Online-Demo-green)](https://qqzcacwcznx4w.ok.kimi.link)

## 项目简介

这是校园二手交易平台数据库系统，使用 SQLite (In-Browser JS) 作为数据库引擎，所有数据存储在浏览器内存中。项目涵盖了数据库定义、数据操作、基本查询、连接查询、聚合查询、视图以及购买交易等业务功能。

## 技术栈

 **前端框架**:  HTML + CSS + JavaScript
 **UI 框架**: CSS CDN
 **图标库**: Font Awesome 6.4.0
 **数据库**: SQL.js (SQLite compiled to JavaScript via Emscripten)

## 项目结构

##  主页面 (侧边栏导航 + 内容区域)
campus-secondhand-db/
index.html         
## 全局样式 (导航、表格、卡片、按钮、表单)
css/
 style.css      
 ## 核心业务逻辑 (数据模型、页面渲染、CRUD操作)
 js/
 app.js          
  ## 项目说明文档
 README.md           



## 数据库设计

### 表结构

#### User 表（用户表）
| 字段 | 类型 | 约束 |
|------|------|------|
| user_id | VARCHAR(10) | PRIMARY KEY |
| user_name | VARCHAR(50) | NOT NULL |
| phone | VARCHAR(20) | |

#### Item 表（商品表）
| 字段 | 类型 | 约束 |
|------|------|------|
| item_id | VARCHAR(10) | PRIMARY KEY |
| item_name | VARCHAR(100) | NOT NULL |
| category | VARCHAR(50) | |
| price | DECIMAL(10,2) | |
| status | INT | DEFAULT 0, CHECK(0,1) |
| seller_id | VARCHAR(10) | FOREIGN KEY → User |

#### Orders 表（订单表）
| 字段 | 类型 | 约束 |
|------|------|------|
| order_id | VARCHAR(10) | PRIMARY KEY |
| item_id | VARCHAR(10) | UNIQUE, FOREIGN KEY → Item |
| buyer_id | VARCHAR(10) | FOREIGN KEY → User |
| order_date | DATE | |

### 完整性约束

- **主键约束**: user_id, item_id, order_id 分别是各表的主键
- **外键约束**: Item.seller_id → User.user_id; Orders.item_id → Item.item_id; Orders.buyer_id → User.user_id
- **NOT NULL**: user_name 和 item_name 不能为空
- **CHECK**: Item.status 必须为 0（未售）或 1（已售）
- **UNIQUE**: Orders.item_id 唯一，确保每件商品最多交易一次

## 功能模块

### 1. 数据库定义 (DB Definition)
- 展示 CREATE TABLE 语句
- 说明完整性约束（主键、外键、NOT NULL、CHECK、UNIQUE）
- 数据一致性规则说明

### 2. 数据操作 (Data Operations)
- **INSERT**: 插入新商品（自动设置 status=0）
- **UPDATE**: 修改商品价格
- **DELETE**: 删除未售商品（仅 status=0 的可删除）

### 3. 基本查询 (Basic Query)
- 查询所有未售商品 (status = 0)
- 查询价格大于30的商品
- 查询 DailyGoods 类别商品
- 查询 u001 用户发布的所有商品

### 4. 连接查询 (Join Query)
- 查询已售商品及其买家姓名 (INNER JOIN)
- 查询订单详情：商品名+买家名+日期 (多表JOIN)
- 查询 u001 商品是否被购买 (LEFT JOIN + CASE)

### 5. 聚合查询 (Aggregation)
- 统计商品总数 (COUNT)
- 按类别统计商品数量 (GROUP BY)
- 计算商品平均价格 (AVG + ROUND)
- 找出发布商品最多的用户 (ORDER BY + LIMIT)

### 6. 视图 (Views)
- SoldItems 视图：已售商品名+买家ID
- UnsoldItems 视图：未售商品完整信息

### 7. 购买商品 (Buy Item)
- 选择未售商品 + 买家 + 日期
- 原子性操作：INSERT订单 + UPDATE商品状态
- UNIQUE约束保护：防止重复购买

## 初始数据

### User 表
| user_id | user_name | phone |
|---------|-----------|-------|
| u001 | ZhangSan | 13800000001 |
| u002 | LiSi | 13800000002 |
| u003 | WangWu | 13800000003 |
| u004 | ZhaoLiu | 13800000004 |

### Item 表
| item_id | item_name | category | price | status | seller_id |
|---------|-----------|----------|-------|--------|-----------|
| i001 | CalculusBook | Book | 20 | 0 | u001 |
| i002 | DeskLamp | DailyGoods | 35 | 1 | u002 |
| i003 | Microcontroller | Electronics | 80 | 0 | u001 |
| i004 | Chair | Furniture | 50 | 1 | u003 |
| i005 | WaterBottle | DailyGoods | 15 | 0 | u004 |

### Orders 表
| order_id | item_id | buyer_id | order_date |
|----------|---------|----------|------------|
| o001 | i002 | u001 | 2024-05-01 |
| o002 | i004 | u002 | 2024-05-03 |

## 使用说明

1. 直接在浏览器中打开 `index.html` 即可运行（需要联网加载 CDN 资源）
2. 左侧导航栏切换不同功能模块
3. 数据操作和购买功能会实时更新内存中的数据库
4. 刷新页面后数据会恢复为初始状态

## 课程作业要求覆盖

- [x] 第一部分：数据库定义（建表 + 完整性约束）
- [x] 第二部分：数据操作（INSERT/UPDATE/DELETE + 查询）
- [x] 第三部分：连接查询（JOIN）
- [x] 第四部分：聚合与分组（GROUP BY + 聚合函数）
- [x] 第五部分：视图（CREATE VIEW）
- [x] 第六部分：业务逻辑（购买交易 + 约束保护）

---

*Database Principles Course Project*
