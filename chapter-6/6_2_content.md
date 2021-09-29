# 6.2 基本功能

## 1. 数据库存储管理

### 创建数据库

```SQL
CREATE DATABASE curriculum_backup;
```

### 删除数据库

```SQL
DROP DATABASE curriculum_backup;
```

### 切换数据库

```SQL
USE DATABASE curriculum_backup;
```

### 列出数据库以及包含的所有表名

```SQL
SHOW DATABASE curriculum;
```

## 2. 表存储管理

### 创建数据表

```SQL
CREATE TABLE scholars(
    studentid INT,
    awardname VARCHAR(32) NOT NULL,
    awardtime DATE
);
```

### 列出表的模式信息

```SQL
SHOW TABLE scholars;
```

### 删除数据表

```SQL
DROP TABLE scholars;
```

### 表重命名

```SQL
ALTER TABLE student RENAME TO student_2021; 
```

# 6.3 进阶功能

## 1. 约束关系管理

### 删除主键

```SQL
ALTER TABLE course_detail DROP PRIMARY KEY (course_id, course_number); 
```

### 创建主键

```SQL
ALTER TABLE course_detail ADD PRIMARY KEY (course_id, course_number, teacher_id);
```

### 创建外键

```SQL
ALTER TABLE course_detail ADD CONSTRAINT fk_detail_teacher 
    FOREIGN KEY(teacher_id) REFERENCES teacher(id);
```

### 删除外键

```SQL
ALTER TABLE course_detail DROP FOREIGN KEY fk_detail_teacher; 
```

## 2. 表存储管理

### 添加一列 (选做)

```sql
ALTER TABLE student ADD scholars VARCHAR(32) 
    AFTER status;  
```

### 删除一列 (选做)

```sql
ALTER TABLE student DROP COLUMN scholars;
```


### 修改列属性 (选做)

```sql
ALTER TABLE student MODIFY 
    COLUMN status VARCHAR(128);
```


## 3. 索引管理

### 添加HASH索引 (选做)

```sql
ALTER TABLE student ADD HASH INDEX idx_studentid(id);
```

or

```sql
CREATE HASH INDEX idx_studentid ON student(id);
```


### 删除索引

```sql
DROP INDEX idx_studentid ON student;
```


{% set authors = ["周煊赫"] %}

{% include "/footer.md" %}