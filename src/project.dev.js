require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CellModel":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dae88GCevBMaK7lQqhume8G', 'CellModel');
// Script/Model/CellModel.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = CellModel;

var _ConstValue = require("./ConstValue");

function CellModel() {
    this.type = null;
    this.status = _ConstValue.CELL_STATUS.COMMON;
    this.x = 1;
    this.y = 1;
    this.startX = 1;
    this.startY = 1;
    this.cmd = [];
    this.isDeath = false;
    this.objecCount = Math.floor(Math.random() * 1000);
}

CellModel.prototype.init = function (type) {
    this.type = type;
};

CellModel.prototype.isEmpty = function () {
    return this.type == _ConstValue.CELL_TYPE.EMPTY;
};

CellModel.prototype.setEmpty = function () {
    this.type = _ConstValue.CELL_TYPE.EMPTY;
};
CellModel.prototype.setXY = function (x, y) {
    this.x = x;
    this.y = y;
};

CellModel.prototype.setStartXY = function (x, y) {
    this.startX = x;
    this.startY = y;
};

CellModel.prototype.setStatus = function (status) {
    this.status = status;
};

CellModel.prototype.moveToAndBack = function (pos) {
    var srcPos = cc.p(this.x, this.y);
    this.cmd.push({
        action: "moveTo",
        keepTime: _ConstValue.ANITIME.TOUCH_MOVE,
        playTime: 0,
        pos: pos
    });
    this.cmd.push({
        action: "moveTo",
        keepTime: _ConstValue.ANITIME.TOUCH_MOVE,
        playTime: _ConstValue.ANITIME.TOUCH_MOVE,
        pos: srcPos
    });
};

CellModel.prototype.moveTo = function (pos, playTime) {
    var srcPos = cc.p(this.x, this.y);
    this.cmd.push({
        action: "moveTo",
        keepTime: _ConstValue.ANITIME.TOUCH_MOVE,
        playTime: playTime,
        pos: pos
    });
    this.x = pos.x;
    this.y = pos.y;
};

CellModel.prototype.toDie = function (playTime) {
    this.cmd.push({
        action: "toDie",
        playTime: playTime,
        keepTime: _ConstValue.ANITIME.DIE
    });
    this.isDeath = true;
};

CellModel.prototype.toShake = function (playTime) {
    this.cmd.push({
        action: "toShake",
        playTime: playTime,
        keepTime: _ConstValue.ANITIME.DIE_SHAKE
    });
};

CellModel.prototype.setVisible = function (playTime, isVisible) {
    this.cmd.push({
        action: "setVisible",
        playTime: playTime,
        keepTime: 0,
        isVisible: isVisible
    });
};

CellModel.prototype.moveToAndDie = function (pos) {};

CellModel.prototype.isBird = function () {
    return this.type == _ConstValue.CELL_TYPE.G;
};

cc._RFpop();
},{"./ConstValue":"ConstValue"}],"CellView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fbf19Cx4ptFV62UZ7+qJJpQ', 'CellView');
// Script/View/CellView.js

"use strict";

var _ConstValue = require("../Model/ConstValue");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        defaultFrame: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this.model = null;
        this.isSelect = false;
    },
    initWithModel: function initWithModel(model) {
        this.model = model;
        var x = model.startX;
        var y = model.startY;
        this.node.x = _ConstValue.CELL_WIDTH * (x - 0.5);
        this.node.y = _ConstValue.CELL_HEIGHT * (y - 0.5);
        // var animation  = this.node.getComponent(cc.Animation);
        // if (model.status == CELL_STATUS.COMMON){
        //     animation.stop();
        // }
        // else{
        //     animation.play(model.status);
        // }
    },
    updateView: function updateView() {
        var _this = this;

        var cmd = this.model.cmd;
        if (cmd.length <= 0) {
            return;
        }
        var actionArray = [];
        var curTime = 0;
        for (var i in cmd) {
            if (cmd[i].playTime > curTime) {
                var delay = cc.delayTime(cmd[i].playTime - curTime);
                actionArray.push(delay);
            }
            if (cmd[i].action == "moveTo") {
                var x = (cmd[i].pos.x - 0.5) * _ConstValue.CELL_WIDTH;
                var y = (cmd[i].pos.y - 0.5) * _ConstValue.CELL_HEIGHT;
                var move = cc.moveTo(_ConstValue.ANITIME.TOUCH_MOVE, cc.p(x, y));
                actionArray.push(move);
            } else if (cmd[i].action == "toDie") {
                if (this.status == _ConstValue.CELL_STATUS.BIRD) {
                    var animation = this.node.getComponent(cc.Animation);
                    animation.play("effect");
                    actionArray.push(cc.delayTime(_ConstValue.ANITIME.BOMB_BIRD_DELAY));
                }
                var callFunc = cc.callFunc(function () {
                    this.node.destroy();
                }, this);
                actionArray.push(callFunc);
            } else if (cmd[i].action == "setVisible") {
                (function () {
                    var isVisible = cmd[i].isVisible;
                    actionArray.push(cc.callFunc(function () {
                        if (isVisible) {
                            this.node.opacity = 255;
                        } else {
                            this.node.opacity = 0;
                        }
                    }, _this));
                })();
            } else if (cmd[i].action == "toShake") {
                var a = 0;
                var tmpAction = cc.rotateBy(0.4, 60);
                actionArray.push(tmpAction);
            }
            curTime = cmd[i].playTime + cmd[i].keepTime;
        }
        /**
         * 智障的引擎设计，一群SB
         */
        if (actionArray.length == 1) {
            this.node.runAction(actionArray[0]);
        } else {
            var _cc;

            this.node.runAction((_cc = cc).sequence.apply(_cc, actionArray));
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    setSelect: function setSelect(flag) {
        // var animation = this.node.getComponent(cc.Animation);
        // var bg = this.node.getChildByName("select");
        // if(flag == false && this.isSelect && this.model.status == CELL_STATUS.COMMON){
        //     animation.stop();
        //     this.node.getComponent(cc.Sprite).spriteFrame = this.defaultFrame;
        // }
        // // else if(flag && this.model.status == CELL_STATUS.COMMON){
        // //     animation.play(CELL_STATUS.CLICK);
        // // }
        // // else if(flag && this.model.status == CELL_STATUS.BIRD){
        // //     animation.play(CELL_STATUS.CLICK);
        // // }
        // bg.active = flag;
        this.isSelect = flag;
    }
});

cc._RFpop();
},{"../Model/ConstValue":"ConstValue"}],"ConstValue":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f9088esGbNBtJmNaJsz0Gq4', 'ConstValue');
// Script/Model/ConstValue.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CELL_TYPE = exports.CELL_TYPE = {
    EMPTY: 0,
    A: 1,
    B: 2,
    C: 3
};
var CELL_BASENUM = exports.CELL_BASENUM = 4;
var CELL_STATUS = exports.CELL_STATUS = {
    COMMON: 0,
    CLICK: "click",
    LINE: "line",
    COLUMN: "column",
    WRAP: "wrap",
    BIRD: "bird"
};

var GRID_WIDTH = exports.GRID_WIDTH = 5;
var GRID_HEIGHT = exports.GRID_HEIGHT = 5;

var CELL_WIDTH = exports.CELL_WIDTH = 135;
var CELL_HEIGHT = exports.CELL_HEIGHT = 133;

var GRID_PIXEL_WIDTH = exports.GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH;
var GRID_PIXEL_HEIGHT = exports.GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT;

// ********************   时间表  animation time **************************
var ANITIME = exports.ANITIME = {
    TOUCH_MOVE: 0.3,
    DIE: 0.2,
    DOWN: 0.5,
    BOMB_DELAY: 0.3,
    BOMB_BIRD_DELAY: 0.7,
    DIE_SHAKE: 0.4 // 死前抖动
};

cc._RFpop();
},{}],"EffectLayer":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0e925myn0dIjqdao1TpipF9', 'EffectLayer');
// Script/View/EffectLayer.js

"use strict";

var _ConstValue = require("../Model/ConstValue");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        bombWhite: {
            default: null,
            type: cc.Prefab
        },
        crushEffect: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},
    playEffects: function playEffects(effectQueue) {
        if (!effectQueue || effectQueue.length <= 0) {
            return;
        }
        effectQueue.forEach(function (cmd) {
            var delayTime = cc.delayTime(cmd.playTime);
            var callFunc = cc.callFunc(function () {
                var instantEffect = null;
                var animation = null;
                if (cmd.action == "crush") {
                    instantEffect = cc.instantiate(this.crushEffect);
                    animation = instantEffect.getComponent(cc.Animation);
                    animation.play("effect");
                } else if (cmd.action == "rowBomb") {
                    instantEffect = cc.instantiate(this.bombWhite);
                    animation = instantEffect.getComponent(cc.Animation);
                    animation.play("effect_line");
                } else if (cmd.action == "colBomb") {
                    instantEffect = cc.instantiate(this.bombWhite);
                    animation = instantEffect.getComponent(cc.Animation);
                    animation.play("effect_col");
                }

                instantEffect.x = _ConstValue.CELL_WIDTH * (cmd.pos.x - 0.5);
                instantEffect.y = _ConstValue.CELL_WIDTH * (cmd.pos.y - 0.5);
                instantEffect.parent = this.node;
                animation.on("finished", function () {
                    instantEffect.destroy();
                }, this);
            }, this);
            this.node.runAction(cc.sequence(delayTime, callFunc));
        }, this);
    }

});

cc._RFpop();
},{"../Model/ConstValue":"ConstValue"}],"GameController":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5ac64Iq16lBqrHZ0246FRcZ', 'GameController');
// Script/Controller/GameController.js

"use strict";

var _GameModel = require("../Model/GameModel");

var _GameModel2 = _interopRequireDefault(_GameModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        grid: {
            default: null,
            type: cc.Node
        },
        pro: cc.ProgressBar,
        game1: cc.Node,
        game2: cc.Node,
        fenshu: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.gameModel = new _GameModel2.default();
        this.gameModel.init();
        var gridScript = this.grid.getComponent("GridView");
        gridScript.setController(this);
        gridScript.initWithCellModels(this.gameModel.getCells());
        var animation = this.game2.getComponent(cc.Animation);
        animation.on('finished', this.gameStartEnd.bind(this));
    },

    update: function update() {
        // console.log(1 - progerssNum/100)
        this.fenshu.string = progerssNum;
    },

    gameStartEnd: function gameStartEnd() {
        this.game1.active = false;
        this.game2.active = false;
        this.time = 30;
        this.schedule(this.daojishi, 1);
    },
    daojishi: function daojishi() {

        this.time--;
        this.pro.progress = this.time / 30;
        if (this.tiem <= 0) {
            this.unschedule(this.daojishi);
            this.gameEnd();
        }
    },
    gameEnd: function gameEnd() {
        console.log('游戏结束啦');
    },

    selectCell: function selectCell(pos) {
        return this.gameModel.selectCell(pos);
    },
    cleanCmd: function cleanCmd() {
        this.gameModel.cleanCmd();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // }, 
});

cc._RFpop();
},{"../Model/GameModel":"GameModel"}],"GameModelTest":[function(require,module,exports){
"use strict";
cc._RFpush(module, '16fce9lOkpA7a2vuhmMkDMZ', 'GameModelTest');
// Script/UnitTest/GameModelTest.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    }

});

cc._RFpop();
},{}],"GameModel":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cc442HaMlBE/ZKi7W/YUKwd', 'GameModel');
// Script/Model/GameModel.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = GameModel;

var _CellModel = require("./CellModel");

var _CellModel2 = _interopRequireDefault(_CellModel);

var _ConstValue = require("./ConstValue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function GameModel() {
    this.cells = null;
    this.cellBgs = null;
    this.lastPos = cc.p(-1, -1);
    this.cellTypeNum = 3;
    this.cellCreateType = []; // 升成种类只在这个数组里面查找
}

GameModel.prototype.init = function (cellTypeNum) {
    this.cells = [];
    this.setCellTypeNum(cellTypeNum || this.cellTypeNum);
    for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
        this.cells[i] = [];
        for (var j = 1; j <= _ConstValue.GRID_HEIGHT; j++) {
            this.cells[i][j] = new _CellModel2.default();
        }
    }

    for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
        for (var j = 1; j <= _ConstValue.GRID_HEIGHT; j++) {
            var flag = true;
            while (flag) {
                flag = false;
                this.cells[i][j].init(this.getRandomCellType());
                var result = this.checkPoint(j, i)[0];
                if (result.length > 2) {
                    flag = true;
                }
                this.cells[i][j].setXY(j, i);
                this.cells[i][j].setStartXY(j, i);
            }
        }
    }
};

GameModel.prototype.initWithData = function (data) {
    // to do
};

GameModel.prototype.checkPoint = function (x, y) {
    var checkWithDirection = function checkWithDirection(x, y, direction) {
        var queue = [];
        var vis = [];
        vis[x + y * 5] = true;
        queue.push(cc.p(x, y));
        var front = 0;
        while (front < queue.length) {
            //let direction = [cc.p(0, -1), cc.p(0, 1), cc.p(1, 0), cc.p(-1, 0)];
            var point = queue[front];
            var cellModel = this.cells[point.y][point.x];
            front++;
            if (!cellModel) {
                continue;
            }
            for (var i = 0; i < direction.length; i++) {
                var tmpX = point.x + direction[i].x;
                var tmpY = point.y + direction[i].y;
                if (tmpX < 1 || tmpX > 5 || tmpY < 1 || tmpY > 5 || vis[tmpX + tmpY * 5] || !this.cells[tmpY][tmpX]) {
                    continue;
                }
                if (cellModel.type == this.cells[tmpY][tmpX].type) {
                    vis[tmpX + tmpY * 5] = true;
                    queue.push(cc.p(tmpX, tmpY));
                }
            }
        }
        return queue;
    };
    var rowResult = checkWithDirection.call(this, x, y, [cc.p(1, 0), cc.p(-1, 0)]);
    var colResult = checkWithDirection.call(this, x, y, [cc.p(0, -1), cc.p(0, 1)]);
    var result = [];
    var newCellStatus = "";
    // if(rowResult.length >= 5 || colResult.length >= 5){
    //     newCellStatus = CELL_STATUS.BIRD;
    // }
    // else if(rowResult.length >= 3 && colResult.length >= 3){
    //     newCellStatus = CELL_STATUS.WRAP;
    // }
    // else if(rowResult.length >= 4){
    //     newCellStatus = CELL_STATUS.LINE;
    // }
    // else if(colResult.length >= 4){
    //     newCellStatus = CELL_STATUS.COLUMN;
    // }
    if (rowResult.length >= 3) {
        result = rowResult;
    }
    if (colResult.length >= 3) {
        var tmp = result.concat();
        colResult.forEach(function (newEle) {
            var flag = false;
            tmp.forEach(function (oldEle) {
                if (newEle.x == oldEle.x && newEle.y == oldEle.y) {
                    flag = true;
                }
            }, this);
            if (!flag) {
                result.push(newEle);
            }
        }, this);
    }
    return [result, newCellStatus, this.cells[y][x].type];
};

GameModel.prototype.printInfo = function () {
    for (var i = 1; i <= 9; i++) {
        var printStr = "";
        for (var j = 1; j <= 9; j++) {
            printStr += this.cells[i][j].type + " ";
        }
        console.log(printStr);
    }
};

GameModel.prototype.getCells = function () {
    return this.cells;
};
// controller调用的主要入口
// 点击某个格子
GameModel.prototype.selectCell = function (pos) {

    this.changeModels = []; // 发生改变的model，将作为返回值，给view播动作
    this.effectsQueue = []; // 动物消失，爆炸等特效
    var lastPos = this.lastPos;
    var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);
    if (delta != 1) {
        this.lastPos = pos;
        return [[], []];
    }
    this.exchangeCell(lastPos, pos);
    var result1 = this.checkPoint(pos.x, pos.y)[0];
    var result2 = this.checkPoint(lastPos.x, lastPos.y)[0];
    this.curTime = 0; // 动画播放的当前时间
    this.pushToChangeModels(this.cells[pos.y][pos.x]);
    this.pushToChangeModels(this.cells[lastPos.y][lastPos.x]);
    var isCanBomb = this.cells[pos.y][pos.x].status != _ConstValue.CELL_STATUS.COMMON && // 判断两个是否是特殊的动物 
    this.cells[lastPos.y][lastPos.x].status != _ConstValue.CELL_STATUS.COMMON || this.cells[pos.y][pos.x].status == _ConstValue.CELL_STATUS.BIRD || this.cells[lastPos.y][lastPos.x].status == _ConstValue.CELL_STATUS.BIRD;
    if (result1.length < 3 && result2.length < 3 && !isCanBomb) {
        this.exchangeCell(lastPos, pos);
        this.cells[pos.y][pos.x].moveToAndBack(lastPos);
        this.cells[lastPos.y][lastPos.x].moveToAndBack(pos);
        this.lastPos = cc.p(-1, -1);
        return [this.changeModels];
    } else {
        this.lastPos = cc.p(-1, -1);
        this.cells[pos.y][pos.x].moveTo(pos, this.curTime);
        this.cells[lastPos.y][lastPos.x].moveTo(lastPos, this.curTime);
        var checkPoint = [pos, lastPos];
        this.curTime += _ConstValue.ANITIME.TOUCH_MOVE;
        this.processCrush(checkPoint);
        return [this.changeModels, this.effectsQueue];
    }
};
// 消除
GameModel.prototype.processCrush = function (checkPoint) {
    var cycleCount = 0;
    console.log(checkPoint);
    while (checkPoint.length > 0) {
        var bombModels = [];
        // if(cycleCount == 0 && checkPoint.length == 2){ //特殊消除
        //     let pos1= checkPoint[0];
        //     let pos2 = checkPoint[1];
        //     let model1 = this.cells[pos1.y][pos1.x];
        //     let model2 = this.cells[pos2.y][pos2.x];
        //     if(model1.status == CELL_STATUS.BIRD || model2.status ==  CELL_STATUS.BIRD){
        //         let bombModel = null;
        //         if(model1.status == CELL_STATUS.BIRD){
        //             model1.type = model2.type;
        //             bombModels.push(model1);
        //         }
        //         else{
        //             model2.type = model1.type;
        //             bombModels.push(model2);
        //         }
        //
        //     }
        // }
        for (var i in checkPoint) {
            var pos = checkPoint[i];
            if (!this.cells[pos.y][pos.x]) {
                continue;
            }
            var tmp = this.checkPoint(pos.x, pos.y);
            var result = tmp[0];
            var newCellStatus = tmp[1];
            var newCellType = tmp[2];

            if (result.length < 3) {
                continue;
            }
            console.log(result.length, result);
            progerssNum += result.length;
            console.log(progerssNum);
            for (var j in result) {
                var model = this.cells[result[j].y][result[j].x];
                this.crushCell(result[j].x, result[j].y);
                if (model.status != _ConstValue.CELL_STATUS.COMMON) {
                    bombModels.push(model);
                }
            }
            this.createNewCell(pos, newCellStatus, newCellType);
        }
        this.processBomb(bombModels);

        this.curTime += _ConstValue.ANITIME.DIE;
        checkPoint = this.down();
        cycleCount++;
    }
};
GameModel.prototype.createNewCell = function (pos, status, type) {
    // console.log(status,type)
    if (status == "") {

        return;
    }
    // if(status == CELL_STATUS.BIRD){
    //     type = CELL_TYPE.BIRD
    // }
    var model = new _CellModel2.default();
    this.cells[pos.y][pos.x] = model;
    model.init(type);
    model.setStartXY(pos.x, pos.y);
    model.setXY(pos.x, pos.y);
    model.setStatus(status);
    model.setVisible(0, false);
    model.setVisible(this.curTime, true);
    this.changeModels.push(model);
};
//
GameModel.prototype.down = function () {
    var newCheckPoint = [];
    for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
        for (var j = 1; j <= _ConstValue.GRID_HEIGHT; j++) {
            if (this.cells[i][j] == null) {
                var curRow = i;
                for (var k = curRow; k <= _ConstValue.GRID_HEIGHT; k++) {
                    if (this.cells[k][j]) {
                        this.pushToChangeModels(this.cells[k][j]);
                        newCheckPoint.push(this.cells[k][j]);
                        this.cells[curRow][j] = this.cells[k][j];
                        this.cells[k][j] = null;
                        this.cells[curRow][j].setXY(j, curRow);
                        this.cells[curRow][j].moveTo(cc.p(j, curRow), this.curTime);
                        curRow++;
                    }
                }
                var count = 1;
                for (var k = curRow; k <= _ConstValue.GRID_HEIGHT; k++) {
                    this.cells[k][j] = new _CellModel2.default();
                    this.cells[k][j].init(this.getRandomCellType());
                    this.cells[k][j].setStartXY(j, count + _ConstValue.GRID_HEIGHT);
                    this.cells[k][j].setXY(j, count + _ConstValue.GRID_HEIGHT);
                    this.cells[k][j].moveTo(cc.p(j, k), this.curTime);
                    count++;
                    this.changeModels.push(this.cells[k][j]);
                    newCheckPoint.push(this.cells[k][j]);
                }
            }
        }
    }
    this.curTime += _ConstValue.ANITIME.TOUCH_MOVE + 0.3;
    return newCheckPoint;
};

GameModel.prototype.pushToChangeModels = function (model) {
    if (this.changeModels.indexOf(model) != -1) {
        return;
    }
    this.changeModels.push(model);
};

GameModel.prototype.cleanCmd = function () {
    for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
        for (var j = 1; j <= _ConstValue.GRID_HEIGHT; j++) {
            if (this.cells[i][j]) {
                this.cells[i][j].cmd = [];
            }
        }
    }
};

GameModel.prototype.exchangeCell = function (pos1, pos2) {
    var tmpModel = this.cells[pos1.y][pos1.x];
    this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
    this.cells[pos1.y][pos1.x].x = pos1.x;
    this.cells[pos1.y][pos1.x].y = pos1.y;
    this.cells[pos2.y][pos2.x] = tmpModel;
    this.cells[pos2.y][pos2.x].x = pos2.x;
    this.cells[pos2.y][pos2.x].y = pos2.y;
};
// 设置种类
// Todo 改成乱序算法
GameModel.prototype.setCellTypeNum = function (num) {
    this.cellTypeNum = num;
    this.cellCreateType = [];
    for (var i = 1; i <= num; i++) {
        while (true) {
            var randomNum = Math.floor(Math.random() * _ConstValue.CELL_BASENUM);
            if (this.cellCreateType.indexOf(randomNum) == -1) {
                this.cellCreateType.push(randomNum);
                break;
            }
        }
    }
};
// 随要生成一个类型
GameModel.prototype.getRandomCellType = function () {
    var index = Math.floor(Math.random() * this.cellTypeNum);
    return this.cellCreateType[index];
};
// TODO bombModels去重
GameModel.prototype.processBomb = function (bombModels) {
    var _this = this;

    var _loop = function _loop() {
        var newBombModel = [];
        var bombTime = _ConstValue.ANITIME.BOMB_DELAY;
        bombModels.forEach(function (model) {
            if (model.status == _ConstValue.CELL_STATUS.LINE) {
                for (var i = 1; i <= _ConstValue.GRID_WIDTH; i++) {
                    if (this.cells[model.y][i]) {
                        if (this.cells[model.y][i].status != _ConstValue.CELL_STATUS.COMMON) {
                            newBombModel.push(this.cells[model.y][i]);
                        }
                        this.crushCell(i, model.y);
                    }
                }
                this.addRowBomb(this.curTime, cc.p(model.x, model.y));
            } else if (model.status == _ConstValue.CELL_STATUS.COLUMN) {
                for (var _i = 1; _i <= _ConstValue.GRID_HEIGHT; _i++) {
                    if (this.cells[_i][model.x]) {
                        if (this.cells[_i][model.x].status != _ConstValue.CELL_STATUS.COMMON) {
                            newBombModel.push(this.cells[_i][model.x]);
                        }
                        this.crushCell(model.x, _i);
                    }
                }
                this.addColBomb(this.curTime, cc.p(model.x, model.y));
            } else if (model.status == _ConstValue.CELL_STATUS.WRAP) {
                var x = model.x;
                var y = model.y;
                for (var _i2 = 1; _i2 <= _ConstValue.GRID_HEIGHT; _i2++) {
                    for (var j = 1; j <= _ConstValue.GRID_WIDTH; j++) {
                        var delta = Math.abs(x - j) + Math.abs(y - _i2);
                        if (this.cells[_i2][j] && delta <= 2) {
                            if (this.cells[_i2][j].status != _ConstValue.CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[_i2][j]);
                            }
                            this.crushCell(j, _i2);
                        }
                    }
                }
            } else if (model.status == _ConstValue.CELL_STATUS.BIRD) {
                var crushType = model.type;
                if (bombTime < _ConstValue.ANITIME.BOMB_BIRD_DELAY) {
                    bombTime = _ConstValue.ANITIME.BOMB_BIRD_DELAY;
                }
                if (crushType == _ConstValue.CELL_TYPE.BIRD) {
                    crushType = this.getRandomCellType();
                }
                for (var _i3 = 1; _i3 <= _ConstValue.GRID_HEIGHT; _i3++) {
                    for (var _j = 1; _j <= _ConstValue.GRID_WIDTH; _j++) {
                        if (this.cells[_i3][_j] && this.cells[_i3][_j].type == crushType) {
                            if (this.cells[_i3][_j].status != _ConstValue.CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[_i3][_j]);
                            }
                            this.crushCell(_j, _i3, true);
                        }
                    }
                }
                //this.crushCell(model.x, model.y);
            }
        }, _this);
        if (bombModels.length > 0) {
            _this.curTime += bombTime;
        }
        bombModels = newBombModel;
    };

    while (bombModels.length > 0) {
        _loop();
    }
};

GameModel.prototype.addCrushEffect = function (playTime, pos) {
    this.effectsQueue.push({
        playTime: playTime,
        pos: pos,
        action: "crush"
    });
};

GameModel.prototype.addRowBomb = function (playTime, pos) {
    this.effectsQueue.push({
        playTime: playTime,
        pos: pos,
        action: "rowBomb"
    });
};

GameModel.prototype.addColBomb = function (playTime, pos) {
    this.effectsQueue.push({
        playTime: playTime,
        pos: pos,
        action: "colBomb"
    });
};

GameModel.prototype.addWrapBomb = function (playTime, pos) {
    // TODO
};

GameModel.prototype.crushCell = function (x, y, needShake) {
    var model = this.cells[y][x];
    this.pushToChangeModels(model);
    if (needShake) {
        model.toShake(this.curTime);
        model.toDie(this.curTime + _ConstValue.ANITIME.DIE_SHAKE);
    } else {
        model.toDie(this.curTime);
    }
    this.addCrushEffect(this.curTime, cc.p(model.x, model.y));
    this.cells[y][x] = null;
};

cc._RFpop();
},{"./CellModel":"CellModel","./ConstValue":"ConstValue"}],"GridView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd0d1fDj9rlDx5QUtP+2toQV', 'GridView');
// Script/View/GridView.js

"use strict";

var _ConstValue = require("../Model/ConstValue");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        aniPre: {
            default: [],
            type: [cc.Prefab]
        },
        effectLayer: {
            default: null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.setListener();
        this.lastTouchPos = cc.Vec2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false; // 是否在播放中
    },
    setController: function setController(controller) {
        this.controller = controller;
    },

    initWithCellModels: function initWithCellModels(cellsModels) {
        this.cellViews = [];
        for (var i = 1; i <= 5; i++) {
            this.cellViews[i] = [];
            for (var j = 1; j <= 5; j++) {
                var type = cellsModels[i][j].type;
                var aniView = cc.instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(cellsModels[i][j]);
                this.cellViews[i][j] = aniView;
            }
        }
    },
    setListener: function setListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {
            if (this.isInPlayAni) {
                return true;
            }
            var touchPos = eventTouch.getLocation();
            var cellPos = this.convertTouchPosToCell(touchPos);
            if (cellPos) {
                var changeModels = this.selectCell(cellPos);
                if (changeModels.length >= 3) {
                    this.isCanMove = false;
                } else {
                    this.isCanMove = true;
                }
            } else {
                this.isCanMove = false;
            }
            return true;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (eventTouch) {
            if (this.isCanMove) {
                var startTouchPos = eventTouch.getStartLocation();
                var startCellPos = this.convertTouchPosToCell(startTouchPos);
                var touchPos = eventTouch.getLocation();
                var cellPos = this.convertTouchPosToCell(touchPos);
                if (startCellPos.x != cellPos.x || startCellPos.y != cellPos.y) {
                    this.isCanMove = false;
                    var changeModels = this.selectCell(cellPos);
                }
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (eventTouch) {
            // console.log("1111");
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (eventTouch) {
            // console.log("1111");
        }, this);
    },
    convertTouchPosToCell: function convertTouchPosToCell(pos) {
        pos = this.node.convertToNodeSpace(pos);
        if (pos.x < 0 || pos.x >= _ConstValue.GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= _ConstValue.GRID_PIXEL_HEIGHT) {
            return false;
        }
        var x = Math.floor(pos.x / _ConstValue.CELL_WIDTH) + 1;
        var y = Math.floor(pos.y / _ConstValue.CELL_HEIGHT) + 1;
        return cc.p(x, y);
    },
    updateView: function updateView(changeModels) {
        var newCellViewInfo = [];
        for (var i in changeModels) {
            var model = changeModels[i];
            var viewInfo = this.findViewByModel(model);
            var view = null;
            if (!viewInfo) {
                var type = model.type;
                var aniView = cc.instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(model);
                view = aniView;
            } else {
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
            }
            var cellScript = view.getComponent("CellView");
            cellScript.updateView();
            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            }
        }
        newCellViewInfo.forEach(function (ele) {
            var model = ele.model;
            this.cellViews[model.y][model.x] = ele.view;
        }, this);
    },
    updateSelect: function updateSelect(pos) {
        for (var i = 1; i <= 5; i++) {
            for (var j = 1; j <= 5; j++) {
                if (this.cellViews[i][j]) {
                    var cellScript = this.cellViews[i][j].getComponent("CellView");
                    if (pos.x == j && pos.y == i) {
                        cellScript.setSelect(true);
                    } else {
                        cellScript.setSelect(false);
                    }
                }
            }
        }
    },
    findViewByModel: function findViewByModel(model) {
        for (var i = 1; i <= 5; i++) {
            for (var j = 1; j <= 5; j++) {
                if (this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model) {
                    return { view: this.cellViews[i][j], x: j, y: i };
                }
            }
        }
        return null;
    },
    getPlayAniTime: function getPlayAniTime(changeModels) {
        if (!changeModels) {
            return 0;
        }
        var maxTime = 0;
        changeModels.forEach(function (ele) {
            ele.cmd.forEach(function (cmd) {
                if (maxTime < cmd.playTime + cmd.keepTime) {
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            }, this);
        }, this);
        return maxTime;
    },
    disableTouch: function disableTouch(time) {
        if (time <= 0) {
            return;
        }
        this.isInPlayAni = true;
        this.node.runAction(cc.sequence(cc.delayTime(time), cc.callFunc(function () {
            this.isInPlayAni = false;
            // progerssNum -=3;
        }, this)));
    },
    selectCell: function selectCell(cellPos) {
        var result = this.controller.selectCell(cellPos);
        var changeModels = result[0];
        var effectsQueue = result[1];
        this.playEffect(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels));
        this.updateView(changeModels);
        this.controller.cleanCmd();
        if (changeModels.length >= 2) {
            this.updateSelect(cc.p(-1, -1));
        } else {
            this.updateSelect(cellPos);
        }
        return changeModels;
    },
    playEffect: function playEffect(effectsQueue) {
        this.effectLayer.getComponent("EffectLayer").playEffects(effectsQueue);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{"../Model/ConstValue":"ConstValue"}]},{},["GameController","CellModel","ConstValue","GameModel","GameModelTest","CellView","EffectLayer","GridView"]);
