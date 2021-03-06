import React, { Component } from 'react';

import Modalheader from './Modalheader';
import Modalmedia from './Modalmedia';
import Modalfooter from './Modalfooter';

const removeTag = (reply) => {
	return reply.replace(/(<([^>]+)>)/gi, "");
}

class Searchmodal extends Component {
    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }
    handleClickOutside = (e) =>{
      const {search, handleSearchModal} = this.props;
      const {modaldiv, bfmodalbtn, afmodalbtn} = this;
      if (!search.modalState.innerModal && modaldiv && !modaldiv.contains(e.target) && bfmodalbtn!==e.target && afmodalbtn!==e.target) {
			    handleSearchModal(-1);
      }
    }
    handleChangeReply = (e) =>{
			const {search, changeModalInfo} = this.props;
      if(search.modalpost.reply.length<500){
				changeModalInfo({name: 'reply', value: e.target.value});
      }
    }
    handleKeyPress = (e) => {
      if(e.charCode === 13){
        e.preventDefault();
      }
    }
    handleReplySubmit = (e) =>{
      const {auth, search, modalPostInsertReply, changeModalInfo}=this.props;
			let reply=search.modalpost.reply;
			if(e.charCode === 13){
				if(!auth.userinfo.user.username){
					document.location = "/"
				}else{
					let post=search.modalpost;
					if(reply.length>0){
						modalPostInsertReply({atcnum: post.atcnum, content: removeTag(reply), username:post.username, nickname: post.nickname});
						changeModalInfo({name: 'reply', value: ''});
					}
				}
			}
    }
		handleReplyDelete = (replynum, index) =>{
			const {modalPostDeleteReply}=this.props;
			modalPostDeleteReply({replynum: replynum, replyindex: index});
		}
		handleGetReplies = (atcnum, replynum) =>{
			this.props.modalPostGetAllReplies({atcnum: atcnum, replynum: replynum});
		}
		handleTaCursor = () =>{
			this.replyTa._rootDOMNode.focus();
		}
    render() {
        const modalstyle={
          position: 'relative',
          zIndex: 2
        }
        const {search, auth, atcindex, handleBfAfModal, handleFollowClick,
							handleModalLikeClick, handleInnerModal, changeModalInfo} = this.props;
        return(
          <div style={modalstyle}>
            <div className="modal_root" role="dialog" onClick={this.handleClickOutside}>

              <div className="search_modal_bfafbtn_body">
                <div className="search_modal_bfafbtn_position">
                  <div className="search_modal_bfafbtn_wrap">
                    {atcindex!==0 &&
                    <a className="imgs search_modal_bfbtn search_modal_bfbtn_img"
                      role="button" ref={(a) => { this.bfmodalbtn = a }}
                      onClick={()=>handleBfAfModal(-1)}>
                      이전
                    </a>
                    }
                    {atcindex<search.posts.popular.length+search.posts.recent.length-1 || atcindex<search.posts.userAtcs.length-1?
                    <a className="imgs search_modal_afbtn search_modal_afbtn_img"
                      role="button" ref={(a) => { this.afmodalbtn = a }}
                      onClick={()=>handleBfAfModal(1)}>
                      다음
                    </a>:null
                    }
                  </div>
                </div>
              </div>

              <div className="modal_post_body">
                <div className="modal_post_position modal_post_style" ref={(div) => { this.modaldiv = div }}>
                  <article className="modal_article">

                    <Modalheader
                      auth={auth}
                      post={search.modalpost}
                      handleFollowClick={handleFollowClick}
                    />

                    <Modalmedia
                      post={search.modalpost}
											changeModalInfo={changeModalInfo}
                    />

                    <Modalfooter
											auth={auth}
                      post={search.modalpost}
                      reply={search.modalpost.reply}
											likeLoading={search.modalState.likeLoading}
											replyLoading={search.modalState.replyLoading}
                      handleKeyPress={this.handleKeyPress}
                      handleChangeReply={this.handleChangeReply}
                      handleReplySubmit={this.handleReplySubmit}
											handleReplyDelete={this.handleReplyDelete}
											handleGetReplies={this.handleGetReplies}
											handleTaCursor={this.handleTaCursor}
											handleModalLikeClick={handleModalLikeClick}
											replyTa={textarea => this.replyTa = textarea}
                    />

                    <div className="modal_more_div">
                      <button className="imgs more_btn more_btn_img more_btn_display" onClick={handleInnerModal}>
                        옵션 더 보기
                      </button>
                    </div>

                  </article>
                </div>
              </div>
              <button className="modal_canclebtn cancle_btn_disnone">닫기</button>
            </div>
          </div>
        );
    }
}
export default Searchmodal;
