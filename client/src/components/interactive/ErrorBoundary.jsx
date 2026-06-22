import { Component } from 'react';

/**
 * Generic error boundary. Renders `fallback` if any child throws during
 * render/commit (e.g. WebGL context creation failing, or a lazy chunk that
 * won't load). Without this, one failing subtree takes down the whole app —
 * which is why the site could hang on machines without working WebGL.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Keep a breadcrumb in the console for diagnosis without crashing the UI.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', this.props.label || '', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
