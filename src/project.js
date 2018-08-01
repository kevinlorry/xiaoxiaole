require = function e(t, s, i) {
    function o(c, n) {
        if (!s[c]) {
            if (!t[c]) {
                var h = "function" == typeof require && require;
                if (!n && h) return h(c, !0);
                if (l) return l(c, !0);
                var a = new Error("Cannot find module '" + c + "'");
                throw a.code = "MODULE_NOT_FOUND", a
            }
            var r = s[c] = {
                exports: {}
            };
            t[c][0].call(r.exports, function (e) {
                var s = t[c][1][e];
                return o(s || e)
            }, r, r.exports, e, t, s, i)
        }
        return s[c].exports
    }
    for (var l = "function" == typeof require && require, c = 0; c < i.length; c++) o(i[c]);
    return o
}({
    CellModel: [function (e, t, s) {
        "use strict";

        function i() {
            this.type = null, this.status = o.CELL_STATUS.COMMON, this.x = 1, this.y = 1, this.startX = 1, this.startY = 1, this.cmd = [], this.isDeath = !1, this.objecCount = Math.floor(1e3 * Math.random())
        }
        cc._RF.push(t, "dae88GCevBMaK7lQqhume8G", "CellModel"), Object.defineProperty(s, "__esModule", {
            value: !0
        }), s.default = i;
        var o = e("./ConstValue");
        i.prototype.init = function (e) {
            this.type = e
        }, i.prototype.isEmpty = function () {
            return this.type == o.CELL_TYPE.EMPTY
        }, i.prototype.setEmpty = function () {
            this.type = o.CELL_TYPE.EMPTY
        }, i.prototype.setXY = function (e, t) {
            this.x = e, this.y = t
        }, i.prototype.setStartXY = function (e, t) {
            this.startX = e, this.startY = t
        }, i.prototype.setStatus = function (e) {
            this.status = e
        }, i.prototype.moveToAndBack = function (e) {
            var t = cc.p(this.x, this.y);
            this.cmd.push({
                action: "moveTo",
                keepTime: o.ANITIME.TOUCH_MOVE,
                playTime: 0,
                pos: e
            }), this.cmd.push({
                action: "moveTo",
                keepTime: o.ANITIME.TOUCH_MOVE,
                playTime: o.ANITIME.TOUCH_MOVE,
                pos: t
            })
        }, i.prototype.moveTo = function (e, t) {
            cc.p(this.x, this.y);
            this.cmd.push({
                action: "moveTo",
                keepTime: o.ANITIME.TOUCH_MOVE,
                playTime: t,
                pos: e
            }), this.x = e.x, this.y = e.y
        }, i.prototype.toDie = function (e) {
            this.cmd.push({
                action: "toDie",
                playTime: e,
                keepTime: o.ANITIME.DIE
            }), this.isDeath = !0
        }, i.prototype.toShake = function (e) {
            this.cmd.push({
                action: "toShake",
                playTime: e,
                keepTime: o.ANITIME.DIE_SHAKE
            })
        }, i.prototype.setVisible = function (e, t) {
            this.cmd.push({
                action: "setVisible",
                playTime: e,
                keepTime: 0,
                isVisible: t
            })
        }, i.prototype.moveToAndDie = function (e) {}, i.prototype.isBird = function () {
            return this.type == o.CELL_TYPE.G
        }, t.exports = s.default, cc._RF.pop()
    }, {
        "./ConstValue": "ConstValue"
    }],
    CellView: [function (e, t, s) {
        "use strict";
        cc._RF.push(t, "fbf19Cx4ptFV62UZ7+qJJpQ", "CellView");
        var i = e("../Model/ConstValue");
        cc.Class({
            extends: cc.Component,
            properties: {
                defaultFrame: {
                    default: null,
                    type: cc.SpriteFrame
                }
            },
            onLoad: function () {
                this.isSelect = !1
            },
            initWithModel: function (e) {
                this.model = e;
                var t = e.startX,
                    s = e.startY;
                this.node.x = i.CELL_WIDTH * (t - .5), this.node.y = i.CELL_HEIGHT * (s - .5)
            },
            updateView: function () {
                var e = this,
                    t = this.model.cmd;
                if (!(t.length <= 0)) {
                    var s = [],
                        o = 0;
                    for (var l in t) {
                        if (t[l].playTime > o) {
                            var c = cc.delayTime(t[l].playTime - o);
                            s.push(c)
                        }
                        if ("moveTo" == t[l].action) {
                            var n = (t[l].pos.x - .5) * i.CELL_WIDTH,
                                h = (t[l].pos.y - .5) * i.CELL_HEIGHT,
                                a = cc.moveTo(i.ANITIME.TOUCH_MOVE, cc.p(n, h));
                            s.push(a)
                        } else if ("toDie" == t[l].action) {
                            this.status == i.CELL_STATUS.BIRD && (this.node.getComponent(cc.Animation).play("effect"), s.push(cc.delayTime(i.ANITIME.BOMB_BIRD_DELAY)));
                            var r = cc.callFunc(function () {
                                this.node.destroy()
                            }, this);
                            s.push(r)
                        } else if ("setVisible" == t[l].action) ! function () {
                            var i = t[l].isVisible;
                            s.push(cc.callFunc(function () {
                                this.node.opacity = i ? 255 : 0
                            }, e))
                        }();
                        else if ("toShake" == t[l].action) {
                            var u = cc.rotateBy(.4, 60);
                            s.push(u)
                        }
                        o = t[l].playTime + t[l].keepTime
                    }
                    if (1 == s.length) this.node.runAction(s[0]);
                    else {
                        var p;
                        this.node.runAction((p = cc).sequence.apply(p, s))
                    }
                }
            },
            setSelect: function (e) {
                this.isSelect = e
            }
        }), cc._RF.pop()
    }, {
        "../Model/ConstValue": "ConstValue"
    }],
    ConstValue: [function (e, t, s) {
        "use strict";
        cc._RF.push(t, "f9088esGbNBtJmNaJsz0Gq4", "ConstValue"), Object.defineProperty(s, "__esModule", {
            value: !0
        });
        s.CELL_TYPE = {
            EMPTY: 0,
            A: 1,
            B: 2,
            C: 3
        }, s.CELL_BASENUM = 4, s.CELL_STATUS = {
            COMMON: 0,
            CLICK: "click",
            LINE: "line",
            COLUMN: "column",
            WRAP: "wrap",
            BIRD: "bird"
        };
        var i = s.GRID_WIDTH = 5,
            o = s.GRID_HEIGHT = 5,
            l = s.CELL_WIDTH = 135,
            c = s.CELL_HEIGHT = 133;
        s.GRID_PIXEL_WIDTH = i * l, s.GRID_PIXEL_HEIGHT = o * c, s.ANITIME = {
            TOUCH_MOVE: .3,
            DIE: .2,
            DOWN: .5,
            BOMB_DELAY: .3,
            BOMB_BIRD_DELAY: .7,
            DIE_SHAKE: .4
        };
        cc._RF.pop()
    }, {}],
    EffectLayer: [function (e, t, s) {
        "use strict";
        cc._RF.push(t, "0e925myn0dIjqdao1TpipF9", "EffectLayer");
        var i = e("../Model/ConstValue");
        cc.Class({
            extends: cc.Component,
            properties: {
                bombWhite: {
                    default: null,
                    type: cc.Prefab
                },
                crushEffect: {
                    default: null,
                    type: cc.Prefab
                }
            },
            onLoad: function () {},
            playEffects: function (e) {
                !e || e.length <= 0 || e.forEach(function (e) {
                    var t = cc.delayTime(e.playTime),
                        s = cc.callFunc(function () {
                            var t = null,
                                s = null;
                            "crush" == e.action ? (s = (t = cc.instantiate(this.crushEffect)).getComponent(cc.Animation)).play("effect") : "rowBomb" == e.action ? (s = (t = cc.instantiate(this.bombWhite)).getComponent(cc.Animation)).play("effect_line") : "colBomb" == e.action && (s = (t = cc.instantiate(this.bombWhite)).getComponent(cc.Animation)).play("effect_col"), t.x = i.CELL_WIDTH * (e.pos.x - .5), t.y = i.CELL_WIDTH * (e.pos.y - .5), t.parent = this.node, s.on("finished", function () {
                                t.destroy()
                            }, this)
                        }, this);
                    this.node.runAction(cc.sequence(t, s))
                }, this)
            }
        }), cc._RF.pop()
    }, {
        "../Model/ConstValue": "ConstValue"
    }],
    GameController: [function (e, t, s) {
        "use strict";
        cc._RF.push(t, "5ac64Iq16lBqrHZ0246FRcZ", "GameController");
        var i = function (e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }(e("../Model/GameModel"));
        cc.Class({
            extends: cc.Component,
            properties: {
                grid: {
                    default: null,
                    type: cc.Node
                },
                pro: cc.ProgressBar,
                game1: cc.Node,
                game2: cc.Node,
                fenshu: cc.Label
            },
            onLoad: function () {
                this.gameModel = new i.default, this.gameModel.init();
                var e = this.grid.getComponent("GridView");
                e.setController(this), e.initWithCellModels(this.gameModel.getCells()), this.game2.getComponent(cc.Animation).on("finished", this.gameStartEnd.bind(this))

                $('.game-rule-btn').on('click', function () {
                    $('.game-rule-tip').fadeIn(0);
                })
                $('.close-btn').on('click', function () {
                    $('.game-rule-tip').fadeOut(0);
                })
                var provinceTxt = '';
                provinceTxt += "<option value=''>请选择</option>";
                for (var item in province) {
                    provinceTxt += "<option value='" + item + "'>" + province[item].name + "</option>";
                }
                $("#province").html(provinceTxt);
                $("#province").change(function () {
                    var cityList = new Array();
                    var cityArray = new Array();
                    cityList = province[$(this).find("option:selected").val()].city;
                    cityArray += "<option value=''>请选择</option>";
                    for (var item in cityList) {
                        cityArray += "<option value='" + item + "'>" + cityList[item].name + "</option>"
                    }
                    $("#city").html(cityArray);
                });
            },
            update: function () {
                this.fenshu.string = progerssNum
            },
            gameStartEnd: function () {
                this.game1.active = !1, this.game2.active = !1, this.time = 30, this.schedule(this.daojishi, 1)
            },
            daojishi: function () {
                this.time--, this.pro.progress = this.time / 30, this.time <= 0 && (this.unschedule(this.daojishi), this.gameEnd())
            },
            gameEnd: function () {
                $('.game-over-tip').fadeIn(0);
                $('.game-num').find('p').text('总分：' + progerssNum);
                $('.draw-btn').on('click', function () {
                    var latitude = localStorage.getItem('latitude') || '';
                    var longitude = localStorage.getItem('longitude') || '';
                    $.ajax({
                            url: '../../ajax/openApiController/redirectUrl?latitude=' + latitude + '&longitude=' + longitude,
                            type: 'get',
                            dataType: 'JSON',
                        })
                        .done(function (data) {
                            console.log(data);
                            if (data.resultCode == 0) {
                                if (data.resultData == 0) {
                                    location.href = 'result.html?type=1'
                                } else {
                                    draw(data.resultData)
                                }
                            } else {
                                if (data.resultCode == 2018) {
                                    location.href = "result.html?type=4"
                                }
                                layer.open({
                                    content: data.resultMessage,
                                    skin: 'msg',
                                    time: 2 //2秒后自动关闭
                                });
                            }
                        })
                        .fail(function () {
                            console.log('error');
                        })
                        .always(function () {
                            console.log('complete');
                        });
                })

                function draw(data) {
                    $('.game-over-tip').fadeOut(0);
                    if (data.prizeType == 1) {
                        $('.sw-tip').find('.sw-text').find('img').attr('src', data.prizeImg);
                        $('.sw-tip').find('.sw-text').find('p').text(data.prizeName);
                        $('.sw-tip').fadeIn(0);
                        $('.sw-lq-btn').on('click', function () {
                            $('.sw-tip').fadeOut(0);
                            $('.sw-yan-tip').fadeIn(0);
                        })
                    } else if (data.prizeType == 2) {
                        var price = data.price / 100;
                        $('.cashhb-tip').find('.cash-text').find('span').text(price);
                        $('.hb-yan-tip').find('.yan-text').find('span').text(price);
                        $('.cash-ff-tip').find('.cash-text').find('span').text(price);
                        $('.cash-dff-tip').find('.cash-text').find('span').text(price);
                        $('.cashhb-tip').fadeIn(0);
                        $('.cash-lq-btn').on('click', function () {
                            $('.cashhb-tip').fadeOut(0);
                            if (data.phone == 0) {
                                $('.hb-yan-tip').fadeIn(0);
                            } else {
                                if (data.auto == 0) {
                                    $('.cash-ff-tip').fadeIn(0)
                                } else {
                                    $('.cash-dff-tip').fadeIn(0)
                                }
                            }
                        })
                    }
                    $('.cash-qr-btn').on('click', function () {
                        var phone = $('.rel-phone');
                        var yzm = $('.rel-yanzheng');
                        // 电话验证
                        if ($(phone).val() == '' || $(phone).val() == undefined) {
                            layer.open({
                                content: '请输入电话号码',
                                skin: 'msg',
                                time: 2 //2秒后自动关闭
                            });
                            return false;
                        }
                        $.ajax({
                                url: '../../ajax/userAjaxController/exchangeBag',
                                type: 'post',
                                dataType: 'JSON',
                                data: {
                                    phone: $(phone).val(),
                                    code: $(yzm).val()
                                }
                            })
                            .done(function (res) {
                                if (res.resultCode == 0) {
                                    $('.hb-yan-tip').fadeOut(0);
                                    if (data.auto == 0) {
                                        $('.cash-ff-tip').fadeIn(0)
                                    } else {
                                        $('.cash-dff-tip').fadeIn(0)
                                    }
                                } else {
                                    layer.open({
                                        content: res.resultMessage,
                                        skin: 'msg',
                                        time: 2 //2秒后自动关闭
                                    });
                                }
                            })
                            .fail(function () {
                                console.log('error');
                            })
                            .always(function () {
                                console.log('complete');
                            });
                    });
                    $('.sw-qr-btn').on('click', function () {
                        if (cashPrize()) {
                            var username = $("#name").val();
                            var id_card = $("#idCard").val(); //身份证
                            var phone = $("#rel-phone").val();
                            var address = $("#address").val();
                            var _province = province[$('#province').find("option:selected").val()].name;
                            var _city = province[$('#province').find("option:selected").val()].city[$('#city').find("option:selected").val()].name;
                            $('.sw-cg-tip').find('.IdCorde').find('span').text(id_card)
                            $('.sw-cg-tip').find('.IdPhone').find('span').text(phone)
                            $('.sw-cg-tip').find('.IdAdd').find('span').text(_province + _city + address)
                            // var yanzheng = $(".rel-yanzheng").val(); //验证码
                            $.ajax({
                                    url: "../../ajax/userAjaxController/cashPrize",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        name: username,
                                        phone: phone,
                                        address: _province + _city + address,
                                        userCard: id_card,
                                    },
                                })
                                .done(function (res) {
                                    console.log(res);
                                    if (res.resultCode == 0) {
                                        $('.sw-yan-tip').fadeOut(0);
                                        $('.sw-cg-tip').fadeIn(0);
                                    } else {
                                        layer.open({
                                            content: res.resultMessage,
                                            skin: 'msg',
                                            time: 2 //2秒后自动关闭
                                        });
                                    }
                                })
                                .fail(function () {
                                    layer.open({
                                        content: '网络故障',
                                        skin: 'msg',
                                        time: 2 //2秒后自动关闭
                                    });
                                })
                        }
                    })
                }

                function cashPrize() {
                    var name = $("#name").val();
                    var id_card = $("#idCard").val(); //身份证
                    var phone = $("#rel-phone").val();
                    var address = $("#address").val();
                    var yanzheng = $(".rel-yanzheng").val(); //验证码
                    var province = $('#province').find("option:selected").val();
                    var city = $('#city').find("option:selected").val();
                    console.log(province, city);
                    var phone_res = /^\d{11}$/;
                    var id_card_res15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/
                    var id_card_res18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
                    if (name.length < 1) {
                        layer.open({
                            content: '请输入名字',
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else if (id_card.length < 1) { //else if(!id_cara_res.test(
                        layer.open({
                            content: "请输入身份证号码",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else if (!(id_card_res15.test(id_card) || id_card_res18.test(id_card))) {
                        layer.open({
                            content: "请输入正确的身份证号码",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else if (phone.length < 1 || phone == undefined) { //id_card)){alert("请输入正确的身份证号码");
                        layer.open({
                            content: "请输入手机号码",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else if (!phone_res.test(phone)) {
                        layer.open({
                            content: "请输入正确的手机号码",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else if (province.length < 1) {
                        layer.open({
                            content: "请选择省份",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else if (city.length < 1) {
                        layer.open({
                            content: "请选择城市",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else if (address.length < 1) {
                        layer.open({
                            content: "请输入收货地址",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else {
                        return true;
                    }
                    return false;
                    // return true;
                }
                //获取验证
                function isPhone() {
                    var phone = $(".rel-phone").val();
                    $.ajax({
                        url: '../../ajax/userAjaxController/smsCode',
                        type: "post",
                        data: {
                            sign: name,
                            phone: phone,
                        },
                        success: function () {},
                        error: function () {
                            layer.open({
                                content: "系统繁忙",
                                skin: 'msg',
                                time: 2 //2秒后自动关闭
                            });

                        }
                    });
                    return true;
                }
                // 点击获取验证码
                $(".huoquyzm").on('click', function () {
                    $(this).parent().siblings().find('#phone').addClass('rel-phone');
                    $(this).parent().find('#yanzheng').addClass('rel-yanzheng');
                    if (checkPhone()) { //验证手机号码
                        if (isPhone()) { //手机号码正确发送数据
                            daojishi(); //倒计时
                        }
                    }
                })
                // 验证手机
                function checkPhone() {
                    var phone = $(".rel-phone").val();
                    var phone_res = /^\d{11}$/;

                    if (phone.length < 1) { //id_card)){alert("请输入正确的身份证号码");

                        layer.open({
                            content: "请输入手机号码",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else if (!phone_res.test(phone)) {
                        layer.open({
                            content: "请输入正确的手机号码",
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    } else {
                        return true;
                    }
                }
                // 倒计时
                function daojishi() {
                    var sem = 60;
                    $('.huoquyzm').hide();
                    $('.huoquyzm_jishi').show();
                    $('.daojishi').html(sem);
                    var second = sem;
                    var timer = null;
                    timer = setInterval(function () {
                        second -= 1;
                        if (second > 0) {
                            $('.daojishi').html(second);
                        } else {
                            clearInterval(timer);
                            $('.huoquyzm').show();
                            $('.huoquyzm_jishi').hide();
                        }
                    }, 1000);
                }
            },
            selectCell: function (e) {
                return this.gameModel.selectCell(e)
            },
            cleanCmd: function () {
                this.gameModel.cleanCmd()
            }
        }), cc._RF.pop()
    }, {
        "../Model/GameModel": "GameModel"
    }],
    GameModelTest: [function (e, t, s) {
        "use strict";
        cc._RF.push(t, "16fce9lOkpA7a2vuhmMkDMZ", "GameModelTest"), cc.Class({
            extends: cc.Component,
            properties: {}
        }), cc._RF.pop()
    }, {}],
    GameModel: [function (e, t, s) {
        "use strict";

        function i() {
            this.cells = null, this.cellBgs = null, this.lastPos = cc.p(-1, -1), this.cellTypeNum = 3, this.cellCreateType = []
        }
        cc._RF.push(t, "cc442HaMlBE/ZKi7W/YUKwd", "GameModel"), Object.defineProperty(s, "__esModule", {
            value: !0
        }), s.default = i;
        var o = function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(e("./CellModel")),
            l = e("./ConstValue");
        i.prototype.init = function (e) {
            this.cells = [], this.setCellTypeNum(e || this.cellTypeNum);
            for (t = 1; t <= l.GRID_WIDTH; t++) {
                this.cells[t] = [];
                for (s = 1; s <= l.GRID_HEIGHT; s++) this.cells[t][s] = new o.default
            }
            for (var t = 1; t <= l.GRID_WIDTH; t++)
                for (var s = 1; s <= l.GRID_HEIGHT; s++)
                    for (var i = !0; i;) i = !1, this.cells[t][s].init(this.getRandomCellType()), this.checkPoint(s, t)[0].length > 2 && (i = !0), this.cells[t][s].setXY(s, t), this.cells[t][s].setStartXY(s, t)
        }, i.prototype.initWithData = function (e) {}, i.prototype.checkPoint = function (e, t) {
            var s = function (e, t, s) {
                    var i = [],
                        o = [];
                    o[e + 5 * t] = !0, i.push(cc.p(e, t));
                    for (var l = 0; l < i.length;) {
                        var c = i[l],
                            n = this.cells[c.y][c.x];
                        if (l++, n)
                            for (var h = 0; h < s.length; h++) {
                                var a = c.x + s[h].x,
                                    r = c.y + s[h].y;
                                a < 1 || a > 5 || r < 1 || r > 5 || o[a + 5 * r] || !this.cells[r][a] || n.type == this.cells[r][a].type && (o[a + 5 * r] = !0, i.push(cc.p(a, r)))
                            }
                    }
                    return i
                },
                i = s.call(this, e, t, [cc.p(1, 0), cc.p(-1, 0)]),
                o = s.call(this, e, t, [cc.p(0, -1), cc.p(0, 1)]),
                l = [];
            if (i.length >= 3 && (l = i), o.length >= 3) {
                var c = l.concat();
                o.forEach(function (e) {
                    var t = !1;
                    c.forEach(function (s) {
                        e.x == s.x && e.y == s.y && (t = !0)
                    }, this), t || l.push(e)
                }, this)
            }
            return [l, "", this.cells[t][e].type]
        }, i.prototype.printInfo = function () {
            for (var e = 1; e <= 9; e++) {
                for (var t = "", s = 1; s <= 9; s++) t += this.cells[e][s].type + " ";
                console.log(t)
            }
        }, i.prototype.getCells = function () {
            return this.cells
        }, i.prototype.selectCell = function (e) {
            this.changeModels = [], this.effectsQueue = [];
            var t = this.lastPos;
            if (1 != Math.abs(e.x - t.x) + Math.abs(e.y - t.y)) return this.lastPos = e, [
                [],
                []
            ];
            this.exchangeCell(t, e);
            var s = this.checkPoint(e.x, e.y)[0],
                i = this.checkPoint(t.x, t.y)[0];
            this.curTime = 0, this.pushToChangeModels(this.cells[e.y][e.x]), this.pushToChangeModels(this.cells[t.y][t.x]);
            var o = this.cells[e.y][e.x].status != l.CELL_STATUS.COMMON && this.cells[t.y][t.x].status != l.CELL_STATUS.COMMON || this.cells[e.y][e.x].status == l.CELL_STATUS.BIRD || this.cells[t.y][t.x].status == l.CELL_STATUS.BIRD;
            if (s.length < 3 && i.length < 3 && !o) return this.exchangeCell(t, e), this.cells[e.y][e.x].moveToAndBack(t), this.cells[t.y][t.x].moveToAndBack(e), this.lastPos = cc.p(-1, -1), [this.changeModels];
            this.lastPos = cc.p(-1, -1), this.cells[e.y][e.x].moveTo(e, this.curTime), this.cells[t.y][t.x].moveTo(t, this.curTime);
            var c = [e, t];
            return this.curTime += l.ANITIME.TOUCH_MOVE, this.processCrush(c), [this.changeModels, this.effectsQueue]
        }, i.prototype.processCrush = function (e) {
            for (console.log(e); e.length > 0;) {
                var t = [];
                for (var s in e) {
                    var i = e[s];
                    if (this.cells[i.y][i.x]) {
                        var o = this.checkPoint(i.x, i.y),
                            c = o[0],
                            n = o[1],
                            h = o[2];
                        if (!(c.length < 3)) {
                            console.log(c.length, c), progerssNum += c.length, console.log(progerssNum);
                            for (var a in c) {
                                var r = this.cells[c[a].y][c[a].x];
                                this.crushCell(c[a].x, c[a].y), r.status != l.CELL_STATUS.COMMON && t.push(r)
                            }
                            this.createNewCell(i, n, h)
                        }
                    }
                }
                this.processBomb(t), this.curTime += l.ANITIME.DIE, e = this.down(), 0
            }
        }, i.prototype.createNewCell = function (e, t, s) {
            if ("" != t) {
                var i = new o.default;
                this.cells[e.y][e.x] = i, i.init(s), i.setStartXY(e.x, e.y), i.setXY(e.x, e.y), i.setStatus(t), i.setVisible(0, !1), i.setVisible(this.curTime, !0), this.changeModels.push(i)
            }
        }, i.prototype.down = function () {
            for (var e = [], t = 1; t <= l.GRID_WIDTH; t++)
                for (var s = 1; s <= l.GRID_HEIGHT; s++)
                    if (null == this.cells[t][s]) {
                        for (var i = t, c = i; c <= l.GRID_HEIGHT; c++) this.cells[c][s] && (this.pushToChangeModels(this.cells[c][s]), e.push(this.cells[c][s]), this.cells[i][s] = this.cells[c][s], this.cells[c][s] = null, this.cells[i][s].setXY(s, i), this.cells[i][s].moveTo(cc.p(s, i), this.curTime), i++);
                        for (var n = 1, c = i; c <= l.GRID_HEIGHT; c++) this.cells[c][s] = new o.default, this.cells[c][s].init(this.getRandomCellType()), this.cells[c][s].setStartXY(s, n + l.GRID_HEIGHT), this.cells[c][s].setXY(s, n + l.GRID_HEIGHT), this.cells[c][s].moveTo(cc.p(s, c), this.curTime), n++, this.changeModels.push(this.cells[c][s]), e.push(this.cells[c][s])
                    }
            return this.curTime += l.ANITIME.TOUCH_MOVE + .3, e
        }, i.prototype.pushToChangeModels = function (e) {
            -1 == this.changeModels.indexOf(e) && this.changeModels.push(e)
        }, i.prototype.cleanCmd = function () {
            for (var e = 1; e <= l.GRID_WIDTH; e++)
                for (var t = 1; t <= l.GRID_HEIGHT; t++) this.cells[e][t] && (this.cells[e][t].cmd = [])
        }, i.prototype.exchangeCell = function (e, t) {
            var s = this.cells[e.y][e.x];
            this.cells[e.y][e.x] = this.cells[t.y][t.x], this.cells[e.y][e.x].x = e.x, this.cells[e.y][e.x].y = e.y, this.cells[t.y][t.x] = s, this.cells[t.y][t.x].x = t.x, this.cells[t.y][t.x].y = t.y
        }, i.prototype.setCellTypeNum = function (e) {
            this.cellTypeNum = e, this.cellCreateType = [];
            for (var t = 1; t <= e; t++)
                for (;;) {
                    var s = Math.floor(Math.random() * l.CELL_BASENUM);
                    if (-1 == this.cellCreateType.indexOf(s)) {
                        this.cellCreateType.push(s);
                        break
                    }
                }
        }, i.prototype.getRandomCellType = function () {
            var e = Math.floor(Math.random() * this.cellTypeNum);
            return this.cellCreateType[e]
        }, i.prototype.processBomb = function (e) {
            for (var t = this; e.length > 0;) ! function () {
                var s = [],
                    i = l.ANITIME.BOMB_DELAY;
                e.forEach(function (e) {
                    if (e.status == l.CELL_STATUS.LINE) {
                        for (var t = 1; t <= l.GRID_WIDTH; t++) this.cells[e.y][t] && (this.cells[e.y][t].status != l.CELL_STATUS.COMMON && s.push(this.cells[e.y][t]), this.crushCell(t, e.y));
                        this.addRowBomb(this.curTime, cc.p(e.x, e.y))
                    } else if (e.status == l.CELL_STATUS.COLUMN) {
                        for (var o = 1; o <= l.GRID_HEIGHT; o++) this.cells[o][e.x] && (this.cells[o][e.x].status != l.CELL_STATUS.COMMON && s.push(this.cells[o][e.x]), this.crushCell(e.x, o));
                        this.addColBomb(this.curTime, cc.p(e.x, e.y))
                    } else if (e.status == l.CELL_STATUS.WRAP)
                        for (var c = e.x, n = e.y, h = 1; h <= l.GRID_HEIGHT; h++)
                            for (var a = 1; a <= l.GRID_WIDTH; a++) {
                                var r = Math.abs(c - a) + Math.abs(n - h);
                                this.cells[h][a] && r <= 2 && (this.cells[h][a].status != l.CELL_STATUS.COMMON && s.push(this.cells[h][a]), this.crushCell(a, h))
                            } else if (e.status == l.CELL_STATUS.BIRD) {
                                var u = e.type;
                                i < l.ANITIME.BOMB_BIRD_DELAY && (i = l.ANITIME.BOMB_BIRD_DELAY), u == l.CELL_TYPE.BIRD && (u = this.getRandomCellType());
                                for (var p = 1; p <= l.GRID_HEIGHT; p++)
                                    for (var f = 1; f <= l.GRID_WIDTH; f++) this.cells[p][f] && this.cells[p][f].type == u && (this.cells[p][f].status != l.CELL_STATUS.COMMON && s.push(this.cells[p][f]), this.crushCell(f, p, !0))
                            }
                }, t), e.length > 0 && (t.curTime += i), e = s
            }()
        }, i.prototype.addCrushEffect = function (e, t) {
            this.effectsQueue.push({
                playTime: e,
                pos: t,
                action: "crush"
            })
        }, i.prototype.addRowBomb = function (e, t) {
            this.effectsQueue.push({
                playTime: e,
                pos: t,
                action: "rowBomb"
            })
        }, i.prototype.addColBomb = function (e, t) {
            this.effectsQueue.push({
                playTime: e,
                pos: t,
                action: "colBomb"
            })
        }, i.prototype.addWrapBomb = function (e, t) {}, i.prototype.crushCell = function (e, t, s) {
            var i = this.cells[t][e];
            this.pushToChangeModels(i), s ? (i.toShake(this.curTime), i.toDie(this.curTime + l.ANITIME.DIE_SHAKE)) : i.toDie(this.curTime), this.addCrushEffect(this.curTime, cc.p(i.x, i.y)), this.cells[t][e] = null
        }, t.exports = s.default, cc._RF.pop()
    }, {
        "./CellModel": "CellModel",
        "./ConstValue": "ConstValue"
    }],
    GridView: [function (e, t, s) {
        "use strict";
        cc._RF.push(t, "d0d1fDj9rlDx5QUtP+2toQV", "GridView");
        var i = e("../Model/ConstValue");
        cc.Class({
            extends: cc.Component,
            properties: {
                aniPre: {
                    default: [],
                    type: [cc.Prefab]
                },
                effectLayer: {
                    default: null,
                    type: cc.Node
                }
            },
            onLoad: function () {
                this.setListener(), this.lastTouchPos = cc.Vec2(-1, -1), this.isCanMove = !0, this.isInPlayAni = !1
            },
            setController: function (e) {
                this.controller = e
            },
            initWithCellModels: function (e) {
                this.cellViews = [];
                for (var t = 1; t <= 5; t++) {
                    this.cellViews[t] = [];
                    for (var s = 1; s <= 5; s++) {
                        var i = e[t][s].type,
                            o = cc.instantiate(this.aniPre[i]);
                        o.parent = this.node, o.getComponent("CellView").initWithModel(e[t][s]), this.cellViews[t][s] = o
                    }
                }
            },
            setListener: function () {
                this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
                    if (this.isInPlayAni) return !0;
                    var t = e.getLocation(),
                        s = this.convertTouchPosToCell(t);
                    return s ? this.selectCell(s).length >= 3 ? this.isCanMove = !1 : this.isCanMove = !0 : this.isCanMove = !1, !0
                }, this), this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
                    if (this.isCanMove) {
                        var t = e.getStartLocation(),
                            s = this.convertTouchPosToCell(t),
                            i = e.getLocation(),
                            o = this.convertTouchPosToCell(i);
                        if (s.x != o.x || s.y != o.y) {
                            this.isCanMove = !1;
                            this.selectCell(o)
                        }
                    }
                }, this), this.node.on(cc.Node.EventType.TOUCH_END, function (e) {}, this), this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {}, this)
            },
            convertTouchPosToCell: function (e) {
                if ((e = this.node.convertToNodeSpace(e)).x < 0 || e.x >= i.GRID_PIXEL_WIDTH || e.y < 0 || e.y >= i.GRID_PIXEL_HEIGHT) return !1;
                var t = Math.floor(e.x / i.CELL_WIDTH) + 1,
                    s = Math.floor(e.y / i.CELL_HEIGHT) + 1;
                return cc.p(t, s)
            },
            updateView: function (e) {
                var t = [];
                for (var s in e) {
                    var i = e[s],
                        o = this.findViewByModel(i),
                        l = null;
                    if (o) l = o.view, this.cellViews[o.y][o.x] = null;
                    else {
                        var c = i.type,
                            n = cc.instantiate(this.aniPre[c]);
                        n.parent = this.node, n.getComponent("CellView").initWithModel(i), l = n
                    }
                    l.getComponent("CellView").updateView(), i.isDeath || t.push({
                        model: i,
                        view: l
                    })
                }
                t.forEach(function (e) {
                    var t = e.model;
                    this.cellViews[t.y][t.x] = e.view
                }, this)
            },
            updateSelect: function (e) {
                for (var t = 1; t <= 5; t++)
                    for (var s = 1; s <= 5; s++)
                        if (this.cellViews[t][s]) {
                            var i = this.cellViews[t][s].getComponent("CellView");
                            e.x == s && e.y == t ? i.setSelect(!0) : i.setSelect(!1)
                        }
            },
            findViewByModel: function (e) {
                for (var t = 1; t <= 5; t++)
                    for (var s = 1; s <= 5; s++)
                        if (this.cellViews[t][s] && this.cellViews[t][s].getComponent("CellView").model == e) return {
                            view: this.cellViews[t][s],
                            x: s,
                            y: t
                        };
                return null
            },
            getPlayAniTime: function (e) {
                if (!e) return 0;
                var t = 0;
                return e.forEach(function (e) {
                    e.cmd.forEach(function (e) {
                        t < e.playTime + e.keepTime && (t = e.playTime + e.keepTime)
                    }, this)
                }, this), t
            },
            disableTouch: function (e) {
                e <= 0 || (this.isInPlayAni = !0, this.node.runAction(cc.sequence(cc.delayTime(e), cc.callFunc(function () {
                    this.isInPlayAni = !1
                }, this))))
            },
            selectCell: function (e) {
                var t = this.controller.selectCell(e),
                    s = t[0],
                    i = t[1];
                return this.playEffect(i), this.disableTouch(this.getPlayAniTime(s)), this.updateView(s), this.controller.cleanCmd(), s.length >= 2 ? this.updateSelect(cc.p(-1, -1)) : this.updateSelect(e), s
            },
            playEffect: function (e) {
                this.effectLayer.getComponent("EffectLayer").playEffects(e)
            }
        }), cc._RF.pop()
    }, {
        "../Model/ConstValue": "ConstValue"
    }]
}, {}, ["GameController", "CellModel", "ConstValue", "GameModel", "GameModelTest", "CellView", "EffectLayer", "GridView"]);