## Requirement

- Database
  - [PostgreSQL](https://www.postgresql.org/download/)
- Tools
  - [Nodejs](https://nodejs.org/en/download/)
  - [Yarn](https://yarnpkg.com/getting-started/install)
  - [Table Plus](https://tableplus.com)
  - [Gitkraken](https://www.gitkraken.com)
    - get **FREE PRO** License [Here](https://education.github.com/pack)
  - [Postman](https://www.postman.com/downloads/)

## Clone project to directory

- run command

```bash
  # Select Directory
  $ cd <your directory that want project to install>

  # Clone project
  $ git clone -b master https://github.com/FECampChulalongkornUniversity/FE-2021-Backend.git
```

## Setup Database

### Connect database with table plus

1. เปิด Table Plus กดปุ่ม "Create a new connection"
2. ใส่ทุกช่องตามที่ Setup ไว้ตอน install database (name=อะไรก็ได้แล้วแต่, host=localhost, port=5432, database เว้นว่างไว้)
3. ลองกดปุ่ม Test (ถ้าไม่มีอะไรผิดจะขึ้น connection is OK)
4. แล้วกด connnect

### Create database with table plus

1. หลังจาก connect เรียบร้อยแล้วกดปุ่ม SQL (อยู่มุมซ้ายบนเป็นรูปสี่เหลี่ยมมีคำว่า SQL อยู่ข้างใน)
2. ใส่ SQL Command `CREATE DATABASE <NAME>;` **แก้ <NAME> เป็นชื่ออะไรก็ได้แต่อย่าลบ ";" ออกก**
3. กด Ctrl + Enter (mac น่าจะเป็น command + Enter)
4. มันควรจะขึ้นว่า Query 1 OK
5. แล้วกดที่รูป database (รูปทรงกระบอกที่เป็นแบ่งท่อนๆ 3 ท่อนข้างๆปุ่ม SQL)
6. แล้วเลือก database ที่พึ่งสร้างเมื่อกี้

## Setup ENV File

- **Rename** **_.env.example_** เป็น **_.env.development_** + **Copy** และเปลี่ยนชื่อเป็น **_.env.production_** อีกอันนึง
- Setup .env file (เติมตัวแปรในช่องว่าง)
  <br/>
  - **PORT** ใส่เลขอะไรก็ได้ (default 8000)<br/>
  - **MODE_ENV**
    - .env.development -> development<br/>
    - .env.production -> production<br/>
  
  - **DATABASE_NAME** ใส่ชื่อ database ที่จะเอาข้อมูลไปเก็บ<br/>
  - **DATABASE_USERNAME** username ที่ใส่ตอน setup database (default root)<br/>
  - **DATABASE_PASSWORD** password ที่ใส่ตอน setup database (default ไม่มี)
  <br/>

## Installation

- **ถ้าไม่เคยใช้ nestjs มาก่อนให้ run คำสั่งนี้ด้วย**
  ```bash
  $ yarn global add @nestjs/cli
  ```
- run คำสั่ง
  ```bash
  $ yarn install
  ```

## Running the app

- ก่อน run start ให้ run คำสั่งนี้ก่อน
  ```bash
  # complie typescript to javascript
  $ yarn build
  ```
- start the service

  ```bash
  # watch mode (Dev mode)
  $ yarn run start:dev

  # production mode
  $ yarn run start:prod
  ```

## Etc Command

  ```bash
  # format code template
  $ yarn format

  # format fix code to be as the eslint rule in .eslintrc.js
  $ yarn lint

  # create nest resource
  $ nest g res <name>

  # automatically create a migration file
  $ yarn typeorm:auto-create

  # create empty migration file
  $ yarn typeorm:create

  # run migrations files
  $ yarn typeorm:run

  # show config (typeorm config)
  $ yarn seed:config

  # run seeds and factorires files
  $ yarn seed:run
  ```

## Doc List

- NestJS
  - [Official Doc](https://docs.nestjs.com)
- Typeorm
  - [Model Relationship](https://typeorm.io/#/relations)
  - [Column Type](https://typeorm.io/#/entities/#Column%20types)
  - [Querybuilder](https://typeorm.io/#/select-query-builder)
  - [Decorator Refereneces](https://typeorm.io/#/decorator-reference)
- Eslint
  - [Rules](https://eslint.org/docs/rules/)
