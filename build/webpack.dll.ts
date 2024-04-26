import path from 'path'
import webpack, { Configuration, DllPlugin } from 'webpack'

const WebpackDllConfig: Configuration = {
  target: 'web',
  mode: 'production',
  entry: {
    react: ['react', 'react-dom', 'react-router-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dll'),
    publicPath: './',
    filename: '[name].dll.js',
    library: '[name]_[hash]_library'
  },
  plugins: [
    new DllPlugin({
      path: path.resolve(__dirname, 'dll', '[name].manifest.json'),
      name: 'dll_[name]_[hash]'
    })
  ]
}

webpack(WebpackDllConfig, (err: any, state: any) => {
  if (err) {
    console.log(err.stack || err)
  } else if (state.hasErrors()) {
    let err = ''
    state
      .toString({
        chunks: false,
        colors: true
      })
      .split(/\r?\n/)
      .forEach((line: any) => {
        err += `    ${line}\n`
      })
    console.warn(err)
  } else {
    console.log(
      state.toString({
        chunks: false,
        colors: true
      })
    )
  }
})

export default WebpackDllConfig
