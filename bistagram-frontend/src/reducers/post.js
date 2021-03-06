import POST from '../actions/ActionTypes/post';

const request = {
    fetching: false,
    fetched: false,
    error: null
}
const status ={
  modal: false,
  post: false,
  like: false,
  reply: false,
  uploadPost: false,
  loading: false
}
const initialState = {
  posts: [],
  post:{},
  isMore: true,
  index: -1,
  replyindex: -1,
  status: {
    ...status
  },
  requests: {
    searchPosts:{
      ...request
    },
    deletePost:{
      ...request
    },
    likeAtc:{
      ...request
    },
    notlikeAtc:{
      ...request
    },
    insertReply:{
      ...request
    },
    deleteReply: {
      ...request
    },
    getAllReplies: {
      ...request
    },
    uploadPost: {
      ...request
    },
    getPostDetailInfo: {
      ...request
    },
    getPostDetailReplies: {
      ...request
    },
    postDetailLike: {
      ...request
    },
    postDetailNotlike: {
      ...request
    },
    postDetailInsertReply: {
      ...request
    },
    postDetailDeleteReply: {
      ...request
    }
  }
}

const pending = {fetching: true, fetched: false, error: null};
const fulfilled = {fetching: false, fetched: true, error: null};
const rejected = {fetching: false, fetched: false}

function post(state=initialState, action) {
  const payload = action.payload;
  const meta = action.meta;
  switch (action.type) {

    case POST.SET_POST_INDEX:
      return{
        ...state,
        index: payload.index,
        replyindex: payload.replyindex,
      }

    case POST.SET_MODAL:
      return{
        ...state,
        index: payload.index,
        status: {
          ...state.status,
          modal: !state.status.modal
        }
      }

    case POST.POSTS_RESET:
      return{
        ...state,
        posts:[],
        post:{}
      }

    case POST.SET_MEDIA_INDEX:
      return{
        ...state,
        posts:[
          ...state.posts.slice(0, payload.atcindex),
          {...state.posts[payload.atcindex], mdindex: state.posts[payload.atcindex].mdindex + payload.plusnum, play: false},
          ...state.posts.slice(payload.atcindex+1, state.posts.length)
        ]
      }

    case POST.SET_MEDIA_PLAY:
      return{
        ...state,
        posts:[
          ...state.posts.slice(0, payload.atcindex),
          {...state.posts[payload.atcindex], play: payload.value},
          ...state.posts.slice(payload.atcindex+1, state.posts.length)
        ]
      }

    case POST.SET_POST_REPLY:
      return{
        ...state,
        posts:[
          ...state.posts.slice(0, payload.atcindex),
          {...state.posts[payload.atcindex], setreply: payload.replytxt},
          ...state.posts.slice(payload.atcindex+1, state.posts.length)
        ]
      }

    case POST.SEARCH_POSTS + "_PENDING":
      return{
        ...state,
        status:{
          ...state.status,
          post: true
        },
        requests: {
          ...state.requests,
          searchPosts: { ...pending }
        }
      }
    case POST.SEARCH_POSTS + '_FULFILLED':
      return {
        ...state,
        posts:[
          ...state.posts,
          ...payload.data
        ],
        isMore: payload.data.length<5 ?false:true,
        status:{
          ...state.status,
          post: false
        },
        requests: {
          ...state.requests,
          searchPosts: { ...fulfilled }
        }
      }
    case POST.SEARCH_POSTS + '_REJECTED':
      return {
        ...state,
        status:{
          ...state.status,
          post: false
        },
        requests: {
          ...state.requests,
          searchPosts: { ...rejected, error: payload }
        }
      };


    case POST.DELETE_POST + "_PENDING":
      return{
        ...state,
        status:{
          ...state.status,
          post: true
        },
        requests: {
          ...state.requests,
          deletePost: { ...pending }
        }
      }
    case POST.DELETE_POST + '_FULFILLED':
      return {
        ...state,
        posts:
        (payload.data.result?
          [ ...state.posts.slice(0, state.index),
            ...state.posts.slice((state.index+1), state.posts.length)]:
          [...state.posts]),
        status:{
          ...state.status,
          post: false
        },
        requests: {
          ...state.requests,
          deletePost: { ...fulfilled }
        }
      }
    case POST.DELETE_POST + '_REJECTED':
      return {
        ...state,
        status:{
          ...state.status,
          post: false
        },
        requests: {
          ...state.requests,
          deletePost: { ...rejected, error: payload }
        }
      };

    case POST.LIKE_ATC + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          like: true
        },
        requests: {
          ...state.requests,
          likeAtc: { ...pending }
        }
      }
    case POST.LIKE_ATC + '_FULFILLED':
      return {
        ...state,
        posts: [
          ...state.posts.slice(0, state.index),
          {...state.posts[state.index],
              atclikecount: state.posts[state.index].atclikecount + (payload?1:0),
              like: payload?true:false
          },
          ...state.posts.slice(state.index+1, state.posts.length)
        ],
        index: -1,
        status: {
          ...state.status,
          like: false
        },
        requests: {
          ...state.requests,
          likeAtc: { ...fulfilled }
        }
      }
    case POST.LIKE_ATC + '_REJECTED':
      return {
        ...state,
        status: {
          ...state.status,
          like: false
        },
        index: -1,
        requests: {
          ...state.requests,
          likeAtc: { ...rejected, error: payload }
        }
      };

    case POST.NOTLIKE_ATC + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          like: true
        },
        requests: {
          ...state.requests,
          likeAtc: { ...pending }
        }
      }
    case POST.NOTLIKE_ATC + '_FULFILLED':
      return {
        ...state,
        posts: [
          ...state.posts.slice(0, state.index),
          {...state.posts[state.index],
              atclikecount: state.posts[state.index].atclikecount - (payload?1:0),
              like: payload?false:true
          },
          ...state.posts.slice(state.index+1, state.posts.length)
        ],
        index: -1,
        status: {
          ...state.status,
          like: false
        },
        requests: {
          ...state.requests,
          likeAtc: { ...fulfilled }
        }
      }
    case POST.NOTLIKE_ATC + '_REJECTED':
      return {
        ...state,
        index: -1,
        status: {
          ...state.status,
          like: false
        },
        requests: {
          ...state.requests,
          likeAtc: { ...rejected, error: payload }
        }
      };

    case POST.INSERT_REPLY + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          reply: true
        },
        requests: {
          ...state.requests,
          insertReply: { ...pending }
        }
      }
    case POST.INSERT_REPLY + '_FULFILLED':
      return {
        ...state,
        posts: [
          ...state.posts.slice(0, state.index),
          {
            ...state.posts[state.index],
              replies: [
                ...state.posts[state.index].replies,
                !payload.data.message&&payload.data
              ],
              repliescount: state.posts[state.index].repliescount + (!payload.data.message?1:0)
          },
          ...state.posts.slice(state.index+1, state.posts.length)
        ],
        index: -1,
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          insertReply: { ...fulfilled }
        }
      }
    case POST.INSERT_REPLY + '_REJECTED':
      return {
        ...state,
        index: -1,
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          insertReply: { ...rejected, error: payload }
        }
      };

    case POST.DELETE_REPLY + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          reply: true
        },
        requests: {
          ...state.requests,
          deleteReply: { ...pending }
        }
      }
    case POST.DELETE_REPLY + '_FULFILLED':
      return {
        ...state,
        posts: [
          ...state.posts.slice(0, state.index),
          {
            ...state.posts[state.index],
              replies: payload.data?[
                ...state.posts[state.index].replies.slice(0, state.replyindex),
                ...state.posts[state.index].replies.slice(state.replyindex+1, state.posts[state.index].replies.length)
              ]:[...state.posts[state.index].replies],
              repliescount: state.posts[state.index].repliescount - (payload.data?1:0)
          },
          ...state.posts.slice(state.index+1, state.posts.length)
        ],
        index: -1,
        replyindex: -1,
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          deleteReply: { ...fulfilled }
        }
      }
    case POST.DELETE_REPLY + '_REJECTED':
      return {
        ...state,
        index: -1,
        replyindex: -1,
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          deleteReply: { ...rejected, error: payload }
        }
      };


    case POST.GET_ALL_REPLIES + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          reply: true
        },
        requests: {
          ...state.requests,
          getAllReplies: { ...pending }
        }
      }
    case POST.GET_ALL_REPLIES + '_FULFILLED':
      return {
        ...state,
        posts: [
          ...state.posts.slice(0, state.index),
          {
            ...state.posts[state.index],
              replies:[...payload.data.rows,...state.posts[state.index].replies]
          },
          ...state.posts.slice(state.index+1, state.posts.length)
        ],
        index: -1,
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          getAllReplies: { ...fulfilled }
        }
      }
    case POST.GET_ALL_REPLIES + '_REJECTED':
      return {
        ...state,
        index: -1,
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          getAllReplies: { ...rejected, error: payload }
        }
      };

    case POST.UPLOAD_POST + "_PENDING":
      return{
        ...state,
        status:{
          ...state.status,
          uploadPost: true
        },
        requests: {
          ...state.requests,
          uploadPost: { ...pending }
        }
      }
    case POST.UPLOAD_POST + '_FULFILLED':
      return {
        ...state,
        posts:[
          ...payload.data,
          ...state.posts
        ],
        status:{
          ...state.status,
          uploadPost: false
        },
        requests: {
          ...state.requests,
          uploadPost: { ...fulfilled }
        }
      }
    case POST.UPLOAD_POST + '_REJECTED':
      return {
        ...state,
        status:{
          ...state.status,
          uploadPost: false
        },
        requests: {
          ...state.requests,
          uploadPost: { ...rejected, error: payload }
        }
      };


    case POST.GET_POST_DETAIL_INFO + "_PENDING":
      return{
        ...state,
        status:{
          ...state.status,
          loading: true
        },
        requests: {
          ...state.requests,
          getPostDetailInfo: { ...pending }
        }
      }
    case POST.GET_POST_DETAIL_INFO + '_FULFILLED':
      return {
        ...state,
        post:{
          ...payload.data
        },
        status:{
          ...state.status,
          loading: false
        },
        requests: {
          ...state.requests,
          getPostDetailInfo: { ...fulfilled }
        }
      }
    case POST.GET_POST_DETAIL_INFO + '_REJECTED':
      return {
        ...state,
        status:{
          ...state.status,
          loading: false
        },
        requests: {
          ...state.requests,
          getPostDetailInfo: { ...rejected, error: payload }
        }
      };

    case POST.GET_POST_DETAIL_REPLIES + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          reply: true
        },
        requests: {
          ...state.requests,
          getPostDetailReplies: { ...pending }
        }
      }
    case POST.GET_POST_DETAIL_REPLIES + '_FULFILLED':
      return {
        ...state,
        post: {
          ...state.post,
          replies: [
            ...payload.data.rows,
            ...state.post.replies
          ]
        },
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          getPostDetailReplies: { ...fulfilled }
        }
      }
    case POST.GET_POST_DETAIL_REPLIES + '_REJECTED':
      return {
        ...state,
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          getPostDetailReplies: { ...rejected, error: payload }
        }
      };


    case POST.POST_DETAIL_LIKE + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          like: true
        },
        requests: {
          ...state.requests,
          postDetailLike: { ...pending }
        }
      }
    case POST.POST_DETAIL_LIKE + '_FULFILLED':
      return {
        ...state,
        post:{
          ...state.post,
          atclike: {
            like: payload?1:0,
            likecount: state.post.atclike.likecount + (payload?1:0)
          }
        },
        status: {
          ...state.status,
          like: false
        },
        requests: {
          ...state.requests,
          postDetailLike: { ...fulfilled }
        }
      }
    case POST.POST_DETAIL_LIKE + '_REJECTED':
      return {
        ...state,
        status: {
          ...state.status,
          like: false
        },
        requests: {
          ...state.requests,
          postDetailLike: { ...rejected, error: payload }
        }
      };

    case POST.POST_DETAIL_NOTLIKE + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          like: true
        },
        requests: {
          ...state.requests,
          postDetailNotlike: { ...pending }
        }
      }
    case POST.POST_DETAIL_NOTLIKE + '_FULFILLED':
      return {
        ...state,
        post:{
          ...state.post,
          atclike: {
            like: payload?0:1,
            likecount: state.post.atclike.likecount - (payload?1:0)
          }
        },
        status: {
          ...state.status,
          like: false
        },
        requests: {
          ...state.requests,
          postDetailNotlike: { ...fulfilled }
        }
      }
    case POST.POST_DETAIL_NOTLIKE + '_REJECTED':
      return {
        ...state,
        status: {
          ...state.status,
          like: false
        },
        requests: {
          ...state.requests,
          postDetailNotlike: { ...rejected, error: payload }
        }
      };


    case POST.POST_DETAIL_INSERT_REPLY + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          reply: true
        },
        requests: {
          ...state.requests,
          postDetailInsertReply: { ...pending }
        }
      }
    case POST.POST_DETAIL_INSERT_REPLY + '_FULFILLED':
      return {
        ...state,
        post: {
          ...state.post,
          replies: [
            ...state.post.replies,
            !payload.data.message&&payload.data
          ],
          replycount: state.post.replycount + (!payload.data.message?1:0)
        },
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          postDetailInsertReply: { ...fulfilled }
        }
      }
    case POST.POST_DETAIL_INSERT_REPLY + '_REJECTED':
      return {
        ...state,
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          postDetailInsertReply: { ...rejected, error: payload }
        }
      };

    case POST.POST_DETAIL_DELETE_REPLY + "_PENDING":
      return{
        ...state,
        status: {
          ...state.status,
          reply: true
        },
        requests: {
          ...state.requests,
          postDetailDeleteReply: { ...pending }
        }
      }
    case POST.POST_DETAIL_DELETE_REPLY + '_FULFILLED':
      return {
        ...state,
        post: {
          ...state.post,
          replies: [
            ...state.post.replies.slice(0, meta.replyindex),
            ...state.post.replies.slice(meta.replyindex+1, state.post.replies.length)
          ],
          replycount: state.post.replycount - (!payload.data.message?1:0)
        },
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          postDetailDeleteReply: { ...fulfilled }
        }
      }
    case POST.POST_DETAIL_DELETE_REPLY + '_REJECTED':
      return {
        ...state,
        status: {
          ...state.status,
          reply: false
        },
        requests: {
          ...state.requests,
          postDetailDeleteReply: { ...rejected, error: payload }
        }
      };


    default:
      return state;
  }

}

export default post;
