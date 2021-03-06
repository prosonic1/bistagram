import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import * as post from '../actions/post';

import Loading from '../components/Loading';
import Modalheader from '../components/Search/Modalheader';
import Modalmedia from '../components/Search/Modalmedia';
import Modalfooter from '../components/Search/Modalfooter';
import Innermodal from '../components/Search/Innermodal';

import '../css/post.css';

const removeTag = (reply) => {
	return reply.replace(/(<([^>]+)>)/gi, "");
}

let position =	0;

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
          atcnum: -1,
          redirect: '',
          reply:''
        }
    }
    componentDidMount(){
      this.handlePostInfo();
    }
    componentDidUpdate() {
      this.handlePostInfo();
    }
		componentWillUnmount() {
			this.props.postsReset();
		}
    handlePostInfo = async() =>{
      const {getPostDetailInfo} = this.props;
      if(this.state.atcnum !== this.props.match.params.atcnum){
        this.setState({
          atcnum: this.props.match.params.atcnum
        });
        await getPostDetailInfo({atcnum: this.props.match.params.atcnum}).then(()=>{
          if(!this.props.post.post.atcnum){
            this.setState({
              redirect: '/NotFound'
            });
          }
        });
      }
    }
    handleChangeReply = (e) =>{
      if(this.state.reply.length<500){
        this.setState({
          reply: e.target.value
        });
      }
    }
    handleKeyPress = (e) => {
      if(e.charCode === 13){
        e.preventDefault();
      }
    }
    handleReplySubmit = (e) =>{
      const {auth, post, history, postDetailInsertReply}=this.props;
			const {reply}=this.state;
			if(e.charCode === 13){
				if(!auth.userinfo.user.nickname){
					history.push('/');
				}else{
					let pst=post.post;
					if(reply.length!==0 && e.charCode === 13){
						postDetailInsertReply({atcnum: pst.atcnum, content: removeTag(reply), username:pst.username, nickname: pst.nickname});
						this.setState({
							reply: ''
						});
					}
				}
			}
    }
    handleReplyDelete = (replynum, index) =>{
			const {postDetailDeleteReply}=this.props;
			postDetailDeleteReply({replynum: replynum, replyindex: index});
		}
    handleGetReplies = (atcnum, replynum) =>{
      this.props.getPostDetailReplies({atcnum: atcnum, replynum: replynum});
    }
    handleModalLikeClick = (atcnum) =>{
      const {auth, post, history, postDetailLike, postDetailNotlike} = this.props;
      if(!auth.userinfo.user.username){
        history.push('/');
      }else{
				if(post.post.atclike.like===1){
					postDetailNotlike({atcnum: atcnum});
				}else{
					postDetailLike({atcnum: atcnum});
				}
			}
    }
    handleTaCursor = () =>{
      this.replyTa._rootDOMNode.focus();
    }
		handleInnerModal = () =>{
			const {post, setModal} = this.props;
			let doc = document.documentElement;
			if(!post.status.modal){
				position = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
				document.body.style.position= 'fixed';
				document.body.style.top= -position+'px';
				document.body.style.width= '100%';
			}
			else{
				document.body.style.position= '';
				document.body.style.top= 0;
				document.body.style.width= '';
				window.scrollTo(0, position);
			}
			setModal({index: -1})
		}
    render() {
        const { auth, post, handleFollowClick } = this.props;
        return(
            <main className="main_body">
              {this.state.redirect && <Redirect to={this.state.redirect}/>}

              <div className="postdetailview_pos">
                <div className="postdetailview_wrap">
                  {post.post.atcnum && !post.status.loading?
                  <article className="postdetailview_body postdetailview_body_media">

                    <Modalheader
                      auth={auth}
                      post={post.post}
                      handleFollowClick={handleFollowClick}
                    />

                    <Modalmedia
                      post={post.post}
                    />

                    <Modalfooter
                      post={post.post}
											auth={auth}
                      reply={this.state.reply}
											likeLoading={post.status.like}
											replyLoading={post.status.reply}
                      handleModalLikeClick={this.handleModalLikeClick}
                      handleKeyPress={this.handleKeyPress}
                      handleChangeReply={this.handleChangeReply}
                      handleReplySubmit={this.handleReplySubmit}
											handleReplyDelete={this.handleReplyDelete}
											handleGetReplies={this.handleGetReplies}
                      handleTaCursor={this.handleTaCursor}
                      replyTa={textarea => this.replyTa = textarea}
                    />

                    <div className="modal_more_div">
                      <button className="imgs more_btn more_btn_img more_btn_display" onClick={this.handleInnerModal}>
                        옵션 더 보기
                      </button>
                    </div>

                  </article>
                  :
                  <Loading />
                  }
                </div>
              </div>
              {post.status.modal&&
                <Innermodal
									handleInnerModal={this.handleInnerModal}
                />
              }
            </main>
        );
    }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
	follow: state.follow,
  post: state.post
});
const mapDispatchToProps = (dispatch) => ({
  getPostDetailInfo: (parmas) => dispatch(post.getPostDetailInfo(parmas)),
  getPostDetailReplies: (parmas) => dispatch(post.getPostDetailReplies(parmas)),
  postDetailLike: (parmas) => dispatch(post.postDetailLike(parmas)),
  postDetailNotlike: (parmas) => dispatch(post.postDetailNotlike(parmas)),
  postDetailInsertReply: (parmas) => dispatch(post.postDetailInsertReply(parmas)),
  postDetailDeleteReply: (parmas) => dispatch(post.postDetailDeleteReply(parmas)),
	postsReset: () => dispatch(post.postsReset()),
	setModal: (parmas) => dispatch(post.setModal(parmas))
});

Post = connect(mapStateToProps, mapDispatchToProps)(Post)
export default withRouter(Post);
