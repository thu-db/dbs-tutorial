# 数据库系统概论实验文档

文档用 honkit 编写，一些不同于 markdown 的语法使用说明见 [docs/honkit.md](docs/honkit.md)。

开发阶段暂时部署于 https://thu-db.github.io/dbs-tutorial/

暂时把 honkit 使用说明页也放进去了，后面会去掉。

~~文档全网可见，我们可能需要加个 LISENCE 来防止版权问题。~~

为了确保写出来的效果符合预期，本地测试还是很有必要的。本地测试需要有 npm 环境， npm install 安装依赖后，用 npm run serve 运行测试服务器，可以用以预览效果。

开发时会在 push 或 pr 到 master 分支后自动部署，push 到别的分支会触发 build 测试，因此可以先 push 到自己的分支确定 build 没问题再 merge 到 master（发 pr merge 或本地 merge 再 push 都可以）。

