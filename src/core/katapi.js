const api = {
	_gateways: {},
	add_gateway: function(k, url){
		this._gateways[k] = url;
	},
	post: function(api, data){
		return new Promise((resolve, reject) =>{
			const api_split = api.split('/');
			const gateway = this._gateways[api_split[0]];
			api = '';
			api_slash = '',
			api_split.forEach(v => {
				api += `${api_slash}${v}`;
				api_slash = '/';
			});
			data.body = data.body || {};
			data.body.api = api;
			const xhr = new XMLHttpRequest();
			xhr.open('POST', `${gateway}`);
			Object.keys(data.headers || {}).forEach(key =>{
				xhr.setRequestHeader(key, data.headers[key]);
			});
			xhr.onreadystatechange = () =>{
				if(xhr.responseText.trim() === '') return;
				if(xhr.status === 200){
					resolve(JSON.parse(xhr.responseText));
					return;
				}
				reject({status: xhr.status, error: true});
			};
			xhr.send(JSON.stringify(data.body));
		});
	}
};

module.exports.API = api;
