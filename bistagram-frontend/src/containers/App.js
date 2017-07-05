import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from '../components/Header/Header';
import Login from './Login';
import Posts from './Posts';
import SearchHash from './SearchHash';
import Explore from './Explore';
import NotFound from './NotFound';

import * as auth from '../actions/auth';
import * as form from '../actions/form';
import * as ui from '../actions/ui';

import '../css/basic.css';
import '../css/header.css';
import '../css/followUl.css';
import '../css/modal.css';

class App extends React.Component{

	async componentDidMount() {
		window.addEventListener("scroll", this.handleWheel);
		const { checkSession } = this.props;

		try{
			await checkSession().then(()=>{
				if(!this.props.auth.userinfo.logged && window.location.pathname === "/explore"){
					document.location = "/"
				}
			});
		}catch(e){
			document.location = "/"
		}
  }

	componentWillUnmount() {
		window.addEventListener("scroll", this.handleWheel);
	}

	handleHeaderModal = async () =>{
		const {ui, setHeaderModal, getHistory, changeUserData, setLoading, setLoadingInitial} = this.props;
		setLoading({name:"history", value:true});
		setHeaderModal();
		if(!ui.headerModal){
			await getHistory().then(()=>{
				changeUserData({form:'userinfo', name:'hiscount', value:0});
				setLoadingInitial();
			});
		}
	}

	handleLogout = async () =>{
		const {logout} = this.props;
		await logout().then(() => document.location = "/");
	}

	handleChangeSearch = (content) =>{
		this.props.changeFormData({form: 'search', name: 'keyword', value: content});
	}

	handleSubmitSearch = (e) =>{
		const {form} = this.props;
		let regex = /@([a-z0-9][a-z0-9\-_]*)/ig;
		let change = /[ {}[\]/?.,;:|)*~`!^\-_+┼<>@#$%&'"(=]/gi;
		if(e.charCode === 13 && form.search.keyword.length>0 ){
			if(regex.test(form.search.keyword)){

			}else{
				document.location = "/search/tags/"+form.search.keyword.replace(change, '');
			}
		}
	}

	handleWheel = (e) => {
		const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		const {ui, post, search, setHeader} = this.props;
		let result=true;

		if(ui.headerModal){
			result=true;
		}else if(scrollTop > this.prev){
			result=false;
		}else if(post.status.modal || search.modalState.modal){
			result=false;
		}else{
			result=true;
		}
		if(result!==ui.header){
			setHeader(result);
		}
		this.prev=scrollTop;
	}

	handleFollowClick = (username) => {
		const {auth, setFollowUser, following, unfollow} = this.props;
		setFollowUser(username);
		if(auth.userinfo.followInfo.follower.indexOf(username)!==-1){
			unfollow({follower: username});
		}else{
			following({follower: username});
		}
	}

	render(){
		const {auth, ui, form} = this.props;
		return(
			<Router>
				<section className="react-body">
					{auth.userinfo.logged || window.location.pathname !== "/"?
					<Header
						ui={ui}
						auth={auth}
						form={form}
						headDisplay={ui.header}
						handleHeaderModal={this.handleHeaderModal}
						handleFollowClick={this.handleFollowClick}
						handleLogout={this.handleLogout}
						handleChangeSearch={this.handleChangeSearch}
						handleSubmitSearch={this.handleSubmitSearch}
					/>:
					null}
					<Switch>
						<Route exact path="/" component={auth.userinfo.logged?Posts:Login}/>
						<Route path="/explore" component={Explore}/>
						<Route path="/Search/tags/:keyword" component={SearchHash}/>
						<Route component={NotFound}/>
					</Switch>
				</section>
			</Router>
		);
	}
};

const mapStateToProps = (state) => ({
  auth: state.auth,
	ui: state.ui,
	post: state.post,
	history: state.history,
	form: state.form,
	search: state.search
});

const mapDispatchToProps = (dispatch) => ({
	changeUserData: (params) => dispatch(auth.changeUserData(params)),
	checkSession: () => dispatch(auth.checkSession()),
	logout: () => dispatch(auth.logout()),
	getHistory: () => dispatch(auth.getHistory()),

	setFollowUser: (username) => dispatch(auth.setFollowUser(username)),
	following: (params) => dispatch(auth.following(params)),
	unfollow: (params) => dispatch(auth.unfollow(params)),

	setHeader: (value) => dispatch(ui.setHeader(value)),
	setHeaderModal: () => dispatch(ui.setHeaderModal()),
	setLoadingInitial: () => dispatch(ui.setLoadingInitial()),
	setLoading: (params) => dispatch(ui.setLoading(params)),

	changeFormData: (formname, name, value) => dispatch(form.changeFormData(formname, name, value))
})

App = connect(mapStateToProps, mapDispatchToProps)(App)

export default App;
