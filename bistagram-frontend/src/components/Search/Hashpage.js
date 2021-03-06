import React from 'react';
import NumberFormat from 'react-number-format';

import Loading from '../Loading';

import Searchbox from './Searchbox';

const Hashpage = ({keyword, search, ui, addHashPost, handleSearchModal}) => {
    return (
      <article className="search_wrap" style={{display:`${ui.loading.search?'none':''}`}}>
        <header className="search_header">
          <h1 className="search_h1">
            #{keyword}
          </h1>
          <span>
            게시물 <span className="search_count"><NumberFormat value={search.posts.atccount} displayType={'text'} thousandSeparator={true}/></span>
          </span>
        </header>
        <div className="search_hotpost_mb">
          <h2 className="search_h2">인기 게시물</h2>
          <div className="grid_wrap">

            {search.posts.popular.map((contact, i) => {
              return(
                <Searchbox
                  post={contact}
                  handleSearchModal={handleSearchModal}
                  index={i}
                  key={i}
                />
              );
            })}

          </div>
        </div>
        {search.posts.atccount>9 &&
        <h2 className="search_h2">최근 사진</h2>
        }
        {search.posts.atccount>9 &&
          <div>
            <div className="grid_wrap">
              {search.posts.recent.map((contact, i) => {
                return(
                  <Searchbox
                    post={contact}
                    handleSearchModal={handleSearchModal}
                    index={i+9}
                    key={i}
                  />
                );
              })}
            </div>
          </div>
        }
        {!search.posts.moreView && search.posts.isMore ? <a className="moreview_btn_style moreview_btn" onClick={addHashPost}>더 읽어들이기</a>:null}

        {search.posts.moreView && search.posts.isMore &&
        <div className="loading_position">
          <Loading />
        </div>
        }
      </article>
    )
}

export default Hashpage;
