import {API} from "./katapi";

export const Class = function(c)
{
	let final = new Object();
	let black_list = ['extends']
	if(typeof c.extends === 'function')
	{
		let parent = c.extends();
		for(let p in parent)
		{
			if(black_list.includes(p)) continue;
			final[p === 'init' ? 'super' : p === 'run' ? 'super_run' : p] = parent[p];
		}
	}
	for(let p in c)
	{
		if(black_list.includes(p)) continue;
		final[p] = c[p];
	}

	return function(args){
		if(typeof final.init === 'function')
			final.init(args); 
		
		if(final.views)
			if(final.views.main && typeof final.views.main === 'function')	
				final.render({bbox: final._bbox, view: 'main'});
		final.actions = final.actions || {};
		final.reactions = final.reactions || {};
		final.title = (txt) =>{
			let tag = document.querySelector('head title');
			if(!tag){
				tag = document.createElement('title');
				document.head.appendChild(tag);
			}
			tag.innerHTML = txt || 'App';
		}
		return final;
	};
}

export const BindViews = (html) =>{
	const buffer = {};
	console.log(html);
	const bbox = document.createElement('div');
	bbox.innerHTML = html;
	for(let n of bbox.childNodes){
		if(n.tagName !== 'function' && !n.id) continue;
		buffer[n.id] = n.innerHTML;
	}
	return buffer;
}

export const Relast = Class({
	_is_relast: true,
	_bbox: null,
	_ids: {},
	_states: {},
	init: function(data)
	{
		if(typeof data !== 'undefined')
			if(typeof data.root !== 'undefined')
				this._bbox = this.set_bbox(data.root);
		if(typeof this.run === 'undefined')
			this.run = (data) => {this.super_run(data);}
	},
	set_bbox: function(root)
	{
		return typeof root === 'string' ? document.getElementById(root) : root;
	},
	super_run: function() {},
	render: function({bbox, view, args})
	{
		bbox = bbox || this._bbox;
		if(!this.views || typeof this.views === 'undefined') return;
		bbox = typeof bbox === 'string' ? document.getElementById(bbox) : bbox;
		bbox.innerHTML = this.views[view](args);
		this.scan(bbox);
	},
	scan: function(node)
	{
		if(typeof node === 'undefined') return;
		//SCAN NODE BY NODE FROM BBOX (ROOT) AND DETECT WHEN IS CALLED ANY SUBCOMPONENT IN THE VIEW (HTML)
		const childs = node.querySelectorAll('*');
		this.set_states(node);
	},
	set_states: function(node){
		if(typeof node === 'undefined') return;
		//SCAN NODE BY NODE FROM BBOX (ROOT) AND DETECT WHEN IS CALLED ANY SUBCOMPONENT IN THE VIEW (HTML)
		const childs = node.querySelectorAll('*');
		for(let c of childs){
			for(let s in this._states)
			{
				if(!this._states.hasOwnProperty(s)) continue;
				let html = c.innerHTML;
				if(html.includes(`{${s}}`)){
					const regex = new RegExp(`\{${s}\}`, 'g');
					html = html.replace(regex, this._states[s]);
				}
				c.innerHTML = html;
			}
		}
	},
	state: function(k, v)
	{
		if(typeof v === 'undefined' || v === null) return this._states[v];
		this._states[k] = v;
		this.set_states(this._bbox);
	},
	api: function(api, data, reactions, bad_reactions){
		API.post(api, data).then(resp =>{
			this.call_reactions(reactions, resp);
		}).catch(resp =>{
			this.call_reactions(bad_reactions, resp);
		});
	},
	action: function(k, f){
		if(typeof f === 'function'){
			this.actions[k] = f;
			return;
		}
		if(typeof this.actions[k] === 'function')
			return this.actions[k](f);
	},
	call_actions: function(buffer, args){
		if(Array.isArray(buffer)){
			for(let a of buffer)
				if(typeof this.actions[a] === 'function')
					this.actions[a](args);
		}else{
			if(typeof this.actions[buffer] === 'function')
				this.actions[buffer](args);
		}
	},
	reaction: function(k, f){
		if(typeof f === 'function'){
			this.reactions[k] = f;
			return;
		}
		if(typeof this.reactions[k] === 'function')
			return this.reactions[k](f);
	},
	call_reactions: function(buffer, args){
		if(Array.isArray(buffer)){
			for(let r of buffer)
				if(typeof this.reactions[r] === 'function')
					this.reactions[r](args);
		}else{
			if(typeof this.reactions[buffer] === 'function'){
				this.reactions[buffer](args);
			}
		}
	}
});
export const CONSTS = {
	DEBUG: true,
	MODS: {}
}
