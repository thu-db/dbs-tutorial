# 数据库系统概论实验文档

文档截止2022年用 honkit 编写，在2023年秋季开始改用 mkdocs。开发阶段暂时部署于 https://thu-db.github.io/dbs-tutorial/为了确保写出来的效果符合预期，本地测试还是很有必要的。本地测试需要有 Python 环境，`pip install -r requirements.txt` 安装依赖后，用 `mkdocs serve` 运行测试服务器，可以用以预览效果。

开发时会在 push 或 pr 到 master 分支后自动部署，push 到别的分支会触发 build 测试，因此可以先 push 到自己的分支确定 build 没问题再 merge 到 master（发 pr merge 或本地 merge 再 push 都可以）。
