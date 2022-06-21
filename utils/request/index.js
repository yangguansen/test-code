var request = require('request');

/*
* 接口统一包裹成：
* 成功<object> {status: 1, data: ..., msg: ...}
* 失败<object> {status: -1, data: ..., msg: ...}
*
* */

class Request {
    constructor() {
        this.headers = {
            "content-type": "application/json"
        };
        this.errObj = {
            message: '请求失败'
        }
    }

    get(url) {
        return new Promise((resolve, reject) => {

            request.get({
                url: url,
                json: true,
                timeout: 5000,
            }, (err, response, body) => {

                if (!err) {
                    resolve({ status: 1, data: body, msg: '请求成功' });
                } else {
                    reject({ status: -1, data: body, msg: err });
                }
            })
        })
    }

    post(path, body) {
        return new Promise((resolve, reject) => {

            request.post({
                url: path,
                json: true,
                headers: this.headers,
                body: body,
                timeout: 5000,
            }, (err, response, body) => {

                if (!err) {
                    resolve({ status: 1, data: body, msg: '请求成功' });
                } else {
                    reject({ status: -1, data: body, msg: err });
                }
            })
        })
    }

}

module.exports = Request;