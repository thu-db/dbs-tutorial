# Summary

## 总述
* [实验简介](README.md)
* step 0: 整体介绍
    * [0.1 概述](chapter-0/intro.md)
    * [0.2 后端约定](chapter-0/backend.md)
    * [0.3 前端约定](chapter-0/frontend.md)

## 底层支持
* step 1: 文件管理
    * [1.1 文件管理模块概述](chapter-1/intro.md)
    * [1.2 页式文件系统设计](chapter-1/page.md)
    * [1.3 LRU 缓存设计](chapter-1/buffer.md)
    * [1.4 对外提供接口](chapter-1/api.md)
* step 2: 记录管理
    * [2.1 记录管理模块概述](chapter-2/intro.md)
    * [2.2 记录页面的设计模式-定长记录](chapter-2/fixed.md)
    * [2.3 记录页面的设计模式-变长记录](chapter-2/variable.md)
    * [2.4 对外提供的接口](chapter-2/api.md)
* step 3: 索引管理
    * [3.1 索引管理模块概述](chapter-3/intro.md)
    * [3.2 索引结构-B树和B+树](chapter-3/btree.md)
    * [3.3 更多的索引结构（阅读内容）](chapter-3/ds.md)
    * [3.4 对外提供的接口](chapter-3/api.md)

## 解析与执行
* step 4: 查询处理和执行器
    * [4.1 概述](chapter-4/4-1-overview.md)
    * [4.2 扫描算法](chapter-4/4-2-scan.md)
    * [4.3 连接算法](chapter-4/4-3-join.md)
    * [4.4 查询执行](chapter-4/4-4-execution.md)
    * [4.5 对外提供的接口](chapter-4/4-5-api.md)
* step 5: 解析器
    * [5.1 概述](chapter-5/5_1_intro.md)
    * [5.2 SQL简介](chapter-5/5_2_sql.md)
    * [5.3 逻辑优化](chapter-5/5_3_logic.md)
    * [5.4 物理优化](chapter-5/5_4_physic.md)

## 系统管理
* step 6: 系统管理
* step 7: 总结

## 附录
* [FAQ](extra/faq.md)
* [附件](extra/files.md)
