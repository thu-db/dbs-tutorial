# 6.3 连接算法

连接运算是关系代数中一个重要操作，也往往是最耗时的操作。本节我们仅讨论两表连接算法，且仅讨论等值连接，即形如 `SELECT * FROM A,B WHERE A.a=B.b` 查询的连接算法。

## 嵌套循环连接 (Nested Loop Join)

嵌套循环连接是两表连接最基本的算法，算法描述如下：

```
for each row r1 in t1 {
  for each row r2 in t2 {
    if r1, r2 satisfies join conditions
      join r1, r2
  }
}
```

嵌套循环连接存在多种改进方法，如数据库可以每次读取一个 block，减少 I/O 请求次数。考虑记录获取方式，即可得到基于块的嵌套循环连接算法 (Block Nested Loop Join)，算法描述如下：

```
for each block b1 of t1 {
  if b1 not in memory
    read b1 block b1 into memory
  for each row r1 in block b1 {
    for each block b2 of t2 {
      if b2 not in memory
        read block b2 into memory
      for each row r2 in b2 {
        if r1, r2 satisfies join conditions
          join r1, r2
      }
    }
  }
}
```

此外，如果内表在连接属性上有索引，则可以利用索引加速内循环，得到基于索引的循环连接算法 (Index Nested Loop Join)，有效提高连接效率。

## 排序归并连接 (Sort-Merge Join)

先将要连接的两个表在连接属性上排序，随后对排序后的表进行连接，算法描述如下：

```
sort A, B by join_key
i ← 0; j ← 0

while i < |A| and j < |B|:
  if A[i].key < B[j].key:
    i ← i + 1
  else if A[i].key > B[j].key:
    j ← j + 1
  else:
    key ← A[i].key
    start ← j

    while j < |B| and B[j].key == key:
      j ← j + 1

    while i < |A| and A[i].key == key:
      for t ← start to j - 1:
        emit concatenate(A[i], B[t])
      i ← i + 1
```

如果两张表在连接前已经在连接属性上排好序，则可以省去排序操作。此外，排序归并连接算法的输出结果也是在连接属性上排好序的，如果查询在连接属性上有 `order by` 子句，排序归并连接算法便可以直接给出有序结果。

## 哈希连接 (Hash Join)

对一张表进行哈希运算建立哈希表，哈希表的 key 为连接属性。对另一张表的每条记录，用哈希函数求得连接属性上的值，映射到哈希表上即可得到要连接的记录，算法描述如下：

```
H ← empty buckets                  // 每个桶保存记录列表

for a in A:
  H[h(a.key)].append(a)

for b in B:
  for a in H[h(b.key)]:
    if a.key == b.key:
      emit concatenate(a, b)
```

哈希连接算法效率较高，算法复杂度为 $O(T1+T2)$​，$T1$​ 和 $T2$​ 分别表示两张表记录的个数。但是哈希连接仅支持等值连接，且哈希表需要占用较大的内存空间，如果哈希表大小超出内存空间限制，则需要将哈希表写入临时文件。