# 2.1 记录管理模块概述

## 数据库文件布局
可以在根目录下创建base和global两个目录：global目录中存储一些全局的系统表，如：数据库名和数据库ID的对应关系 ([pg_database](http://www.postgres.cn/docs/9.3/catalog-pg-database.html))。在base目录中，每个数据库对应一个子目录，子目录下也可以有一些系统表，如：关系 (包括表、索引) 名和关系ID的对应关系 ([pg_class](http://www.postgres.cn/docs/9.3/catalog-pg-class.html))。子目录下的表和索引都存储在单独的文件中，子目录和文件都以其ID命名。

## 文件的组织结构
为提高存储空间利用效率和管理的灵活性，文件被划分为页面 (如固定大小为4KB) 的集合，每个页面有唯一的标识符。页面的数据区被划分为一个个插槽，每个插槽中放置一条记录。这样，(文件路径，页号，槽号) 就与记录构成了一一对应的关系。某条记录的页号和槽号建议不要轻易修改，否则相关的索引也要修改。

## 表的元数据
表的元数据包括表的列数、各列的数据类型和长度、表的页数、约束 (检查约束、唯一约束、主键约束、外键约束) 等信息，可以在数据库目录下创建系统表存储 (参考[PostgreSQL的系统表](http://www.postgres.cn/docs/9.3/catalogs-overview.html))，简单的话也可以存储在表的前几页。

## 记录相关操作
1. 记录的序列化和反序列化。在字节序列和一条记录间相互转换。

2. 访问记录。根据数据库名和表名确定文件路径，根据页号和槽号找到记录的位置，通过反序列化解读出记录的内容。

3. 插入记录。先找到空闲空间，再插入记录的序列化表示；如果没有空闲空间可能需要向缓存管理模块申请新页。

4. 删除记录。先找到记录的位置，再将其删除；产生的碎片空闲空间视情况合并。

5. 更新记录。对于定长记录来说，物理组织结构不变；对于变长记录来说，与删除后插入类似。

## 一些测试相关的要求
我们要求的数据类型包括INT, FLOAT, VARCHAR(i)三种。其中INT为32位整型，FLOAT为单精度浮点型，VARCHAR为字符串，且用括号中的 i 表示字符串最大长度。在实际数据库中，VARCHAR会作为变长列存储，占用空间由具体字符串的实际长度决定；同学们在实现时将其作为定长列或变长列存储均可。

在基础功能中，我们限定一条记录的各列最大长度之和不会超过2048字节。我们希望保证一页至少能完整地存储一条记录。

{% set authors = ["孙昭言"] %}
{% include "/footer.md" %}