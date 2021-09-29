# 6.2 基本功能

## 数据库存储管理

### 1. 创建数据库

```SQL
CREATE DATABASE curriculum_backup;
```

### 2. 删除数据库

```SQL
DROP DATABASE curriculum_backup;
```

### 3. 切换数据库

```SQL
USE DATABASE curriculum_backup;
```

### 4. 列出数据库以及包含的所有表名

```SQL
SHOW DATABASE curriculum;
```

## 表存储管理

### 1. 创建数据表

```SQL
CREATE TABLE scholars(
    studentid INT,
    awardname VARCHAR(32) NOT NULL,
    awardtime DATE
);
```

### 2. 列出表的模式信息

```SQL
SHOW TABLE scholars;
```

### 3. 删除数据表

```SQL
DROP TABLE scholars;
```

### 4. 表重命名

```SQL
ALTER TABLE student RENAME TO student_2021; 
```

{% set authors = ["周煊赫"] %}

{% include "/footer.md" %}