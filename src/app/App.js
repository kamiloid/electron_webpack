import {API} from "../core/katapi";
import { Relast, Class } from "../core/relast";
import './app.scss';
import App_view from "./views/app";

const App = Class({
	extends: Relast,
	init: function(args){
		this.super(args);
		this.state('read_only', 'wiufbweibfew');
		API.add_gateway('KAPI', 'https://hxpri5u399.execute-api.us-east-2.amazonaws.com/default/KAPI');
	},
	run: function(){
		this.api('KAPI/TEST/testing_lambda', {
			body: {aa: 'hello world!!'}
		}, 'api_test');
		return this;
	},
	reactions: {
		api_test: function(resp){
			console.log(resp);
		}
	},
	views: App_view
});

export default App;
