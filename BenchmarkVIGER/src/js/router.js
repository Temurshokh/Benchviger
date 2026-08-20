/**
 * Router Module for Hardware Benchmark Database SPA
 */

export class Router {
  constructor(routes = {}, options = {}) {
    this.routes = routes;
    this.currentRoute = '';
    this.onError = options.onError || ((error) => console.error('Route render failed', error));
    this.pendingRoute = Promise.resolve();
    
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash || '#/gpu';
    this.currentRoute = hash;

    // Parse route path and query/params
    // Format: #/gpu, #/gpu/rtx-5090, #/compare, #/category/cpu
    const parts = hash.replace('#/', '').split('/');
    const mainRoute = parts[0] || 'gpu';
    const param = parts[1] || null;

    const routeHandler = this.routes[mainRoute] || this.routes['gpu'];
    if (!routeHandler) return;

    this.pendingRoute = this.pendingRoute
      .then(() => routeHandler(param))
      .catch(error => this.onError(error));

    return this.pendingRoute;
  }

  navigate(hash) {
    window.location.hash = hash;
  }
}
