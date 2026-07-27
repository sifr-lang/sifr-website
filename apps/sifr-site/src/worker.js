export default {
  fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/install') {
      url.pathname = '/install/index';
      return env.ASSETS.fetch(new Request(url, request));
    }

    return env.ASSETS.fetch(request);
  },
};
