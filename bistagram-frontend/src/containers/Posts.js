import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as post from '../actions/post';
import * as follow from '../actions/follow';
import { storage } from '../helpers';

import Header from '../components/Header/Header';
import FollowList from '../components/Follow/FollowList';
import PostView from '../components/Post/PostView';

class Post extends Component{
	constructor(props) {
		super(props);
		this.getPostData=this.getPostData.bind(this);
	}

	componentDidMount() {
		let session = storage.get('session');
		if (session.logged) {
			this.getPostData(session);
		}
	}

	async getPostData (session){
		const {searchPosts, recommendFollow} = this.props;
		try {
			await searchPosts({username:session.user.username, start:this.props.post.start});
			await recommendFollow({username:session.user.username, start:0, count:3})
		}
		catch(e) {
		}
	}

	handleFollowClick=(num)=>{
		let session = storage.get('session');
		const {follow, setClickIndex, following, unfollow } =this.props;

		setClickIndex(num);
		if(follow.user[num].follow === 0){
			following({username:session.user.username, follower:follow.user[num].username});
		}
		else{
			unfollow({username:session.user.username, follower:follow.user[num].username});
		}
	}

	render(){
		return(
			<section className="react-body">
				<Header />
				<main className="post_body">
					<section className="post_wrapper">
						<FollowList
						follow={this.props.follow}
						handleFollowClick={this.handleFollowClick}
						page='mainpost'
						/>

						<div className="post_marginbt30px">
							<PostView post={this.props.post}/>
							<div className="scroll_lodingdiv">
							{this.props.post.isMore && <div className="loding_div loding_lgimg"></div>}
							</div>
						</div>
					</section>
				</main>
			</section>
		);
	}
};

const mapStateToProps = (state) => ({
  post: state.post,
	follow: state.follow
});

const mapDispatchToProps = (dispatch) => ({
	searchPosts: (params) => dispatch(post.searchPosts(params)),
	recommendFollow: (params) => dispatch(follow.recommendFollow(params)),
	setClickIndex: (index) => dispatch(follow.setClickIndex(index)),
	following: (params) => dispatch(follow.following(params)),
	unfollow: (params) => dispatch(follow.unfollow(params))
});


Post = connect(mapStateToProps, mapDispatchToProps)(Post)
export default Post;
