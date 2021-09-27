## 5.2 SQL语法简介

结构化查询语言(Structured Query Language)简称SQL，是一种数据库查询和程序设计语言，用于存取数据以及查询、更新和管理关系数据库系统；同时也是数据库脚本文件的扩展名。SQL是一门 ANSI 的标准计算机语言，用来访问和操作数据库系统。虽然作为一种数据库语言的基准，但是工业界数据库厂商大多都在SQL基准基础之上进行了一定程度的变化和拓展，导致了当今存在了大量不同版本的SQL文法规范。本次实验任务中，同学们仅需要重点关注于SQL语言中有关于**数据操作语言（DML）**和**数据定义语言（DDL）**的部分重点文法结构。

所有需要支持的文法已经在**sql.g4**文件中给出，文法对应的功能可以参阅文法手册。

由于SQL语句转抽象语法树的部分是编译原理课程已经充分研究的内容，所以第一个转化阶段不作为本次实验的重点内容，可以直接基于给出的文法文件利用antlr的访问者模式生成这一部分代码。解析器部分重点的实验内容为逻辑优化和物理优化的过程。

考虑到部分同学可能没有接触过编译原理课程的相关内容，在此给出利用antlr生成C++版本编译器基本代码的流程。
1. 配置JAVA环境
2. 访问www.antlr.org/download.html，下载最新版的的antlr4.jar文件
3. 通过如下指令可以生成最基本的C++版本编译器代码
```
java -jar <antlr4.jar文件路径> -Dlanguage=Cpp <sql.g4语法文件路径> -visitor -no-listener -o <生成代码文件输出路径>
```
4. 通过继承BaseVisitor可以在编译器中实现自定义的编译过程，从而实现编译器的设计
5. 在使用自动生成的antlr4代码时，需要下载对应版本的antlr4-runtime.h库文件并利用编译配置文件正确包含这一头文件
6. 解析SQL过程中使用生成代码的方式

  ```c++
  #include <string>
  #include "antlr4-runtime.h"

  // 包含你完成的Visitor类
  #include "YourVisitor.h"

  using namespace antlr4;

  // 返回类型根据你的visitor决定
  auto parse(std::String sSQL) {
    // 解析SQL语句sSQL的过程
    // 转化为输入流
    ANTLRInputStream sInputStream(sSQL);
    // 设置Lexer
    SQLLexer iLexer(&sInputStream);
    CommonTokenStream sTokenStream(&iLexer);
    // 设置Parser
    SQLParser iParser(&sTokenStream);
    auto iTree = iParser.program();
    // 构造你的visitor
    YourVisitor iVisitor{/*YourVisitor的构造函数*/};
    // visitor模式下执行SQL解析过程
    // --如果采用解释器方式可以在解析过程中完成执行过程（相对简单，但是很难进行进一步优化，功能上已经达到实验要求）
    // --如果采用编译器方式则需要生成自行设计的物理执行执行计划（相对复杂，易于进行进一步优化，希望有能力的同学自行调研尝试）
    auto iRes = iVisitor.visit(iTree);
    return iRes;
  }

  ```

7. 如果同学们没有接触过antlr，也可以使用自己熟悉的其他编译代码生成工具，但是需要保证能够支持要求的文法标准。

{% set authors = ["董昊文"] %}
{% include "/footer.md" %}
