var url = decodeURI(location.href).split('?')[1].split('&');
var chatContent = document.getElementsByClassName('chat-content')[0];
var editBox = document.getElementsByClassName('edit-box')[0];
var editButton = document.getElementsByClassName('edit-button')[0];
var userName = document.getElementsByClassName('user-name')[0];
// 把登录页面的名称放在右侧
userName.innerHTML = url[1].split('=')[1];
var userImg = document.getElementsByClassName('user-img')[0];
// 把登录页面的头像放在右侧
userImg.src = 'img/' + url[0].split('=')[1];
var logOut = document.getElementsByClassName('log-out')[0];
// 0.8s获取有无新的聊天内容
var get = setInterval(getTime, 800);
// 发送按钮绑定点击事件
editButton.addEventListener('click', sendMessage);
// 登出按钮绑定点击事件
logOut.addEventListener('click', closePage);
// 绑定Enter键和发送事件
document.onkeydown = function (event) {
    var e = event || window.event;
    if (e && e.keyCode === 13) {
        if (editBox.value !== '') {
            editButton.click();
        }
    }
};
// 关闭页面
function closePage() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
        window.location.href = "about:blank";
    } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
}

// 发送本机的消息
function sendMessage() {
    $.ajax({
        url: "http://119.29.3.75:8080/chatroom/1",
        type: "get",
        dataType: "jsonp",
        jsonp: "jsoncallback",
        jsonpCallback: "jsonpCallback_success",
        data: {
            'username': encodeURI(url[1].split('=')[1]),
            'content': encodeURI(editBox.value),
            'picture': encodeURI('img/' + url[0].split('=')[1])
        },
        success: function (data) {
            if (data.time != null && data.time != undefined && encodeURI(editBox.value) != null) {
                createMyMessage(data);
            }
        },
        error: function () {
            console.log("error");
        }
    });
}

// 生成本机发送的消息气泡
//<div class="my-message-box">
//     <ul class="message-arrow">
//         <li>
//              <span class="my-message">message</span>
//             <div class="my-arrow"></div>
//              <span class="time">time</span>
//          </li>
//         <li>
//              <img class="message-img" src="img/x.png">
//              <span class="name">name</span>
//          </li>
//     </ul>
// </div>

function createMyMessage(data) {
    // 最外层
    var messageBox = document.createElement('div');
    messageBox.setAttribute('class', 'my-message-box');
    // 内层ul
    var ul = document.createElement('ul');
    ul.setAttribute('class', 'message-arrow');
    // 消息内容
    var li1 = document.createElement('li');
    var myMessage = document.createElement('span');
    myMessage.setAttribute('class', 'my-message');
    myMessage.innerHTML = editBox.value;
    li1.appendChild(myMessage);
    // 气泡箭头
    var arrow = document.createElement('div');
    arrow.setAttribute('class', 'my-arrow');
    li1.appendChild(arrow);
    // 消息时间
    var time = document.createElement('span');
    time.setAttribute('class', 'time');
    time.innerHTML = data.time;
    li1.appendChild(time);
    // 头像
    var li2 = document.createElement('li');
    var userimg = document.createElement('img');
    userimg.setAttribute('class', 'message-img');
    userimg.src = userImg.src;
    li2.appendChild(userimg);
    // 用户名
    var name = document.createElement('span');
    name.setAttribute('class', 'name');
    name.innerHTML = userName.textContent;
    li2.appendChild(name);
    // 打包所有内容
    ul.appendChild(li1);
    ul.appendChild(li2);
    messageBox.appendChild(ul);
    // 插入到聊天框
    chatContent.appendChild(messageBox);
    // 清除发送后的输入框内容
    editBox.value = '';
    // 把聊天内容框拉到最下面
    chatContent.scrollTop = chatContent.scrollHeight;
}

// 生成其他用户的消息气泡
//<div class="other-message-box">
//    <ul class="message-arrow">
//        <li>
//          <img class="message-img" src="img/x.png">
//          <span class="name">name</span>
//         </li>
//        <li>
//            <div class="other-arrow"></div>
//             <span class="other-message">message</span>
//              <span class="time">time</span>
//          </li>
//    </ul>
//</div>

function createOtherMessage(data) {
    // 最外层
    var messageBox = document.createElement('div');
    messageBox.setAttribute('class', 'other-message-box');
    // 内层
    var ul = document.createElement('ul');
    ul.setAttribute('class', 'message-arrow');
    var li1 = document.createElement('li');
    // 头像
    var userimg = document.createElement('img');
    userimg.setAttribute('class', 'message-img');
    userimg.src = data.picture;
    li1.appendChild(userimg);
    // 用户名
    var name = document.createElement('span');
    name.setAttribute('class', 'name');
    name.innerHTML = data.name;
    li1.appendChild(name);
    var li2 = document.createElement('li');
    // 箭头
    var arrow = document.createElement('div');
    arrow.setAttribute('class', 'other-arrow');
    li2.appendChild(arrow);
    // 气泡消息
    var otherMessage = document.createElement('span');
    otherMessage.setAttribute('class', 'other-message');
    otherMessage.innerHTML = data.content;
    li2.appendChild(otherMessage);
    // 时间
    var time = document.createElement('span');
    time.setAttribute('class', 'time');
    var now = new Date();
    time.innerHTML = data.time;
    li2.appendChild(time);
    // 打包所有内容
    ul.appendChild(li1);
    ul.appendChild(li2);
    messageBox.appendChild(ul);
    // 插入到聊天框
    chatContent.appendChild(messageBox);
    // 把聊天内容框拉到最下面
    chatContent.scrollTop = chatContent.scrollHeight;
}
// 利用服务器当前事件请求聊天内容
function getMessage(time) {
    $.ajax({
        url: "http://119.29.3.75:8080/chatroom/2",
        type: "get",
        dataType: "jsonp",
        jsonp: "jsoncallback",
        jsonpCallback: "jsonpCallback_success",
        data: {
            'time': time
        },
        success: function (data) {
            console.log(data);
            if (data.content !== 'null' & userName.textContent !== data.name) {
                createOtherMessage(data);
            }
        },
        error: function () {
            console.log("error");
        }
    });
};
// 获取服务器当前事件
function getTime() {
    $.ajax({
        url: "http://119.29.3.75:8080/chatroom/3",
        type: "get",
        dataType: "jsonp",
        jsonp: "jsoncallback",
        jsonpCallback: "jsonpCallback_success",
        success: function (data) {
            getMessage(data.time)
        },
        error: function () {
            console.log("error");
        }
    });
}