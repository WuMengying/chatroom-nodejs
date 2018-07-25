window.onload = function(){  
    this.setTimeout(hiddenLoad, 1000);
};  
function hiddenLoad(){
    document.getElementById('loading').hidden = true;
}
function hiddenSuccess(){
    document.getElementById('successbox').hidden = true;
}
// 获取url里面的内容
var url = ["selectpicture=3.png","username=Anonymous"]; 
if (decodeURI(location.href).indexOf('?')!=-1)
    url = decodeURI(location.href).split('?')[1].split('&');

// 获取聊天内容框
var chatContent = document.getElementsByClassName('chat-content')[0];

// 获取聊天输入框
var editBox = document.getElementsByClassName('edit-box')[0];

// 获取聊天输入框发送按钮
var editButton = document.getElementsByClassName('edit-button')[0];

// 获取用户名栏
var userName = document.getElementsByClassName('user-name')[0];

// 获取在线人数栏
var onlineCount = document.getElementsByClassName('online-count')[0];

// 把登录页面的名称放在右侧
userName.innerHTML = url[1].split('=')[1];
var userImg = document.getElementsByClassName('user-img')[0];

// 把登录页面的头像放在右侧
userImg.src = 'img/' + url[0].split('=')[1];
var logOut = document.getElementsByClassName('log-out')[0];

// 换一题按钮
var btnpass = document.getElementsByClassName('btn-pass')[0];
btnpass.addEventListener('click', newTarget);
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

//词语列表
//var targetlist = ["apple","blueberries","orange","watermelon","lemon","grape","mango","peach","grape","cherry","mushroom","corn","carrot","potatoes","tomato","natto","cabbage","eggplant","cucumber","pumpkin","tricycle","bicycle","car","train","aircraft","ship","spacecraft","subway","bus","table","chair","sofa","wardrobe","bed","pillow","door","window","mirror","refrigerator","air conditioner","washing machine","television","computer","phone","oven","alarm clock","teacher","cook","police","nurse","waiter","programmer","singer","athlete","ceo","actor"];
var targetlist = ["apple","cherry"];
var task = {target: "apple", time: 0, compelete: 0};
var guess_history = [];
var _etarget = document.getElementsByClassName('guess-target')[0];
var _escore = document.getElementsByClassName('guess-score')[0];
function newTarget(){
    var wordidx = Math.floor(Math.random()*targetlist.length);
    console.log(wordidx);
    task.target = targetlist[wordidx];
    _etarget.innerHTML = task.target;
    task.time = 0;
    document.getElementsByClassName('guess-state')[0].innerHTML = task.time + "/5";
    guess_history = [];
}
var MAXTRY = 5;
function updateState(){
    _escore.innerHTML = task.compelete;
    document.getElementsByClassName('guess-state')[0].innerHTML = task.time + "/5";
}
// socket部分
var socket = io();

// 当接收到消息并且不是本机时生成聊天气泡
socket.on('message', function (information) {
    createOtherMessage(information);
});

// 当接收到有人连接进来
socket.on('connected', function (onlinecount) {
    console.log(onlinecount);
    onlineCount.innerHTML = 'Online:' + onlinecount;
});

// 当接收到有人断开后
socket.on('disconnected', function (onlinecount) {
    console.log(onlinecount);
    onlineCount.innerHTML = 'Online:' + onlinecount;
});

// 发送本机的消息
function sendMessage() {
    if (editBox.value != '') {
        var myInformation = {
            description: editBox.value,
            black_list: guess_history,
            target: task.target
        };
        socket.emit('message', myInformation);
        createMyMessage();
        editBox.value = '';
    }

};

// 生成本机的聊天气泡
function createMyMessage() {
    var myMessageBox = document.createElement('div');
    myMessageBox.className = 'my-message-box';

    var messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    var text = document.createElement('span');
    text.innerHTML = editBox.value;
    messageContent.appendChild(text);
    myMessageBox.appendChild(messageContent);

    var arrow = document.createElement('div')
    arrow.className = 'message-arrow';
    myMessageBox.appendChild(arrow);

    var userInformation = document.createElement('div');
    userInformation.className = 'user-information';
    var userChatImg = document.createElement('img');
    userChatImg.className = 'user-chat-img';
    userChatImg.src = userImg.src;
    var userChatName = document.createElement('div');
    userChatName.className = 'user-chat-name';
    userChatName.innerHTML = userName.textContent;
    userInformation.appendChild(userChatImg);
    userInformation.appendChild(userChatName);
    myMessageBox.appendChild(userInformation);

    chatContent.appendChild(myMessageBox);

    chatContent.scrollTop = chatContent.scrollHeight;
}

// 生成其他用户的聊天气泡
function createOtherMessage(information) {
    var otherMessageBox = document.createElement('div');
    otherMessageBox.className = 'other-message-box';

    var otherUserInformation = document.createElement('div');
    otherUserInformation.className = 'other-user-information';
    var userChatImg = document.createElement('img');
    userChatImg.className = 'user-chat-img';
    userChatImg.src = information.img;
    var userChatName = document.createElement('span');
    userChatName.className = 'user-chat-name';
    userChatName.innerHTML = information.name;
    otherUserInformation.appendChild(userChatImg);
    otherUserInformation.appendChild(userChatName);
    otherMessageBox.appendChild(otherUserInformation);

    var otherMessageArrow = document.createElement('div');
    otherMessageArrow.className = 'other-message-arrow';
    otherMessageBox.appendChild(otherMessageArrow);

    var otherMessageContent = document.createElement('div');
    otherMessageContent.className = 'other-message-content';
    var text = document.createElement('span');
    text.innerHTML = information.predict;
    otherMessageContent.appendChild(text);
    otherMessageBox.appendChild(otherMessageContent);
    var guesstype = "wrong";
    //guess
    if (information.predict == information.target){
        task.compelete+=1;
        newTarget();
        guesstype = "success";
    }
    else{
        task.time+=1;
        if (task.time >= MAXTRY){
            guesstype = "failed";
            newTarget();
        }else{
            guesstype = "wrong";
        }
    }

    var guessResult = document.createElement('div');
    guessResult.className = 'guess-result '+ guesstype;
    var text = document.createElement('span');
    if (guesstype == "wrong")
        text.innerHTML = "Try Again!";
    else
        text.innerHTML = guesstype;
    if (guesstype == "success"){
        userChatImg.src = "img/success.png";
        document.getElementById('successbox').hidden = false;
        setTimeout(hiddenSuccess,1000);
    }
    guessResult.appendChild(text);
    otherMessageBox.appendChild(guessResult);
    chatContent.appendChild(otherMessageBox);

    chatContent.scrollTop = chatContent.scrollHeight;
    //add guess history
    guess_history.push(information.predict);
    updateState();
}
