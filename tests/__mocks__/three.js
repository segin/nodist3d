const THREE = jest.requireActual('three');

module.exports = {
  ...THREE,
  WebGLRenderer: jest.fn().mockReturnValue({
    setSize: jest.fn(),
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