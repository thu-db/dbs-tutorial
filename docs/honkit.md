# honkit 演示
markdown basic 语法均支持，见 https://www.markdownguide.org/basic-syntax/

此外有以下插件：

## alerts

> **[info] 信息标题**

> 这里是一些 info 级信息

> 注意文件里要空一行

分隔

> **[warning] 信息标题**

> 这里是一些 warning 级信息

分隔

> **[danger] 信息标题**

> 这里是一些 danger 级信息

分隔

> **[success] 信息标题**

> 这里是一些 success 级信息

注意如果没有上面的“分隔”将会出现渲染bug，导致它们被连起来


## chapter-fold

打开某个子目录时，其他展开的父目录会自动折叠，已自动生效。

## click-reveal

{% reveal %}

这就是 click-reveal 插件的效果。

{% endreveal %}

## code

为代码块增加行号以及“复制”按钮，已自动生效。

## codeblock-label

这可以给代码块添加 label，一般用于加文件名。

{% label %}main.cpp{% endlabel %}
```C
#include <stdio.h>
int main() {
    printf("hello world!\n");
    return 0;
}
```

## expandable-chapters-interactive

实现子目录折叠/展开效果，已自动生效。

## intopic-toc

在一页内的右上角生成目录，已自动生效。

## katex-pro

内联公式： $\sqrt{2} \approx 1.414$

公式块：

$$
\sqrt{3} \approx 1.732 \\
\sqrt{4} = 2 \\
...
$$

## search-plus

左上角的搜索插件优化，已自动生效。

## todo

用于支持 markdown 扩展语法的 checklist

- [ ] 未实现 1
- [ ] 未实现 2
    - [ ] 未实现 2-1
    - [x] 已实现 2-2
- [x] 已实现 3
- [x] 已实现 4
    - [x] 已实现 4-1
    - [x] 已实现 4-2

## include

以下用了 include 功能来加脚注，include 可以直接导入其他 md。

另外在 github 实现了自动加最后编辑时间的效果，这在本地（除非经过一定的操作）无法使用，本地测试时最后编辑时间为空属于正常现象。

{% include "/footer.md" %}
