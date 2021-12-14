## Requirement

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
## Setup ENV File

- สร้างไฟล์ **_.env.development_** และ **_.env.production_**
- Copy template ใน **_.env.example_** ไปใส่ **_.env.development_** และ **_.env.production_**
- Setup .env file (เติมตัวแปรในช่องว่าง)
  <br/>
  - **PORT** ใส่เลขอะไรก็ได้ (default 8000)<br/>
  - **DATABASE_NAME** ใส่ชื่อ database ที่จะเอาข้อมูลไปเก็บ<br/>
  - **DATABASE_USERNAME** username (ตั้งเองได้เลย)<br/>
  - **DATABASE_PASSWORD** password (ตั้งเองได้เลย)
  <br/>

## Setup Database

### Docker Compose
- run command 
  ```bash
  $ docker-compose --env-file ./.env.development up
  ```

### Connect database with table plus

1. เปิด Table Plus กดปุ่ม "Create a new connection"
2. ใส่ทุกช่องตามที่ Setup ไว้ตอน install database (name=อะไรก็ได้แล้วแต่, host=localhost, port=5432, database=ชื่อ database ใน .env.development)
3. ลองกดปุ่ม Test (ถ้าไม่มีอะไรผิดจะขึ้น connection is OK)
4. แล้วกด connnect



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
