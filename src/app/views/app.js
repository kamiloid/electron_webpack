import {BindViews} from '../../core/relast.js';
import Main from './main.html';

const views = BindViews(Main);

const App_view ={
	main: () =>{
		return `${views.main}`;
	}
}

export default App_view;
