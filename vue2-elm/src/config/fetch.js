import {
	baseUrl
} from './env'

//箭头函数
export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
	type = type.toUpperCase();
	url = baseUrl + url;

	if (type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}

	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: "cors",
			cache: "force-cache"
		}

		if (type == 'POST') {
			/*Object.definedProperty方法可以在一个对象上直接定义一个新的属性、或修改一个对象已经存在的属性，
			最终返回这个对象。
				语法
				Object.defineProperty(obj, prop, descriptor)
				参数：
				obj 
				被定义或修改属性的对象；
				prop 
				要定义或修改的属性名称；
				descriptor 
				对属性的描述；
				返回值
				函数将返回传递给他的obj对象本身。
*/
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}

		// 注：这段代码如果想运行，外面需要包一个 async function
		/*
	     使用 await 后， 写异步代码就像写同步代码一样爽 。 await 后面可以跟 Promise 对象，
	     表示等待 Promise resolve() 才会继续向下执行，如果 Promise 被 reject() 或抛出异常则会被外面的 try...catch 捕获。
	    */
		try {
			const response = await fetch(url, requestConfig);
			const responseJson = await response.json();
			return responseJson
		} catch (error) {
			throw new Error(error)
		}

	} else {
		// “承诺将来会执行”的对象在JavaScript中称为Promise对象。
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;//适配低版本IE
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}

			//发送请求
			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			requestObj.send(sendData);
			//监听状态，通过readyState === 4判断请求是否完成，如果已完成，再根据status === 200判断是否是一个成功的响应。
			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj);
					} else {
						reject(requestObj);
					}
				}
			}
		})
	}
}