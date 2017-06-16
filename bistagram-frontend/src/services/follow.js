import request from '../helpers/request';

export const recommendFollow = ({id, start, count}) => request({
    url: '/api/follow/RecommedFollow',
    method: 'post',
    data: {
      id,
      start,
      count
    }
});

export const following = ({id, followid}) => request({
    url: '/api/follow/following',
    method: 'post',
    data: {
      id,
      followid
    }
});

export const unfollow = ({id, followid}) => request({
    url: '/api/follow/unfollow',
    method: 'delete',
    data: {
      id,
      followid
    }
});
