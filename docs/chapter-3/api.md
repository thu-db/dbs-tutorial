# 3.4 对外提供的接口
```C
class IndexScan {  
  public:
       IndexScan    ();         // 构造函数
       ~IndexScan   ();         // 析构函数        
    RC GetNextEntry (RID &rid); // 类似于Python中的迭代器，不断调用获取下一个记录的位置
};

// 基础功能中，索引关键字只要求单列整型
class IndexHandler {
  public:
       IndexHandler  ();                     // 构造函数
       ~IndexHandler ();                     // 析构函数
    RC CreateIndex   (const char *fileName); // 创建索引
    RC DestroyIndex  (const char *fileName); // 删除索引
    RC OpenIndex     (const char *fileName); // 通过缓存管理模块打开索引，并获取其句柄
    RC CloseIndex    ();                     // 关闭索引
    RC Search        (int lowerBound, int upperBound, IndexScan &indexScan);            
                                             // 查找某个范围内的记录，结果通过迭代器访问
    RC DeleteRecord  (int lowerBound, int upperBound);       
                                             // 删除某个范围内的记录
    RC InsertRecord  (int key, const RID &rid); 
                                             // 插入某个记录的位置
    RC UpdateRecord  (int oldKey, const RID &oldRid, int newKey, const RID &newRid);
                                             // 更新特定记录的关键字或位置
};
```

{% set authors = ["孙昭言"] %}
{% include "/footer.md" %}
