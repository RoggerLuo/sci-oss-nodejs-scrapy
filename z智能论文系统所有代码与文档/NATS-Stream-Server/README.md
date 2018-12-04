# NATS-Stream-Server
NATS-Stream-Server wtih Dockerize.


### 场景分析

（1）订阅者可以设置ackWait的值,设置后，当nats服务器发送msg给客户端经过ackWait时间后仍然没有收到订阅者的ack回应，则进行重发msg，连续重发两次（总共3次）都失败的情况下，相同subject，相同队列组(queueGroup)下如果有其他订阅者，nats服务器则选择另一个订阅者进行发送。


（2）对应订阅同一subject，同一queueGroup的订阅者而言，他们共同消费同一queueGroup里的msg,当（同一queueGroup）订阅者的client_id发生改变，但订阅者设置的durableName（记录订阅者消费msg的持久名称）一样，也不会影响已经消费了的msg

    记录消费情况的规则：

    a.没有区分queueGroup的情况:client_id+durableName

    b.同一queueGroup的订阅者：queueGroup+durableName

(3)对于发布者而言，client_id没有特别的作用，只是作为一个全局的标识