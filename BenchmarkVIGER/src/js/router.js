/**
 * Router Module for Hardware Benchmark Database SPA
 */

export class Router {
  constructor(routes = {}) {
    this.routes = routes;
    this.currentRoute = '';
    
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

    if (this.routes[mainRoute]) {
      this.routes[mainRoute](param);
    } else {
      // Default fallback
      if (this.routes['gpu']) {
        this.routes['gpu']();
      }
    }
  }

  navigate(hash) {
    window.location.hash = hash;
  }
}
