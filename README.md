问题：

    后台以二维数组存储导致房间缓存过大

    匹配时候取消（强制退出）处理

    下棋是是否可使用： 
        //发送确认信息
        socket.emit（'question'，'您认为吗？'，function（answer） {}）;
    以防止误触

    处理因为集群带来的通讯不一致问题：粘性会话

    setInterval返回Timeout无法序列化，使用Redis订阅过期通知

    主缓存策略问题：会产生缓存穿透等问题

    运行时redis允许键过期通知 config set notify-keyspace-events Ex

消息号：

    登录
        0登录请求         

    房间操作
        1进入游戏请求     返回房间列表
        2创建房间         返回房间号码
        3快速开始         返回房间号码
        4加入房间         返回房间号码
        5退出房间         返回结果

    游戏操作    
        100开始游戏       返回玩家颜色操作位颜色
        200游戏操作       fall/not/win
        300游戏结果       游戏结果

架构
    Dao 底层数据库交互
        interface
            ICache 
            IDataBase

            CacheImpl
            DataBaseImpl

    Manage 缓存方案：mysql+redis

    Service 提供服务：RoomHandle

    Game 游戏逻辑 具体游戏

    Server 服务器

技术栈：
    网络协议:socket.io
    进程管理（集群）：PM2
    日志：log4js

反思：
    返回值若为Promise则方法注释写好返回值防止遗忘后麻烦
    监听中尽量不要实例化对象
    在编程中尽量少使用any类型

内存泄漏原因：
    handle类实例化在监听连接中，导致内存泄漏

日志级别：
    一次请求在系统中循环用INFO级别描述

    
