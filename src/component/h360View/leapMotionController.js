/*
 * Leap Motion
 */
import debug from 'debug';
const log = debug('view');
class LeapClass {
    constructor() {
        log('LeapClass init!!');
        this.step = 0;
        this._headNum = 0;
        this._frame = {};

        this.x = 0;
        this.isPen = false;
        this.isLeap = false;
        this.rest = false;
    }

    set headNum(num) {
        let hand0 = this._frame.hands[0];
        if (this._headNum !== num) {
            if (num == 0) {
                this.isPen = false;
            } else {
                this.isPen = true;
                this.x = hand0.palmPosition[0] * 2;
                this.rest = true;
            }
            this.isLeap = true;
        } else {
            if (num == 0) {

            } else {
                let vv = hand0.palmVelocity[0];
                vv = vv < 0 ? vv * -1 : vv;
                if (vv > 1500) {
                    this.isPen = false;
                    this._headNum = 0;
                    return;
                } else {
                    this.x = hand0.palmPosition[0] * 2;
                }

                this.isLeap = true;
            }
        }
        this._headNum = num;
    }

    get headNum() {
        return this._headNum;
    }

    set frame(data) {
        this._frame = data;
        this.headNum = data.hands.length;
    }
}

export default LeapClass;
