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