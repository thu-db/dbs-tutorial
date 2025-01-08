# 容器环境

CI 运行环境实际上是一个 Linux 下的 Docker 容器，因此有必要在这里对环境细节进行相关说明。你也许可以从测例仓库的 Dockerfile 大概了解环境，但是对于某些没有指明版本的库，其实际版本取决于镜像 build 时机，并且在学期间通常不会主动升级（除非更新了 Dockerfile 从而要重新 build）。

## 整体说明

镜像基于 Debian 12（bookworm）构建，并安装了如下重要工具：

- `GCC`: 12.2.0
- `CMake`: 3.25.1
- `Make`: 4.3
- `Python`: 3.11.5
- `rustup`: 1.26.0
- `rustc`/`cargo`: 1.74.1

注意具体版本号在多数时候并不重要，你只需要知道它们是在学期初时安装即可，只有当你想使用一些很新的特性时可能需要查询版本来验证是否支持。

如果你需要安装其他依赖可能会比较麻烦，尤其是通常用 `apt` 安装的那些，它们通常需要 root 权限，而出于安全性考虑你并没有 root 权限。为此你可以考虑：

- 跟助教沟通以在 Dockerfile 中安装，但这取决于必要性，通常对于新语言的支持是不会被拒绝的，但是特别的构建工具可能会被视为非必要的
- 通过配置复杂的“编译”脚本来下载安装相关程序到家目录或 `./`，但需要注意容器只有清华内网的访问权限，并且需要小心地处理路径问题
- 直接将相关内容放在你的仓库中，例如对 C++ 的 Antlr4 runtime 就推荐采用这一模式，这通常用于在 C++ 环境下用一些可以从源代码编译的第三方库。注意不要直接将可执行程序放在你的仓库中
- （仅限部分支持的软件）用 `pip` 安装，从而可以转化成一个不需要 root 权限的情况

## Python 环境

对 Python 用户而言，镜像中已经用 pip 预装了以下库（此外还有它们的依赖库，这里没有列出）:

- `antlr4-python3-runtime`: 4.13.2
- `numpy`: 2.1.1
- `prettytable`: 3.11.0
- `PyYAML`: 6.0.2

如果你需要安装其他 pip 库，可以配置 `requirements.txt`，并将编译指令配置为 `pip install -r requirements.txt`。

## Rust 环境

镜像中配置了 `rustup`，并使用 `rustup` 安装了 `stable-x86_64-unknown-linux-gnu` 工具链。注意 profile 为 minimal，意味着默认只安装了 `rustc` `rust-std` 和 `cargo` 三个基本组件，如有特殊需要可以直接用 `rustup` 管理工具链和组件。

对于依赖库，虽然容器内配置了 TUNA 镜像站提供的 [crates.io 稀疏索引](https://mirrors.tuna.tsinghua.edu.cn/help/crates.io-index/)，但是该 registry 未提供下载服务，下载地址仍指向 crates.io，所以无法在内网环境中使用。

一种可行的办法是使用 [`cargo vendor`](https://doc.rust-lang.org/cargo/commands/cargo-vendor.html) 把依赖的 crate 的源代码保存到项目中并提交到 VCS。但是注意 `cargo vendor` 无法按架构过滤 crate，从而导致会出现类似 `windows_x86_64_msvc` 的无用内容，增加约 40MB 的体积。建议使用 [`cargo vendor-filterer`](https://github.com/coreos/cargo-vendor-filterer) 来只获取编译 `x86_64-unknown-linux-gnu` 架构所需要的内容，或手动删除此类 `windows_xxx` crate 内 `lib` 文件夹下的内容。

这里提供一个使用 `cargo vendor` 的配置文件供参考：

```toml
# .cargo/config.toml
[source.crates-io]
replace-with = "vendored-sources"

[source.vendored-sources]
directory = "vendor"

[net]
offline = true
```
