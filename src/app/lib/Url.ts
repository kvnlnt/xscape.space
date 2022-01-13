type Params = Record<string, any>;

export const useUrl = () => {
  const setter = (params: Params) => {
    const url = new URL(window.location.origin);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    history.pushState({}, '', url);
  };

  const getter = (): Record<string, any> => {
    const searchParams = location.search.substring(1);
    const decoded = decodeURI(searchParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"');
    const params = searchParams ? JSON.parse(`{"${decoded}"}`) : null;
    return params;
  };

  return [getter, setter];
};
