# 0.2 后端约定

为了便于后续部分模块介绍，我们假定一个场景以便举例之用。

## 数据库

参考清华大学课程系统，我们简化出一个简单的模型，包含学生、教师、课程、（同一课程号的）课程的不同开课信息、学生选课信息等表。

首先我们创建一个数据库 curriculum：

```SQL
CREATE DATABASE curriculum;
```

实际使用时还应该用到数据库切换指令

```SQL
USE curriculum;
```

上述指令属于系统管理指令，但我们的实验文档是按照自下而上的顺序搭建系统，因此在实验前中期你可能更需要关注下面的数据表。

## 数据表

首先学生 (student) 和老师 (teacher) 有对应的编号 (id)、姓名 (name)、性别 (sex)，此外同学有一个字段身份 (status) 区分本科生、硕士生、研究生。

```SQL
CREATE TABLE student (
    id INT NOT NULL PRIMARY KEY,  📌 ️主键本身就是not null？
    name VARCHAR(32) NOT NULL, 📌 ️是否支持变长？
    sex VARCAHR(4),
    status VARCHAR(32) NOT NULL
);

CREATE TABLE teacher (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    sex VARCHAR(4),
);
```

每门课程 (course) 有唯一的课程号 (id)、课程名 (name)、学分 (credit)。由于同一门课可以由不同老师开设（或同一老师的不同时段）并有不同的课程介绍 (description)，这用课序号 (course_number) 进行区分，我们将这些信息的集合称作一个课程详情 (course_detail)。

注意 course_detail 使用了复合主键 (course_id, course_number)。

```SQL
CREATE TABLE course (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    credit INT DEFAULT 0
);

CREATE TABLE course_detail (
    course_id INT NOT NULL,
    course_number INT NOT NULL,
    teacher_id INT DEFAULT NULL,
    description VARCHAR(4096),
    PRIMARY KEY (course_id, course_number),
    FOREIGN KEY (course_id) REFERENCES course(id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(id)
);
```

最后，一位同学的选课信息 (student_course) 需要添加成绩 (grade)、学期 (term) 信息。注意它有复合主键 (student_id, course_id, term)，这暗示着一门课在一个学期只能被一名同学选一次（更多的时候一名同学只能选一门课一次，但这不由数据库保证），(course_id, course_number) 构成了复合外键指向 course 的复合主键。

```SQL
CREATE TABLE student_course (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    course_number INT NOT NULL,
    grade VARCHAR(3),
    term VARCHAR(16) NOT NULL,
    PRIMARY KEY (student_id, course_id, term),
    FOREIGN KEY course_id_number(course_id, course_number) REFERENCES course_detail(course_id, course_number),
    FOREIGN KEY (student_id) REFERENCES student(id)
);
```

📌 补充三张表对应的E-R图

📌 补充用户使用SQL的例子，比如

> (1) "张三数据库系统概论得了95分"，给出相应的写SQL例子

> (2) "张三需要查询自己春季学期的各科成绩"，给出相应的读SQL例子


> **[note] 主键数据类型**

> 1/ 主键会带索引，在我们实验要求中仅对整型索引做要求，因此主键一定是整型或其组合。

> 2/ 上述复合主键 (student_id, course_id, term) 中的 term 是 VARCHAR，这仅用于举例。


{% set authors = ["饶淙元"] %}

{% include "/footer.md" %}