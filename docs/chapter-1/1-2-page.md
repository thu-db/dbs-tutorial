# 1.2 页式文件系统

## 总述

首先大前提是我们采用的二进制文件而非文本文件作为数据库文件的存储形式，下面需要考虑数据将以何种形式写入二进制文件。我们可以将文件按照固定大小拆分，从而磁盘上的文件读写都以这样的大小作为最小单元，我们将这样的最小单元称作“一页”。一般来说出于对齐等考虑，页的大小会设计成 2 的次幂数，我们在本章以 8192 字节为例（参考实现中也采用了这个大小）。

如果已经确定了页式，那么文件在我们眼中将从一个很大的字节数组变成若干页，我们将不再使用一个字节的位置来访问数据，而是使用 (页号, 页内偏移) 的二元组。例如 (6, 66) 表示文件内下标为 $ 6 \times 8192 + 66 = 49218 $ 的字节。

我们应该尽量在一页之内读写数据，即尽量避免一条记录跨越两页的情况。这不可避免地会导致一些空间上的浪费，例如一页 8192 字节，我们使用了 8190 字节后想再插入一条 10 字节的记录，那么应该直接考虑下一页而非将它拆成 2 + 8 字节放在两页中。此时空出来的 2 字节就是一种空间碎片，但所幸它的比例非常小，在这种情况下我们的空间利用率可以达到 $ 8190 \div 8192 = 99.98\% $ ，这已经足够高。

当文件已有页不够用时，我们会在末尾再新加一页，因此文件的大小将始终是 8192B 的倍数。


## 记录槽位

大体上我们可以将页分为数据页和索引页，前者用于存记录，后者用于存索引。*这两种数据页类型并不需要在页式文件系统里体现出来*，作为一个底层系统它只负责为上层提供页式的接口，但是我们有必要站在更上层的角度来看看页式系统到底起到了什么样的作用。

以后端约定章节的 student 表为例，它的字段（列）有一个 id INT，一个 name VARCHAR(32)，一个 sex VARCHAR(4)，一个 status VARCHAR(32)。INT 自然是 4 字节，因此如果假定没有其他数据，将各个字段按固定顺序和大小紧密地放在一起，就会有 72 字节。

假设一个人 id 为 `2077010001`，姓名 `张三`，性别 `男`，身份 `本科生`，汉字采用 UTF-8 编码（这几个汉字均为三字节），那么对应的记录可能如下所示（最下方一行表示编码得到的字节，低地址在左高地址在右）


|学号|姓名|性别|身份|
|---|---|---|---|
|2077010001|张三|男|本科生|
|51 A8 CC 7B|E5 BC A0 E4 B8 89 00 00 00 ... 00|E7 94 B7 00|E6 9C AC E7 A7 91 E7 94 9F 00 00 00 ... 00|

注意这里我们假定使用定长字符串存储字符串，因此多出来的部分补充了大量的 0 （用 `...` 省略），实际上如果实现了变长字符串可以避免这种浪费，但另一方面可能会额外需要一些空间存储字符串长度。

因此最终得到的 72 字节的一条记录如下所示：

```
51 A8 CC 7B E5 BC A0 E4 B8 89 00 00 00 00 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
E7 94 B7 00 E6 9C AC E7 A7 91 E7 94 9F 00 00 00 00 00
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
```

假设该表每条记录均用这样的定长 72 字节记录，那么一页至多能存 $ \lfloor \frac {8192} {72} \rfloor = 113 $ 条记录，剩余 56 字节，这 56 字节中的 $ \lceil \frac {113} {8} \rceil = 15$ 字节正好可以用来维护一个 bitmap 表示一条记录的位置是否被占用了。剩余 41 个字节可以用于指向下一页等页面元信息。

在上述约定下，一页中至多可以存 113 条记录，即使还没有插入记录，这些空间也已经被分配了，但是我们会用上述的 bitmap 暗示它们没有存有效数据，这种被预分配出来等待一条记录插入的位置称为槽 (slot)。一页空间被分为若干槽、记录槽状态的 bitmap 以及页面元信息。

页面空间的具体使用将在下一章记录管理模块详细介绍，下面来讨论下具体实现需要的工具。

!!!warning "一条记录的组成"

    尽管在上述例子里我们将一条记录设计成了其字段的连续堆积，但实际上也可以将定长改为变长，或者按行存储改为按列存储等。此外我们的数据库需要支持 NULL，因此还需要考虑其表示等。另外在一些常用数据库如 MySQL 中 VARCHAR 也不是单字节而是宽字符，上述例子仅仅是一个简单示意，页内数据的组织参考下一章记录管理模块的相关内容。

## 底层接口

那么要实现页式文件操作需要用到哪些底层接口呢？我们需要的操作包括：

- 创建文件：数据库最初可能空无一物，记录一定是从新建一个新文件开始
- 打开文件：以读写混合模式打开文件以进一步读写文件
- 关闭文件：关闭文件后操作系统会刷新文件缓存等，真正的磁盘访问或许发生在这一步，但这对我们透明
- 删除文件：尽管你的系统也可以通过一些 trick 避免删除文件，但是删除文件（夹）本身是很有必要的，例如删除数据表、索引、数据库时
- 文件偏移：我们需要偏移到某一页开头的位置，以便接下里读取一页或写入一页
- 数据读取：需要允许我们将一页的数据一次性从文件读取到内存（此前理应已经完成了偏移设定）
- 数据写入：需要允许我们将一页的数据一次性从内存写入到文件（此前理应已经完成了偏移设定）

上述操作对你来说不一定会感到自然，尤其是如果你此前的文件操作多为文本文件读写，可能会很不适应。但是在二进制文件读写时，这些是非常常见的底层操作，无论你用何种常见语言（如 C、C++、Java、Python、Go、Rust 等），用操作系统的接口还是语言标准库提供的接口，都应该能找到上述功能对应的接口。

!!!info "创建 & 打开文件"

    实际上很多语言/系统中创建与打开文件使用了同一接口，这主要是因为在常见接口中用只写 (Write Only) 方法打开文件本身就会起到删除原有文件、创建新文件的效果。不同实现方可能为这些接口起的名字很不相同（例如 Windows API 中使用 `CreateFileA`），需要查询相应文档以理解其使用方式。

在部分笔者了解的语言/系统上对应的函数如下：


|操作|Linux / Unix | C (stdio) | C++ (STL)|
| :---- | :------ | :---- | :---- |
|创建文件|open|fopen|fstream::open|
|打开文件|open|fopen|fstream::open|
|关闭文件|close|fclose|fstream::close|
|删除文件|unlink / rmdir|remove|filesystem::remove|
|文件偏移|lseek|fseek|fstream::seekp / fsteam::seekg|
|数据读取|read|fread|fstream::read|
|数据写入|write|fwrite|fstream::write|

!!!warning "跨平台实现"

    参考实现使用了 Linux/Unix 接口（`<fcntl.h>` 与 `<unistd.h>` 库中的函数），因此在 Windows 上无法使用。如果选择使用 C 或 C++ 的标准库能够（或许会付出性能代价）使你的程序支持跨平台，这本质上是标准库为你封装了不同操作系统的接口。我们的大作业原则上不对操作系统做要求，但是我们仍然建议你的程序能够支持 Linux，因此最好不要用 Windows 或 Mac 系统的接口。

由于你使用的文件操作库不同，因此文件操作所暴露出的东西也不同，例如 Windows 接口会得到句柄，Linux 接口会得到 fd 号，C 接口会得到 FILE 指针等，我们建议将这些东西存在文件管理器内，对外暴露一个统一的文件号，可能对应内部的数组下标或一个 map 的 key 等。在这种实现下你可以考虑将允许的文件号组成令牌环之类的结构，也可以不限制数量，用一个 map 来存储全局单增的文件号（我们可以不考虑在一次运行中累计开关几亿个文件导致文件号溢出的情况）。参考实现比较特殊，采用了 map + 令牌桶的组合形式 `MyBitMap`，实际容量为 128（可调），即至多允许同时打开 128 个不同的文件。

但另一方面，你也可以考虑直接让上层系统通过文件名加页号来访问数据，这种设计下上层系统甚至不需要打开文件的操作，直接读取某文件内容，让文件系统自己来判断是否需要打开操作。*在我们给出的 API 文档中给了接口的重载形式，可以选择性实现与使用。*

## 对外接口

无论你选择以何种语言、设计模式、命名风格，我们都应设计以下对外接口来供上层系统使用：

- CreateFile: 创建文件，对应参考实现中的 `FileManager::createFile`
- OpenFile: 打开文件，对应参考实现中的 `FileManager::openFile`
- CloseFile: 关闭文件，对应参考实现中的 `FileManager::closeFile`
- RemoveFile: 删除文件，参考实现中未实现该功能
- ReadPage: 读取文件中指定一页，对应参考实现中 `FileManager::readPage`
- WritePage: 写入文件中指定一页，对应参考实现中 `FileManager::writePage`

## 附录

探讨页式文件系统时会涉及到一些常用的2的次幂数以及通用符号：

$$
2^{10} = 1024 = 1k = 1K \newline
2^{12} = 4096 \newline
2^{13} = 8192 \newline
2^{20} = 2^{10} k = 1m = 1M \newline
2^{30} = 2^{10} m = 1g = 1G \newline
1 Byte = 1 B = 8 bit = 8b \newline
-2^{31} = -2147483648 \le int32 \le 2^{31} - 1 = 2147483647
$$

注意 k、m、g 这些字母通常不区分大小写，但是常常会跟在它们后面的 b/B 则会区分带小写，前者是比特 (bit)，表示 0/1 二进制位，后者是字节 (Byte) 表示八个二进制位，可以用于编码 -128 到 127 的符号整数或 0 到 255 的无符号整数。