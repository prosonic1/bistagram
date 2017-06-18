import request from '../helpers/request';

export const checkUserName = (username) => {
  return request({
    url: '/api/account/checkUserName/' + username
  });
}

export const checkNickName = (nickname) =>{
  return request({
    url: '/api/account/checkNickName/' + nickname
  });
}

export const signUp = ({username, name, nickname, password}) => request({
    url: '/api/account/signup',
    method: 'post',
    data: {
      username,
      name,
      nickname,
      password
    }
});

export const signIn = ({username, password}) => request({
    url: '/api/account/signin',
    method: 'post',
    data: {
        username,
        password
    }
});

export const logout = () => request({
    url: '/api/account/logout',
    method: 'post'
});
