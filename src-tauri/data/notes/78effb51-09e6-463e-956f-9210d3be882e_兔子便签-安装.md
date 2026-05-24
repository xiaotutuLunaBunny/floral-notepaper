# 🌸 Floral Notepaper - Tauri 开发环境安装教程

> Ubuntu 24 / Debian 系 Linux 安装指南  
> 适用于：Tauri + Vite + Rust + Node.js 项目开发 🐰

---

# 📦 一、安装 Node.js 22

## 1. 安装 nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

刷新环境：

```bash
source ~/.bashrc
```

如果你使用 zsh：

```bash
source ~/.zshrc
```

---

## 2. 安装 Node.js 22

```bash
nvm install 22
```

切换版本：

```bash
nvm use 22
```

设置默认版本：

```bash
nvm alias default 22
```

检查版本：

```bash
node -v
npm -v
```

看到类似：

```bash
v22.16.0
10.x.x
```

说明安装成功 🎉

---

# 🦀 二、安装 Rust

## 安装 rustup

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

刷新环境变量：

```bash
source $HOME/.cargo/env
```

检查版本：

```bash
rustc -V
cargo -V
```

更新 Rust：

```bash
rustup update
```

---

# 🖥️ 三、安装 Tauri Linux 依赖

Ubuntu / Debian：

```bash
sudo apt update

sudo apt install -y \
pkg-config \
libdbus-1-dev \
build-essential \
libssl-dev \
libgtk-3-dev \
libwebkit2gtk-4.1-dev \
libayatana-appindicator3-dev \
librsvg2-dev
```

---

## ❗如果 libwebkit2gtk-4.1-dev 不存在

搜索可用包：

```bash
apt search libwebkit2gtk
```

如果只有：

```bash
libwebkit2gtk-4.0-dev
```

则安装：

```bash
sudo apt install libwebkit2gtk-4.0-dev
```

---

# 📁 四、进入项目目录

```bash
cd /xiaotutu/data/web/note/floral-notepaper
```

---

# 🧹 五、清理旧依赖（重要）

如果之前安装失败过，建议先清理：

```bash
rm -rf node_modules
rm -rf src-tauri/target
rm -f package-lock.json
```

清理 npm 缓存：

```bash
npm cache clean --force
```

---

# 📦 六、安装项目依赖

推荐使用 pnpm（更稳定）

## 安装 pnpm

```bash
npm install -g pnpm
```

---

## 安装项目依赖

```bash
pnpm install
```

或者：

```bash
npm install
```

---

# 🚀 七、启动项目

## pnpm 启动

```bash
pnpm tauri dev
```

---

## npm 启动

```bash
npm run tauri dev
```

---

# ✅ 启动成功标志

看到：

```bash
VITE v7.x ready
```

以及：

```bash
Running tauri dev
```

并弹出桌面窗口，即代表运行成功 🎉

---

# ❌ 八、常见错误解决

---

## 1. Node 版本过低

错误：

```bash
Vite requires Node.js version 20.19+
```

解决：

```bash
nvm install 22
nvm use 22
```

---

## 2. Cannot find native binding

错误：

```bash
Cannot find native binding
```

解决：

```bash
rm -rf node_modules
rm -f package-lock.json

npm cache clean --force

npm install
```

---

## 3. dbus-1.pc not found

错误：

```bash
Package dbus-1 was not found
```

解决：

```bash
sudo apt install libdbus-1-dev pkg-config
```

---

## 4. cargo build failed

先更新 Rust：

```bash
rustup update
```

然后重新构建：

```bash
npm run tauri dev
```

---

# 🌈 九、推荐开发工具

| 工具     | 推荐              |
| -------- | ----------------- |
| IDE      | WebStorm / VSCode |
| Rust IDE | RustRover         |
| UI框架   | TailwindCSS       |
| 数据库   | SQLite            |
| Git工具  | Fork              |

---

# 📂 十、推荐项目结构

```text
floral-notepaper
├── src                # 前端源码
├── src-tauri          # Rust 后端
├── public             # 静态资源
├── package.json
├── vite.config.ts
└── tauri.conf.json
```

---

# 🐰 最后

如果后面还遇到：

- GTK 缺失
- Rust 编译失败
- Tauri 打包失败
- WebKitGTK 问题
- AppImage 打包问题

基本都是 Linux 系统依赖问题，优先检查：

```bash
pkg-config
gtk
webkit2gtk
dbus
openssl
```

是否安装完整即可 🌸

Happy Coding ✨
