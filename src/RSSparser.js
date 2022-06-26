export default (data, feedId) => {
  const rssFeed = data.querySelector('channel');

  if (!rssFeed) {
    throw new Error();
  }

  const parsedRssFeed = {
    title: data.querySelector('title').textContent,
    link: data.getElementsByTagName('link')[0].textContent,
    description: data.querySelector('description').textContent,
    id: feedId,
  };

  const posts = data.querySelectorAll('item');

  const parsedRssPosts = [...posts].reduce((acc, item) => {
    const parsedItem = {
      guid: item.querySelector('guid').textContent,
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
      feedId,
    };

    return [...acc, parsedItem];
  }, []);

  const parsedRss = {
    feed: parsedRssFeed,
    posts: parsedRssPosts,
  };

  return parsedRss;
};
