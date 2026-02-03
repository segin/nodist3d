const THREE = jest.requireActual('three');

module.exports = {
  ...THREE,
  WebGLRenderer: jest.fn().mockReturnValue({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    shadowMap: { enabled: false, type: null },
    render: jest.fn(),
    domElement: document.createElement('div'),
  }),
  TextGeometry: jest.fn().mockImplementation(() => {
    return {
      type: 'TextGeometry',
      dispose: jest.fn(),
    };
  }),
};