import 'pixi.js';
import axios from 'axios';
import TWEEN from 'tween';
import Leap from 'leapjs';
import debug from 'debug';
import LeapController from './leapMotionController.js';
const log = debug('view');
let dom;
export default function(domId, vm) {
    const self = this;
    /* 測試用web服務器位置 */
    const WEB_SERVER = ENV_SERVER;
    // const WEB_SERVER = '';
    dom = document.getElementById(domId);
    restWH();
    const renderer = PIXI.autoDetectRenderer(w, h, {
        // transparent: true,
        antialias: true,
        backgroundColor: 0x00FFFFFF,
    });

    const stage = new PIXI.Container();
    const G = 0.98; /* 磨擦力 */
    const SC = -0.05; /* 互動感度 */
    const END_D = 0.1; /* 結尾影格，愈大越快結束，解決動態最後跳格問題 */
    const IMAGE_NUM = 48; /* 圖數量 */
    const SC_D = -0.05; /* 滾輪每次縮放間距 */
    const INFO_NODE_ADD_SC_D = 0.3; /* info node 放大增加比例 */
    const AUTO_ROTATE_V = -10; //自動旋轉速度
    let restSizeInfo = { /* 最小顯示物件位置資訊 */
        w_md: 0
    };
    let loader = new PIXI.loaders.Loader();
    let key = 1;
    let file = '';
    let view = null;
    let view_view = null;
    let markView = null;
    let markView_view = null;
    let mc = null;
    let bgGraphics = new PIXI.Graphics(); //底圖
    let infoNodeGlass = null;
    let textureList = null;
    let animate = loadingAnimate;
    let isPen = false;
    let isMove = true;
    let ww, hh, w, h, w_md, h_md, ww_md, hh_md; /* w_md 就是 w>>1 */
    let isRest = false; /* 第二次載入 */
    let isLoading = true;
    let isInfoNodeNeedRest = false; /* 因為移動或縮放導致infoNode需要被更新 */
    let scaleD = 0; /* 長邊比例尺 */
    let infoNodeData = null;
    let realR = 0; //計算後的半徑
    let isDie = false;

    let mode = 0; //-1-重置位置動態,0-一般模式 1-info模式(動態) 2-info模式 3-進入拖曳infoNode模式動畫 4-拖曳infoNode模式 5-拖曳中 6-修改位址存儲中 7-自動旋轉模式
    let isAutoRotate = false;

    let isDragging = false;
    let mc_px = 0;
    let mc_py = 0;
    let dragging_px = 0;
    let dragging_py = 0;
    let dragging_dx = 0;
    let dragging_dy = 0;
    let min_sc = 1;
    let max_sc = 2;
    let w_sc = 1;
    let h_sc = 1;

    /* 旋轉動態計算用 */
    let v = 0;
    let a = 0;
    let x = 0;
    let y = 0;
    let old_x = 0;
    let d = 0;
    let add_d = 0;

    /* 縮放動態計算用 */
    let sc = 1;
    let isSc = false;
    let whellpo = new PIXI.Point(0, 0);
    let localpo = new PIXI.Point(0, 0);

    /* leadp */
    let leapOb;

    /* axios取消請求令牌 */
    let CancelToken = axios.CancelToken;
    let source = CancelToken.source();

    /* 對外方法 */
    this.reLoad = reLoad;
    this.showInfoNode = showInfoNode;
    this.showInfoNode_exit = showInfoNode_exit;
    this.setAutoRotate = function(f) {
        if (f) {
            setMode(7);
        } else {
            setMode(0);
        }
    };

    this.onAutoRotate = function(f) {
        console.info('自動旋轉模式', f);
    }

    //進入拖曳修改infoNode模式
    this.intoMoveInfoNodeMode = function(onComplete) {
        setMode(3, onComplete);
    }

    //離開拖曳修改infoNode模式
    this.exitMoveInfoNodeMode = function(toInfoNodeShow = false) {
        if (toInfoNodeShow) {
            setMode(2, null, toInfoNodeShow);
        } else {
            setMode(0, null, toInfoNodeShow);
        }
    }

    this.hideInfoNode = function() {
        setMode(0);
    }

    this.onExitMoveInfoNodeMode = function(newInfoNodePo) {
        console.info('onExitMoveInfoNodeMode(),when exit move edit InfoNode Mode!! you can overwrite this function', newInfoNodePo);
    }

    this.onRestMoveInfoNodeMode = function(formMode, toMode) {
        // body...
    }

    //存修改infoNode位置模式
    this.saveMoveInfoNodeMode = function(onComplete) {
        setMode(6, onComplete);
    }

    //重置
    this.goRest = function() {
        setMode(-1, () => {
            setMode(0);
        });
    }

    this.onSaveMoveInfoNodeMode = function(newInfoNodePo) {
        // body...
    }

    //info node 編輯移動時
    this.onMoveInfoNode = function(scale, po, r) {
        console.info('onMoveInfoNode(),when infoNode is move!! you can overwrite this function', scale, po, realR, r);
    }

    //隱藏infonode
    this.onHideInfoNode = function(mode) {
        console.info('onHideInfoNode(),when infoNode is close!! you can overwrite this function', mode);
    }

    //載入過程
    this.onLoading = function(step, rate = 0) {
        console.info('onLoading', step, rate);
    }

    this.onInfoNodeSaveOutSide = function() {
        console.info('infoNode位置超出界線');
    }

    this.onAddInfoNodeEnd = function() {
        console.info('');
    }

    //目前定位的圖片key
    this.getNowKey = function() {
        return key;
    }

    dom.appendChild(renderer.view);
    mc = new PIXI.Container();
    mc.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 0);
    markView = new PIXI.Sprite();
    markView_view = new PIXI.Sprite();
    markView.addChild(markView_view);
    view = new PIXI.Sprite();
    view_view = new PIXI.Sprite();
    view.addChild(view_view);
    infoNodeGlass = new PIXI.Sprite();
    infoNodeGlass.alpha = 0;
    let infoNodeGlassMk = new PIXI.Graphics();
    infoNodeGlassMk.alpha = 0;
    let infoNodeGlassSelect = new PIXI.Graphics();
    infoNodeGlass.addChild(infoNodeGlassMk);
    infoNodeGlass.addChild(infoNodeGlassSelect);
    mc.addChild(markView);
    mc.addChild(view);
    stage.addChild(bgGraphics);
    stage.addChild(mc);
    stage.addChild(infoNodeGlass);
    animate();

    let fpKey = vm.$route.params.zipkey;
    log('viewPage : fpKey', fpKey);
    //利用zipKey取回素材靜態路徑
    getRealPath(fpKey, function(error, path) {
        self.onLoading('start');
        if (error) {
            console.error(data);
            self.onLoading('error', '找不到资料');
        } else {
            startLoad(path);
        }
    })

    //重置viewer狀態
    function resrVal() {
        key = 1;
        v = 0;
        a = 0;
        x = 0;
        y = 0;
        old_x = 0;
        d = 0;
        add_d = 0;
        sc = 1;
        isSc = false;
    }

    //重新重入
    function reLoad(key_) {
        setMode(0);
        isLoading = true;
        console.log('start reload !! ' + key_);
        animate = loadingAnimate;
        stage.interactive = false;
        let num = 0
        while (num < IMAGE_NUM) {
            textureList[num].texture.destroy(true);
            num++;
        }
        loader = new PIXI.loaders.Loader();
        getRealPath(key_, function(error, path) {
            if (error) {
                console.error(data);
                self.onLoading('error', '找不到资料');
            } else {
                resrVal();
                startLoad(path);
            }
        })
    }

    /**
     * 利用key取回真實路徑
     * @param  {String} key 物件key
     */
    function getRealPath(key, callBack) {
        log('getRealPath', key);
        axios({
            url: '/ck/' + key,
            method: 'get',
            baseURL: WEB_SERVER,
            cancelToken: source.token,
        }).then(function(res) {
            if (res.data.result) {
                callBack(null, WEB_SERVER + res.data.path)
            } else {
                callBack(data)
            }
        }).catch(function(err) {
            log('err', err);
        })
    }

    function startLoad(path) {
        log('startLoad', path);
        while (key <= 48) {
            file = ('' + key).length === 2 ? '0' + key : '00' + key;
            loader.add('' + (key - 1), path + 'zoom/' + file + '.jpg');
            key++;
        }
        self.onLoading('loading');
        loader.on("progress", loading)
            .on('error', () => {
                self.onLoading('error', '资料有问题');
            })
            .once('complete', init)
            .load();
    }

    function loading(e) {
        self.onLoading('loading', ~~e.progress);
    }

    function init(loader, resources) {
        self.onLoading('loading', 100);
        isLoading = false;
        if (isDie) {
            return;
        }
        animate = reloadImageAnimate;
        textureList = resources;
        key = 0;
        renderer.backgroundColor = getBgColor(textureList[0].texture);
        view_view.texture = textureList[key].texture;
        ww = view_view.width;
        hh = view_view.height;
        ww_md = ww >> 1;
        hh_md = hh >> 1;
        scaleD = ww > hh ? ww : hh; //依較長邊設定比例尺
        let markView_bg = new PIXI.Graphics();
        markView_bg.beginFill(renderer.backgroundColor);
        markView_bg.drawRect(-ww, -hh, ww * 3, hh * 3);
        markView_bg.endFill();
        markView.addChildAt(markView_bg, 0);
        view.addChildAt(markView_bg.clone(), 0);
        if (!isRest) {
            isRest = true;
            stage.on('mousedown', downIt);
            stage.on('mouseup', upIt);
            stage.on('mouseupoutside', upIt);
            stage.on('mousemove', moveIt);
            stage.on('rightdown', rightdown);
            stage.on('rightup', rightup);

            dom.addEventListener('wheel', mouseWheelHandler, { passive: true });
            window.addEventListener('resize', onresize);
        }
        bgGraphics.beginFill(renderer.backgroundColor);
        bgGraphics.drawRect(0, 0, 10, 10);
        onresize();
    }

    function mouseWheelHandler(e) {
        if (mode === 4 || mode === 5) { //編輯info node模式不縮放
            return false;
        }
        setMode(0);
        whellpo.x = e.clientX;
        whellpo.y = e.clientY;
        sc += e.deltaY > 0 ? SC_D : -SC_D;
        isSc = true;
    }

    function rightdown(e) {
        if (mode === 4 || mode === 5) { //編輯info node模式不拖曳
            return false;
        }
        setMode(0);
        isDragging = true;
        mc_px = mc.x;
        mc_py = mc.y;
        dragging_px = e.data.global.x;
        dragging_py = e.data.global.y;
    }

    let p1 = new PIXI.Point(0, 0);
    let p3 = new PIXI.Point(0, 0);
    let rec = null;
    let g1Po = null;
    let g3Po = null;
    let moveData = {};
    let autoMove = false;

    function rightup(e) {
        isDragging = false;
    }

    function downIt(e) {
        if (mode === 4 || mode === 5) { //編輯info node模式不變動mode

        } else if (mode === 7) {
            self.setAutoRotate(false);
        } else {
            setMode(0);
        }

        if (mode !== 5) {
            isPen = true;
            x = e.data.global.x;
            old_x = x;
        }
    }

    let sc_base;

    function upIt(e) {
        isPen = false;
    }

    let dragging_x;
    let dragging_y;

    function moveIt(e) {
        x = e.data.global.x;
        y = e.data.global.y;
    }

    function loadingAnimate() {
        requestAnimationFrame(animate);
        renderer.render(stage);
    }

    function reloadImageAnimate() {
        requestAnimationFrame(animate);
        view_view.texture = textureList[key].texture;
        renderer.render(stage);
        self.onLoading('draw', key);
        key++;
        if (key === IMAGE_NUM) {
            key = 0;
            animate = animateEnd;
            onresize();
            stage.interactive = true;
            self.onLoading('end');
        }
    }

    //取得底圖色碼
    function getBgColor(texture) {
        let canvasRenderer = new PIXI.CanvasRenderer(1, 1);
        let view = new PIXI.Sprite();
        view.texture = texture;
        canvasRenderer.render(view);
        let rgba = canvasRenderer.context.getImageData(0, 0, 1, 1).data;
        canvasRenderer.destroy();
        log('color', rgba[0].toString(16), rgba[1].toString(16), rgba[2].toString(16));
        let r = rgba[0].toString(16);
        r = r.length === 1 ? '0' + r : r;
        let g = rgba[1].toString(16);
        g = g.length === 1 ? '0' + g : g;
        let b = rgba[1].toString(16);
        b = b.length === 1 ? '0' + b : b;
        return '0x00' + r + g + b;
    }

    function animateEnd(t) {
        requestAnimationFrame(animate);
        if (isLoading) return;
        if (leapOb.isLeap) {
            leapOb.isLeap = false;
            x = leapOb.x + w_md;
            isPen = leapOb.isPen;
            if (leapOb.rest) {
                old_x = x;
                leapOb.rest = false;
            }
        }
        if (isPen) {
            a = old_x - x;
            v = a;
            old_x = x;
        }
        if (isAutoRotate) {
            v = AUTO_ROTATE_V;
        } else {
            v *= G;
        }
        d = d + v * SC;
        add_d = ~~d;
        d = (d - add_d);
        if (d > 0 && d < END_D) {
            d = 0;
        } else if (d < 0 && d > -END_D) {
            d = 0;
        }

        isSc ? scChage() : '';
        isDragging ? dragging() : '';

        //change key
        key += add_d;
        key %= IMAGE_NUM;
        key = key < 0 ? IMAGE_NUM + key : key;
        let texture = textureList[~~key].texture;
        view_view.texture = texture;
        if (mode === 4 || mode === 5) {
            markView_view.texture = texture;
            // markView.filters = [filters, colorFilters];
            markView.filters = [colorFilters];
        }
        TWEEN.update(t);

        renderer.render(stage);
    }

    function scChage() {
        sc = sc < min_sc ? min_sc : sc;
        sc = sc > 2 ? 2 : sc;
        view.scale.set(sc);
        isSc = false;
        isInfoNodeNeedRest = true;
        chkRange();
    }

    function dragging() {
        dragging_dx = x - dragging_px;
        dragging_dy = y - dragging_py;
        mc.x = mc_px + dragging_dx;
        mc.y = mc_py + dragging_dy;
        isInfoNodeNeedRest = true;
        chkRange();
    }

    /* 邊界檢查 */
    function chkRange() {
        let p1 = view.toGlobal({ x: 0, y: 0 });
        let p3 = view.toGlobal({ x: ww, y: hh });
        let w_g = p3.x - p1.x;
        let h_g = p3.y - p1.y;
        if (p3.x < 0) {
            mc.pivot.x = 0;
            mc.x = -w_g >> 1;
        } else if (p1.x > w) {
            mc.pivot.x = 0;
            mc.x = w + (w_g >> 1);
        }
        if (p3.y < 0) {
            mc.pivot.y = 0;
            mc.y = -h_g >> 1;
        } else if (p1.y > h) {
            mc.pivot.y = 0;
            mc.y = h + (h_g >> 1);
        }
        return; //====================================> 舊版本物件不能超出容器
        // let p1 = view.toGlobal({ x: 0, y: 0 });
        // let p3 = view.toGlobal({ x: ww, y: hh });
        // let w_g = p3.x - p1.x;
        // let h_g = p3.y - p1.y;
        // if (w_g <= w) {
        //     mc.x = w >> 1;
        // } else {
        //     if (p1.x > 0) {
        //         mc.x -= p1.x;
        //     } else if (p3.x < w) {
        //         mc.x += w - p3.x;
        //     }
        // }
        // if (h_g <= h) {
        //     mc.y = h >> 1;
        // } else {
        //     if (p1.y > 0) {
        //         mc.y -= p1.y;
        //     } else if (p3.y < h) {
        //         mc.y += h - p3.y;
        //     }
        // }

    }

    let colorFilters = new PIXI.filters.ColorMatrixFilter();
    colorFilters.brightness(0.5);
    let filters = new PIXI.filters.BlurFilter(3);
    let modeRuning = false;
    // 
    //===================有限狀態機========================= 
    //-1-重置位置動態 ,0-一般模式 1-info模式(動態) 2-info模式 3-進入拖曳infoNode模式動畫 4-拖曳infoNode模式 5-拖曳中 6-修改位址存儲中 7-自動旋轉模式
    function setMode(toMode, onComplete, age = null) {
        if (mode !== toMode && !modeRuning) {
            modeRuning = true;
            log('mode', mode, toMode)
            if (mode === 0 && toMode == 1) {
                if (age !== null) {
                    gotoFp(infoNodeData.n, onComplete, false, age);
                } else {
                    gotoFp(infoNodeData.n, onComplete, false);
                }
            } else if (mode === 1 && toMode === 2) {
                markView.pivot = view.pivot;
                markView.scale = view.scale;
                markView_view.texture = textureList[infoNodeData.n].texture;
                // markView.filters = [filters, colorFilters];
                markView.filters = [colorFilters];
                markView.alpha = 1;
                infoNodeGlass.alpha = 1;
                view.mask = infoNodeGlassMk;
                realR = infoNodeData.r * scaleD * markView.scale.x;
                drawInfoNodeGlass(realR);
                view.toGlobal({ x: infoNodeData.x * ww, y: infoNodeData.y * hh }, infoNodeGlass);
                onComplete(infoNodeGlass.position, realR);
            } else if (mode === 2 && toMode === 1) {
                restMarkView(toMode);
                gotoFp(infoNodeData.n, onComplete);
            } else if (mode === 2 && toMode === 0) {
                restMarkView(toMode);
            } else if (mode === 2 && toMode === 3) { //拖曳info node 模式動畫
                restMarkView(toMode);
                goResize(null, () => {
                    setMode(4, onComplete)
                });

            } else if (mode === 3 && toMode === 4) { //拖曳info node 模式
                markView.pivot = view.pivot;
                markView.scale = view.scale;
                markView_view.texture = textureList[infoNodeData.n].texture;
                // markView.filters = [filters, colorFilters];
                markView.filters = [colorFilters];
                markView.alpha = 1;
                infoNodeGlass.alpha = 1;
                view.mask = infoNodeGlassMk;
                realR = infoNodeData.r * scaleD * markView.scale.x;
                drawInfoNodeGlass(realR, true);
                view.toGlobal({ x: infoNodeData.x * ww, y: infoNodeData.y * hh }, infoNodeGlass);
                infoNodeGlass.interactive = true;
                infoNodeGlass.on('mousedown', function(e) {
                    this.dragging = true;
                    this.data = e.data;
                    this.mouseDownPo = this.data.getLocalPosition(this);
                    setMode(5)
                });
                self.onMoveInfoNode(infoNodeGlassToScale(), infoNodeGlass.position, realR);
                onComplete();
            } else if (mode === 4 && toMode === 2) {
                restMarkView(toMode);
                let toInfoNodeShow = age;
                infoNodeGlass.off('mousedown');
                self.onExitMoveInfoNodeMode(toInfoNodeShow);
            } else if (mode === 4 && toMode === 5) { //拖曳中
                infoNodeGlass.on('mouseup', stopDragging);
                infoNodeGlass.on('mouseupoutside', stopDragging);

                function stopDragging(e) {
                    this.dragging = false;
                    this.data = null;
                    setMode(4);
                }

                infoNodeGlass.on('mousemove', function(e) {
                    if (this.dragging) {
                        let newPosition = this.data.getLocalPosition(this.parent);
                        this.position.x = newPosition.x - this.mouseDownPo.x;
                        this.position.y = newPosition.y - this.mouseDownPo.y;
                        self.onMoveInfoNode(infoNodeGlassToScale(), infoNodeGlass.position, realR);
                    }
                });
            } else if (mode === 5 && toMode === 4) {
                infoNodeGlass.off('mouseup');
                infoNodeGlass.off('mouseupoutside');
                infoNodeGlass.off('mousemove');
            } else if (mode === 4 && toMode === 0) { //退出拖曳編輯點
                restMarkView(toMode);
                let toInfoNodeShow = age;
                infoNodeGlass.off('mousedown');
                self.onRestMoveInfoNodeMode(mode, toMode);
            } else if (mode === 4 && toMode === 1) {
                restMarkView(toMode);
                infoNodeGlass.off('mousedown');
                self.onRestMoveInfoNodeMode(mode, toMode);
                setTimeout(() => {
                    gotoFp(infoNodeData.n, onComplete);
                }, 0);
            } else if (mode === 4 && toMode === 6) { //按下修改位址
                let moveEndInfoData = getMoveEndInfoData();
                if (!isInfoNodePoInSide(moveEndInfoData)) { //檢查是否出界
                    self.onInfoNodeSaveOutSide();
                    return
                }
                infoNodeGlass.off('mousedown');
                self.onSaveMoveInfoNodeMode(moveEndInfoData);
                setTimeout(onComplete, 0);
            } else if (mode === 6 && toMode === 1) {
                restMarkView(toMode);
                gotoFp(infoNodeData.n, onComplete);
            } else if (mode === 0 && toMode === -1) {
                gotoFp(0, onComplete, true);
            } else if (mode === 2 && toMode === -1) {
                restMarkView(toMode);
                self.onRestMoveInfoNodeMode(mode, toMode);
                gotoFp(0, onComplete, true);
            } else if (mode === 4 && toMode === -1) {
                infoNodeGlass.off('mousedown');
                restMarkView(toMode);
                self.onRestMoveInfoNodeMode(mode, toMode);
                gotoFp(0, onComplete, true);
            } else if (mode === 0 && toMode === 7) {
                autoRotate();
            } else if (mode === 2 && toMode === 7) {
                restMarkView(toMode);
                autoRotate();
            } else if (mode === 4 && toMode === 7) {
                infoNodeGlass.off('mousedown');
                restMarkView(toMode);
                self.onRestMoveInfoNodeMode(mode, toMode);
                autoRotate();
            } else if (mode === 7 && toMode === 0) {
                autoRotate(false);
            } else if (mode === 7 && toMode === -1) {
                autoRotate(false);
                gotoFp(0, onComplete, true);
            } else if (mode === 7 && toMode === 1) {
                autoRotate(false);
                gotoFp(infoNodeData.n, onComplete, false);
            }
        }
        mode = toMode;
        modeRuning = false;
    }

    //停止自動旋轉
    function autoRotate(f = true) {
        if (!f) {
            a = 0;
            v = 0;
        }
        isAutoRotate = f;
        self.onAutoRotate(f);
    }

    //檢查infoNode是否界內
    function isInfoNodePoInSide({ x, y }) {
        if (x > 0 && x < 1 && y > 0 && y < 1) {
            return true;
        }
        return false;
    }

    //取回修改後的位置資料
    function getMoveEndInfoData() {
        let data = infoNodeGlassToScale();
        data.r = infoNodeData.r;
        data.n = key;
        return data;
    }

    //將infoNodeGlass位置轉成比例
    function infoNodeGlassToScale() {
        let data = view.toLocal(infoNodeGlass.position, stage);
        data.x /= ww;
        data.y /= hh;
        return data;
    }

    /**
     * 展示infoNode
     * @param  {[type]} _infoNodeData infoNode Data
     * @param  {[type]} onComplete    移動後呼叫
     * @return {[type]}               [description]
     */
    function showInfoNode(_infoNodeData, onComplete, addSc = null) {
        infoNodeData = _infoNodeData;
        markView.alpha = 0;
        setMode(1, onComplete, addSc);
    }

    function showInfoNode_exit(onComplete) {
        setMode(0);
    }

    //清除遮罩
    function restMarkView(toMode) {
        markView.filters = [];
        infoNodeGlass.alpha = 0;
        markView.alpha = 0;
        view.mask = null;
        mc.x = w_md - (view.pivot.x - ww_md) * sc;
        mc.y = h_md - (view.pivot.y - hh_md) * sc;
        view.pivot.x = ww_md;
        view.pivot.y = hh_md;
        self.onHideInfoNode(toMode);
    }

    //繪製info node圓
    function drawInfoNodeGlass(r, canDrag = false) {
        infoNodeGlassMk.clear();
        infoNodeGlassMk.beginFill(0x000000);
        infoNodeGlassMk.drawCircle(0, 0, r);
        infoNodeGlassMk.endFill();
        infoNodeGlassSelect.clear();
        infoNodeGlassSelect.lineStyle(2, 0xffffff, 1);
        infoNodeGlassSelect.drawCircle(0, 0, r);
        if (canDrag) { //拖曳模式，多畫一個圓
            infoNodeGlassSelect.drawCircle(0, 0, r + 10);
        }
        infoNodeGlassSelect.endFill();
    }

    /**
     * 自動移到位置
     * @param  {Number} fp kay位置
     */
    function gotoFp(fp, onComplete, isRest = false, addSc = null) {
        addSc = addSc === null ? INFO_NODE_ADD_SC_D : addSc;
        let call_go = isRest ? goResize : go;
        fp = ~~(fp * 1);
        let nowfp = key;
        let a, b;
        if (fp === 0) {
            a = IMAGE_NUM - nowfp;
            b = nowfp;
            if (a >= b) {
                //往後-
                call_go(nowfp - b, onComplete, addSc);
            } else {
                //往前+
                call_go(nowfp + a, onComplete, addSc);
            }
        } else if (nowfp === 0) {
            a = IMAGE_NUM - fp;
            b = fp;
            if (b >= a) {
                //往後-
                call_go(-a, onComplete, addSc);
            } else {
                //往前+
                call_go(b, onComplete, addSc);
            }
        } else if (fp > nowfp) {
            a = fp - nowfp;
            b = nowfp + IMAGE_NUM - fp;
            if (a >= b) {
                //往後-
                call_go(nowfp - b, onComplete, addSc);
            } else {
                //往前+
                call_go(nowfp + a, onComplete, addSc);
            }
        } else if (fp < nowfp) {
            a = nowfp - fp;
            b = IMAGE_NUM - nowfp + fp;
            if (a >= b) {
                //往前+
                call_go(nowfp + b, onComplete, addSc);
            } else {
                //往後-
                call_go(nowfp - a, onComplete, addSc);
            }
        } else {
            //不動
            call_go(nowfp, onComplete, addSc);
        }
    }

    function go(fpNum, onComplete, addSc) {
        a = 0;
        v = 0;
        stage.interactive = false;
        new TWEEN.Tween({
                w_md: mc.x,
                h_md: mc.y,
                ww: view.pivot.x,
                hh: view.pivot.y,
                sc: sc,
                key: key,
            })
            .easing(TWEEN.Easing.Cubic.InOut)
            .to({
                key: fpNum,
                ww: ww * infoNodeData.x,
                hh: hh * infoNodeData.y,
                w_md: w_md,
                h_md: h_md,
                sc: min_sc + addSc,
            }, 300)
            .onUpdate(function() {
                view.pivot.x = this.ww;
                view.pivot.y = this.hh;
                mc.x = this.w_md;
                mc.y = this.h_md;
                sc = this.sc;
                view.scale.set(sc);
                key = this.key;
            })
            .onComplete(function() {
                setMode(2, onComplete);
                stage.interactive = true;
            })
            .start();
    }

    //動畫至最適大小(給編輯info node使用)
    function goResize(endKey, onComplete) {
        a = 0;
        v = 0;
        restSizeInfo.key = endKey === null ? key : endKey;
        stage.interactive = false;
        new TWEEN.Tween({
                w_md: mc.x,
                h_md: mc.y,
                ww: view.pivot.x,
                hh: view.pivot.y,
                sc: sc,
                key: key,
            })
            .easing(TWEEN.Easing.Cubic.InOut)
            .to(restSizeInfo, 300)
            .onUpdate(function() {
                view.pivot.x = this.ww;
                view.pivot.y = this.hh;
                mc.x = this.w_md;
                mc.y = this.h_md;
                sc = this.sc;
                key = this.key;
                view.scale.set(sc);
            })
            .onComplete(function() {
                onComplete();
                stage.interactive = true;
            })
            .start();
    }

    function onresize(event) {
        setMode(0);
        restWH();
        sc = min_sc;
        setRestSizeNow();
        renderer.resize(w, h);
        bgGraphics.width = w;
        bgGraphics.height = h;
        isInfoNodeNeedRest = true;
    }

    function restWH() {
        w = dom.clientWidth;
        h = dom.clientHeight;
        w_md = w >> 1;
        h_md = h >> 1;
        w_sc = w / ww;
        h_sc = h / hh;
        min_sc = w_sc > h_sc ? h_sc : w_sc;
        setRestSizeInfo();
    }

    /**
     * 重整物品置中資訊 restSizeInfo
     */
    function setRestSizeInfo() {
        //居中
        if (!restSizeInfo) return;
        restSizeInfo.w_md = w_md;
        restSizeInfo.h_md = h_md;
        restSizeInfo.ww = ww_md;
        restSizeInfo.hh = hh_md;
        restSizeInfo.sc = min_sc;
    }

    /**
     * 立刻居中
     */
    function setRestSizeNow() {
        mc.x = w_md;
        mc.y = h_md;
        view.pivot.x = ww_md;
        view.pivot.y = hh_md;
        view.scale.set(sc);
    }

    let d1, d2;

    /* 距離 */
    function distanceCal(p1, p2) {
        d1 = p2.x - p1.x;
        d2 = p2.y - p1.y;
        return d1 * d1 + d2 * d2;
    }

    this.die = () => {
        isDie = true;
        source.cancel('Viewer die!!');
        animate = () => {};
        dom.removeChild(renderer.view);
        renderer.destroy();
        dom.removeEventListener('wheel', mouseWheelHandler);
        window.removeEventListener('resize', onresize);
        dom = null;
    }

    /*
     * Leap Motion
     */

    leapOb = new LeapController();
    let controller = Leap.loop({ enableGestures: false }, (frame) => leapOb.frame = frame);
    controller.connect();

}
