# 2.4 对外提供的接口
```C
class RecordManager {
  public:
    RecordManager    (FileManager &fm);            // 构造函数
    ~RecordManager   ();                           // 析构函数
    RC create_file   (const char *file_name);      // 创建文件
    RC destroy_file  (const char *file_name);      // 删除文件
    RC open_file     (const char *file_name);      // 通过缓存管理模块打开文件，并获取其fileID
    RC close_file    ();                           // 关闭fileID对应文件
    RC get_record    (int page_id, int slot_id, char *&pData);            
                                                   // 通过页号和槽号访问记录后，相应字节序列可以通过pData访问
    RC delete_record (int page_id, int slot_id);   // 删除特定记录
    RC insert_record (int page_id, int slot_id, const char *pData); 
                                                   // 将字节序列pData插入特定位置
    RC update_record (page_id, slot_id, const char *pData);
                                                   // 将特定位置记录更新为字节序列pData
  private:
    int fileID;
};
```