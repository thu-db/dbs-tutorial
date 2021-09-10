# 1.4 对外提供的接口

```C++
typedef int FD;
typedef char *BufferType;

class FileManager
{
public:
  FileManager();
  ~FileManager();

  // 下面的 BufferType 可以自行考虑具体实现，但是内存管理上最好由缓存系统管理而非文件系统
  void createFile(string filename);
  FD openFile(string filename);
  void closeFile(FD fd);
  void removeFile(string filename);
  void readPage(FD fd, int pageID, BufferType buffer);
  void writePage(FD fd, int pageID, BufferType buffer);

  // 文档提到的另一种思路，上层系统直接传文件名
  void closeFile(string filename);
  void readPage(string filename, int pageID, BufferType buffer);
  void writePage(string filename, int pageID, BufferType buffer);
};

class BufferManager
{
public:
  BufferManager();
  ~BufferManager();

  // 这里只展示用 FD 的方法，如果采用文件名直传，则所有 FD 都可以改为文件名

  // 这些文件操作不一定需要，也可以实现成上层传文件名，底层自动处理打开、创建
  // 如果实现则直接调用 FileManager 的操作
  void createFile(string filename);
  FD openFile(string filename);
  void closeFile(FD fd);

  // 是否需要删文件的接口取决于你的系统实现
  void removeFile(string filename);

  // 1. 如果采用读引用的方法，则可以参考这两个接口，读写用的 buffer 空间由底层管理
  BufferType readPage(FD fd, int pageID);
  void markDirty(FD fd, int pageID);

  // 2. 如果采用读拷贝的方法，则可以参考这两个接口，读写用的 buffer 空间由上层管理
  void readPage(FD fd, int pageID, BufferType buffer);
  void writePage(FD fd, int pageID, BufferType buffer);
};
```

{% set authors = ["饶淙元"] %}
{% include "/footer.md" %}
