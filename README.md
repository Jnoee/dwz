项目简介
======
该项目从DWZ UI框架分支出来，因为DWZ已经很长时间无人维护了。

DWZ适合用来做后台管理系统的UI框架，组件基本够用。
其优势是学习成本低，通过给HTML标签增加属性来自动渲染组件，很少需要写js代码。
此外该框架是一个单页面UI框架，所有页面加载都通过ajax请求加载。
开发人员可以像开发普通HTML页面一样写页面代码，对开发效率有较高的提升。

框架基于jquery，js代码按组件分开非常清晰，具备jquery基础的同学很容易读懂并进行扩展。
目前本项目从csdn上获取了两年前的DWZ的最新代码，由于有不少bug，做了一些修改使其可用。

做了哪些修改
======
* 删除了dwz.frag.xml文件，移到dwz.core.js中。
* 修复了一些明显的bug。
* 修改了表单验证提示信息展现方式。

关于文档
======
DWZ有一份文档，不过内容相当不全，建议直接看页面代码和js代码。

如何开始
======
1. firefox
因为需要从本地加载awesome字体，并且字体目录在css文件下子目录中，加载字体会失败，导致看不到按钮图标。
该问题已有人提交了bug，不知何时可以修复，目前可以通过修改firefox的安全策略来解决：
在地址栏输入 about:config 并找到 security.fileuri.strict_origin_policy 设置为 false。
设置好以后直接打开 demo/index.html 即可查看示例。

2. chrome
chrome浏览器默认不允许通过ajax读取本地文件，需要在启动chrome时增加  --allow-file-access-from-files 参数。
可以修改chrome启动的快捷方式文件加上该参数。
设置好以后直接打开 demo/index.html 即可查看示例。