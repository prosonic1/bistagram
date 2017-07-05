import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as search from '../actions/search';
import * as ui from '../actions/ui';

import Loading from '../components/Loading';

import Hashpage from '../components/Search/Hashpage';
import Searchmodal from '../components/Search/Searchmodal';

import '../css/search.css';

let position =	0;

class SearchHash extends Component {
  constructor(props) {
      super(props);
      this.state={
        atcindex: 0
      }
  }
  async componentDidMount() {
    const {searchHash, setLoading, setLoadingInitial} = this.props;
    setLoading({name:"search", value:true});
    window.addEventListener("scroll", this.handleScroll);
    await searchHash({keyword: this.props.match.params.keyword}).then(()=>{
      setTimeout(()=>{ setLoadingInitial() }, 300);
    })
  }

  componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
	}

  handleScroll = () => {
    const { search } = this.props;
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom >= docHeight) {
      if(search.posts.moreView && search.posts.isMore && !search.posts.loading){
        this.addHashPost();
      }
    }
  }

  addHashPost = () =>{
    const { search, addHash } = this.props;
    let atcnums=[search.posts.recent[search.posts.recent.length-1].atcnum];
    search.posts.popular.forEach(value=>{
      atcnums=[...atcnums, value.atcnum]
    })
    addHash({keyword:this.props.match.params.keyword, atcnums:atcnums})
  }

  handleSearchModal = async(index) =>{
    const { setModalInit, search, getModalPost } = this.props;
    let doc = document.documentElement;
    let atcnum = -1;
    if(index !== -1){
      position = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
      if(index<9){
        atcnum=search.posts.popular[index].atcnum;
      }else{
        atcnum=search.posts.recent[index-9].atcnum;
      }
      this.setState({
        ...this.state,
        atcindex: index
      });
      await getModalPost({atcnum: atcnum}).then(()=>{
        document.body.style.position= 'fixed';
        document.body.style.top= -position+'px';
        document.body.style.width= '100%';
      })
    }
    else{
      document.body.style='';
      window.scrollTo(0, position);
      this.setState({
        ...this.state,
        atcindex: index
      });
      setModalInit();
    }
  }

  handleBfAfModal = async(plusvalue) =>{
    const { search, getModalPost } = this.props;
    let atcnum = -1;
    let nextindex = this.state.atcindex+plusvalue;
      if(nextindex<9){
        atcnum=search.posts.popular[nextindex].atcnum;
      }else{
        atcnum=search.posts.recent[nextindex-9].atcnum;
      }
      this.setState({
        ...this.state,
        atcindex: nextindex
      });
      await getModalPost({atcnum: atcnum});
  }

  render() {
    const {search, ui, auth, getModalPost} = this.props;
		return(
        <main className="search_body">
          <Hashpage
            ui={ui}
            keyword={this.props.match.params.keyword}
            search={search}
            addHashPost={this.addHashPost}
            handleSearchModal={this.handleSearchModal}
          />
          {ui.loading.search && <Loading />}
          {search.modalState.modal &&
            <Searchmodal
              auth={auth}
              search={search}
              atcindex={this.state.atcindex}
              handleSearchModal={this.handleSearchModal}
              handleBfAfModal={this.handleBfAfModal}
              getModalPost={getModalPost}
            />
          }
        </main>
    );
	}
};

const mapStateToProps = (state) => ({
	search:state.search,
  auth:state.auth,
  ui:state.ui
});

const mapDispatchToProps = (dispatch) => ({
	searchHash: (params) => dispatch(search.searchHash(params)),
  addHash: (params) => dispatch(search.addHash(params)),
  getModalPost: (params) => dispatch(search.getModalPost(params)),
  setModalInit: () => dispatch(search.setModalInit()),

  setLoadingInitial: () => dispatch(ui.setLoadingInitial()),
  setLoading: (params) => dispatch(ui.setLoading(params))
});


SearchHash = connect(mapStateToProps, mapDispatchToProps)(SearchHash)
export default SearchHash;
