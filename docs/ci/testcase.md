# 测例格式


尽管理论上你可以在完全不了解测例的格式甚至内容的情况下写出一个符合要求的 DBMS，从而直接通过测例，但相信多数同学还是会在实验过程中遇到测例未通过的情况，或者希望自行构造一些测例来辅助 DEBUG，甚至评测器本身也会存在一些 BUG，因此在这里解释一下测例的格式。

## 1. 输入文件

测例的输入文件是 `.sql` 后缀的 SQL 文件，在文件头部用 SQL 注释语法标记了一些信息，它们定义了一些简易的键值对信息，用 SQL 单行注释符号 `--` 开头，在一个空格后追加 `@` 和键名，然后用 `:` 和空格隔开后面的值内容，下面是一个例子：

```SQL
-- @Name: comb-fk
-- @Depends: comb-pk
-- @Flags: comb fk
-- @Description: Combined foreign key testing
-- @Score: 2
```

依次可以看到：

- `Name`: 这个测例的名称为 `comb-fk`
- `Depends`: 该测例依赖另一个测例 `comb-pk`，这意味着只有 `comb-pk` 测例通过后 `comb-fk` 才会被执行，否则会放弃执行 `comb-fk`；如果存在多个依赖，则用空格隔开，例如 `-- @Depends: dep dep-1 dep-2`
- `Flags`: 启用该测例需要启用 flag `comb` 与 `fk`，和依赖一样用空格隔开多个 flag，只有当这些 flag 都被给定时才有可能启用该测例以及（直接或间接）依赖该测例的测例
- `Description`: 对该测例的描述，主要用于标注测例的意图
- `Score`: 通过该测例可以获得2分

注意理论上这些标记信息应该在文件头部，先后顺序不重要，但每个信息只能出现一次；不在文件头部或者重复信息属于未定义行为。

!!! warning "未定义行为"

    未定义行为的表现可能会随着评测器的升级而改变，例如在上面的例子中如果同一个信息出现两次，有可能是第一次的生效，有可能是第二次的生效，也有可能评测器报错，这取决于评测器的具体实现。

输入文件后面则是正常的 SQL 语句，每一行都是一个完整的以 `;` 结尾的一个 SQL 语句，对应文法文件的 `statement`，不会出现用 `;` 隔开的多个语句的情况。空行和 `--` 开头的注释行会被忽略。

# 2. 输出文件

输出文件也即测例的答案，但是注意 SQL 的答案和常规的 DSA OJ 不同，可以认为它充满了 Special Judge，每一个 SQL 语句的输出需要单独处理，因此我们使用分隔符来显式地拆分不同 SQL 的输出。

具体来说，输出文件在每一部分答案后面会增加 `@` 开头的一行作为结尾，`@` 后面的内容无关紧要，我们在样例中写了对应的 SQL 语句以提高可读性，如果你自己构造测例则对此没有要求。注意这和程序输出的要求是一致的，它们都需要保证输出的数据不会包含行首为 `@` 的数据，我们的测例会保证这一点。

在输出内容的前后增加一些空行是不会影响评测器的，评测器会忽略这些空行，例如假设目前有 `DB` 与 `DB2` 两个数据库，我们连续执行了两次 `SHOW DATABASES`，下面是一个可能的输出文件：

```
DATABASES
DB1
DB2

@SHOW DATABASES;

DATABASES
DB1
DB2
@SHOW DATABASES;
```

另外在排序上有一个无法绕过的问题：假设数据按列 $C$ 排序，那么对 $C$ 字段相同的两条记录来说它们的顺序可以是任意的。但是查询语句有可能并没有 `SELECT` 出 $C$，此时评测器不可能判断程序是否正确给出了顺序，在这种情况下只能放弃检查有序性。
在我们的测例里测试 `ORDER BY` 的地方会避免这种情况，保证 `SELECT` 了所有排序关键字，如果你自己构造测例需要留意这一点。
