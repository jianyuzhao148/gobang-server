问题：

    后台以二维数组存储导致房间缓存过大
    cache缓存过多时处理
    匹配时候取消（强制退出）处理
    下棋是是否可使用： 
        //发送确认信息
        socket.emit（'question'，'您认为吗？'，function（answer） {}）;
    以防止误触

    处理因为集群带来的通讯不一致问题：粘性会话

    setInterval返回Timeout无法序列化，使用Redis订阅过期通知

    主缓存策略问题：会产生缓存穿透等问题

    
    

消息号：
    100开始游戏返回{roomNum, colors, state=color}
    200计时器返回
    300游戏操作返回
    500游戏结果返回 




运行时redis允许键过期通知 config set notify-keyspace-events Ex


Dao 底层数据库交互，日志多
    interface
        ICache 
        IDataBase
    implement
        CacheImpl
        DataBaseImpl
Manage 缓存方案：mysql+redis

Service 提供服务：RoomHandle

Game 游戏逻辑 具体游戏

Server 服务器

技术栈：
    进程管理（集群）：PM2
    日志：log4js





    
