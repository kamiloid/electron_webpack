import App from './app/App.js';

window.onload = () =>
{
    new App({
        name: 'Main',
        root: 'root'
    }).run().title('CRM');
}
