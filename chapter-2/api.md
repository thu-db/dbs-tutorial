# 2.4 对外提供的接口（仅供参考）

```C++
class RecordHandler {
  public:
       RecordHandler  ();                     // 构造函数
       ~RecordHandler ();                     // 析构函数
    RC CreateFile     (const char *fileName); // 创建文件
    RC DestroyFile    (const char *fileName); // 删除文件
    RC OpenFile       (const char *fileName); // 通过缓存管理模块打开文件，并获取其句柄
    RC CloseFile      ();                     // 关闭fileID对应文件
    RC GetRecord      (const RID &rid, char *&pData);            
                                              // 通过页号和槽号访问记录后，相应字节序列可以通过pData访问
    RC DeleteRecord   (const RID &rid);       // 删除特定记录
    RC InsertRecord   (const RID &rid, const char *pData); 
                                              // 将字节序列pData插入特定位置
    RC UpdateRecord   (const RID &rid, const char *pData);
                                              // 将特定位置记录更新为字节序列pData
};
```

<!-- {% set authors = ["孙昭言"] %} -->
{% include "/footer.md" %}
