import { Component } from 'react';

/** If WebGL fails at runtime, render nothing and let the static fallback stay on screen. */
export class CanvasBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {}

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default CanvasBoundary;
