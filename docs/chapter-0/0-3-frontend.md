# 0.3 前端约定

## 前端含义

首先本节标题中的“前端”不是指 GUI (Graphical User Interface，俗称“图形界面”)，而是指我们设计的系统（更像是一个引擎）与人交互时所提供的输入输出形式。

在往年（即本文档诞生之前）的实验中验收采用手动测试（如查看输出总行数），输入方面同样也没有给出足够具体的要求，例如是否需要支持多行输入，分号隔开的多语句输入等。最终同学们作业大多呈现为 CLI (Command-Line Interface，俗称“命令行”) 下的单行输入、`|` 等符号作为列分隔符的多行输出。

现在我们希望能够在这方面进行一定的规范，以便手动检查和将来可能会到来的自动化测试。我们将手动检查时的模式称作“交互模式”，将面向自动化测试的模式称作“批处理模式”。

> **[info] 自动化测试**

> 截止 2021 年秋季学期尚未部署自动化测试，因此批处理模式不在检查范围之内。

> 但笔者仍然建议实现批处理模式以便黑盒自测。

## 运行模式

### 1. 交互模式

交互模式可以参考 MySQL 的模式，如下是一个示例

```SQL
mysql> SELECT * FROM student;
+------------+--------+-----------+------+
| id         | name   | status    | sex  |
+------------+--------+-----------+------+
| 2077310001 | 王五   | 博士生    | 男   |
| 2077010001 | 张三   | 本科生    | 男   |
| 2077210001 | 李四   | 硕士生    | 男   |
+------------+--------+-----------+------+
3 rows in set (0.000 sec)
mysql> SELECT COUNT(*)
    -> FROM
    -> student
    ->
    -> ;
+----------+
| COUNT(*) |
+----------+
|        3 |
+----------+
1 row in set (0.000 sec)
mysql>
```

交互模式不给出严格的要求，主要为了便于自己调试以及助教检查，能看出数据即可。仿照 MySQL 的 shell，以下给一些**可选地**参考实现细节：

- 输入时在左边给出前缀并给出当前使用的数据库名
- 跨行输入时给出规整前缀（无需考虑“修改上一行”的操作）
- 输入在最后一个字符是 `;` 后停止
- 尝试画表格边框以提高美观度
- 尝试计算出一列的最大宽度后输出时用空格补齐以保持规整
- 在输出表格后面给出行数和后端查询时间
- 输出某一字段时，对应列的表头采用 `<table_name>.<column_name>` 的格式输出（尤指 `JOIN` 意义下），当字段名没有歧义时可以只输出 `<column_name>` 以精简显示
- 输出聚合查询（若实现了该功能）时直接以 `SELECT` 后的 `selector` 作为对应列的表头即可。

> **[info] 没有歧义的字段名**

> 在多表查询下可能多张表有相同的字段，例如当我们多表查询 `course`, `course_detail`, `teacher` 时，如果表头显示 `name` 则会有 `course.name` 与 `teacher.name` 的歧义，而显示 `credit` 与 `course.credit` 均可确定地指明同一字段。

### 2. 批处理模式

批处理模式下我们不在乎输入输出的友好性，通常是从 stdin 或者一个 SQL 文件读入多行数据，再输出到 stdout 或一个指定文件。在使用 stdin 和 stdout 时常常搭配重定向。

批处理模式下的输出就如同做 OJ 一般不能夹带任何冗余信息，必须按照约定的格式给出数据，常见格式是用 tab 分隔符，如 MysQL 等成熟的数据库系统会支持包括 CSV、JSON 在内的多种输出方式自选。

方便起见我们为批处理模式做出如下约定：

- 输出统一使用的 CSV 格式的子集：同一行的不同字段间用英文逗号 `,` 分隔，**无需考虑数据包含逗号的二义性问题。**；
- 浮点数输出为两位小数；
- 无需考虑非 ASCII 字符的编码及长度问题，最终测试可以假定全是 ASCII 可打印字符（你自行测试时它很可能是由你终端的设置决定）；
- 不考虑语法错误、破坏完整性约束等输入错误的情形（对应内容的检查会在交互式模式下进行）；
- 无需输出执行时间；
- 使用命令行可选参数 `-b` 表示以批处理模式启动；
- 使用命令行可选参数 `-d <database>` 指定数据库名，即相当于已经执行了 `use <database>;`；
- 表头无需精简，同 `SELECT` 后的 `selector` 或 `*` （参考所提供的文法文件）一致即可，我们保证如果做自动测试则一定不会在 `selector` 中添加额外的空白符。

## 数据导入

考虑到部分同学实现大量 INSERT 时效率并不高，为了完成压力测试，我们需要新增一种操作将（被认为是安全的）数据直接导入数据库。

往常没有统一约定读入指令或参数，现在统一约定如下：

- 数据导入需要在批量模式下进行，且必须指定数据库；
- 使用命令行可选参数 `-f <path>` 指定导入文件的路径；
- 使用命令行可选参数 `-t <table>` 指定目标表名；

在上述约定下，假设我们编译得到的可执行程序是 `mydb`，则可以通过类似如下语句进行数据导入

```bash
./mydb -b -f path/to/data/student.txt -t student -d curriculum
```

数据格式则同批量模式输出一样采用 CSV，这里我们直接约定字符串中不会出现 `,`，因此可以很方便地手动解析。

## desc

往年实验没有为 `desc <table_name>` 的指令给出详细的内容要求，这里我们给出如下要求：

1. 首先输出一张表（格式同 SELECT），表中包含从左到右四列： Field、Type、Null、Default
2. 接下来输出主键信息
3. 然后输出外键信息
4. （如果实现了）按字典序输出 UNIQUE 信息
5. 最后按字典序输出索引信息

注意上面五部分中只有第一部分是一定有的（一张表至少有一列，我们的语法文件已经保证了这一点），剩下四部分如果没有则直接跳过，如果有则**一行一条信息**，每条信息后加分号。每一部分各条信息的顺序不作要求。

这里用举例的方法给出一个参考，注意这里相比后端约定章节中的 `student_course` 表多了几个字段用于演示 UNIQUE 与 INDEX，这里的 `index_field_A` 与 `index_field_a` 形成组合索引，而 `index_field_B` 是单列索引。

```SQL
mydb> desc student_course;
+---------------+-------------+------+---------+
| Field         | Type        | Null | Default |
+---------------+-------------+------+---------+
| student_id    | INT         | NO   | NULL    |
| course_id     | INT         | NO   | NULL    |
| course_number | INT         | NO   | NULL    |
| grade         | VARCHAR(3)  | YES  | NULL    |
| term          | VARCHAR(16) | NO   | NULL    |
| unique_field  | INT         | NO   | NULL    |
| index_field_A | INT         | NO   | NULL    |
| index_field_a | INT         | NO   | NULL    |
| index_field_B | INT         | NO   | NULL    |
+---------------+-------------+------+---------+
PRIMARY KEY (student_id, course_id, term);
FOREIGN KEY (student_id) REFERENCES student(id);
FOREIGN KEY course_id_number(course_id, course_number) REFERENCES course_detail(course_id, course_number);
UNIQUE (unique_field);
INDEX (index_field_A, index_field_a);
INDEX (index_field_B);
```

> **[info] Default NULL**

> 注意默认值显示为 `NULL` 有两种含义：当该字段有 `NOT NULL` 约束时，表示没有默认值，此时 `INSERT` 必须对该字段赋值；否则表示默认值为 `NULL`。


{% set authors = ["饶淙元"] %}

{% include "/footer.md" %}
