# 4.5 对外提供的接口

```c++
class AbstractExecutor {
  void Init() = 0;
  bool Next(RID *rid) = 0;
}

class SeqScanExecutor: AbstractExecutor {
  void Init();
  bool Next(RID *rid);
}

class IndexScanExecutor: AbstractExecutor {
  void Init();
  bool Next(RID *rid);
}

class NestedLoopJoinExecutor: AbstractExecutor {
  void Init();
  bool Next(RID *rid);
}

class SortMergeJoinExecutor: AbstractExecutor {
  void Init();
  bool Next(RID *rid);
}

class HashJoinExecutor: AbstractExecutor {
  void Init();
  bool Next(RID *rid);
}
```
