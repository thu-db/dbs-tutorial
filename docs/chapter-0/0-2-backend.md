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
    id INT NOT NULL PRIMARY KEY, 
    name VARCHAR(32) NOT NULL,
    sex VARCAHR(4),
    status VARCHAR(32) NOT NULL
);

CREATE TABLE teacher (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    sex VARCHAR(4),
);
```

> **[info] CHAR 与 VARCHAR**

> 在常见数据库系统中，通常用 CHAR 作为（存储）定长字符串，VARCHAR 作为变长字符串。

> 在我们的实验中，暂时将变长作为选做，语法上简便起见统一使用 VARCHAR，具体实现是定长还是变长由你自己决定。

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

<!--TODO: 补充表的ER图-->

> **[note] 主键数据类型**

> 1. 主键会带索引，在我们实验要求中仅对整型索引做要求，因此主键一定是整型或其组合。

> 2. 上述复合主键 (student_id, course_id, term) 中的 term 是 VARCHAR，这仅用于举例。

> 3. 主键一定 NOT NULL，我们上面的例子中显式地写出来了，也可以省略，但不能指定为 NULL。

## 举例

结合上面的 schema，我们可以给出一些简单的 SQL 例子：

### 1. 出成绩

假设2021年秋季学期张三同学（学号2077010001）选上了数据库（课程号30240262，课序号0），那么在他选课时可能会发生……

```SQL
MySQL [curriculum]> INSERT INTO student_course VALUES (2077010001, 30240262, 0, '*', '2021-秋');
Query OK, 1 row affected (0.000 sec)
```

注意这个插入语句没有指明 column，因此它是按照 table 默认 column 顺序给所有列赋值了。此时刚选课还没有成绩，因此成绩部分暂时用 `'*'` 代替。

一学期后张三认真完成作业，顺利通过验收，获得绩点 A，那么数据库内可能发生……

```SQL
MySQL [curriculum]> UPDATE student_course SET grade = 'A' WHERE student_id = 2077010001 AND course_id = 30240262 AND term = '2021-秋';
Query OK, 1 row affected (0.001 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

注意更新时一定要精确控制范围，后面用到的 WHERE 三个条件正好构成了表的主键，这种情况下能够保证不会重复且性能很高。注意这里的学期很容易被忽略，~~要考虑到万一张三前年 W 去年 F，这两个成绩是不能变的。~~

### 2. 查成绩

假设管理员想查询张三同学《数据库系统概论》课程的成绩（假定没有重名同学，管理员不知道对应的学号和课程号），他可以……

**分步查询**

我们可以逐步完成，先找到张三的学号，再找到数据库课程的课程号，最后完成成绩查询：

```SQL
MySQL [curriculum]> SELECT id FROM student WHERE name = '张三';
+------------+
| id         |
+------------+
| 2077010001 |
+------------+
1 row in set (0.000 sec)

MySQL [curriculum]> SELECT id FROM course WHERE name ='数据库系统概论';
+----------+
| id       |
+----------+
| 30240262 |
+----------+
1 row in set (0.000 sec)

MySQL [curriculum]> SELECT grade FROM student_course WHERE student_id = 2077010001 AND course_id = 30240262;
+-------+
| grade |
+-------+
| A     |
+-------+
1 row in set (0.000 sec)
```

**嵌套查询**

通过嵌套子查询可以将上述三步在一行 SQL 里完成，对一些上层应用来说处理成子查询能够有效减少查询次数，进而提高效率：

```SQL
MySQL [curriculum]> SELECT grade FROM student_course WHERE student_id =
    -> (SELECT id FROM student WHERE name = '张三') AND course_id =
    -> (SELECT id FROM course WHERE name = '数据库系统概论');
+-------+
| grade |
+-------+
| A     |
+-------+
1 row in set (0.000 sec)
```

**连接查询**

连接查询则是用（可能是隐式的） JOIN 语法，这是以截然不同的逻辑去解决问题：

```SQL
MySQL [curriculum]> SELECT SQL_NO_CACHE grade FROM student_course, student, course 
    -> WHERE student_id = student.id AND course_id = course.id AND
    -> course.name = '数据库系统概论' AND student.name = '张三';
+-------+
| grade |
+-------+
| A     |
+-------+
1 row in set (0.000 sec)
```

> **[info] 连接与嵌套查询**

> 某些情况下连接查询和嵌套查询经过优化器后执行的真正查询是完全相同的，尤其在为了匹配单条记录时它们通常能达到相同的情况，用哪一种取决于你的思维习惯。

> 但是多表连接从思维、语法上都更简洁，一般不建议写太复杂的嵌套查询，而复杂的多表查询则要考虑到连接复杂度。

### 2. 成绩单查询

假设张三想获取自己2021年秋季学期的成绩单，当他登录查询成绩单的网站时，数据库中可能跑了指令（这里直接用连接语法）……

```SQL
MySQL [curriculum]> SELECT student_id, student.name student_name, course_id, course.name course_name, grade
    -> FROM student_course, student, course WHERE student.name = '张三' AND term = '2021秋' AND
    -> student.id = student_id AND course.id = course_id;
+------------+--------------+-----------+-----------------------+-------+
| student_id | student_name | course_id | course_name           | grade |
+------------+--------------+-----------+-----------------------+-------+
| 2077010001 | 张三         |  30240063 | 信号处理原理          | A     |
| 2077010001 | 张三         |  30240163 | 软件工程              | A     |
| 2077010001 | 张三         |  30240382 | 编译原理              | A     |
| 2077010001 | 张三         |  40240354 | 计算机组成原理        | A     |
| 2077010001 | 张三         |  40240513 | 计算机网络原理        | A     |
+------------+--------------+-----------+-----------------------+-------+
5 rows in set (0.000 sec)
```

注意这里用到了很多细节操作，包括连接时同表间出现重名字段需要加表名前缀，没有出现则不用加；SELECT 后面的字段名后可以加别称来让输出结果的表头更好看（如 `student_name`）。

> **[warning] 仅供展示**

> 本节的举例只是做一个 MySQL 效果展示以及一些~~好看的~~输出格式样例，相关语法不一定是实验内容。

{% set authors = ["饶淙元"] %}

{% include "/footer.md" %}