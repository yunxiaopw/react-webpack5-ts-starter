import path from 'path'
import webpack, { Configuration, DllPlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const WebpackDllConfig: Configuration = {
  target: 'web',
  mode: 'production',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dll'),
    publicPath: './',
    filename: 'dll_[name].js',
    library: 'dll_[name]_library'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DllPlugin({
      path: path.resolve(__dirname, 'dll', '[name].manifest.json'),
      name: 'dll_[name]'
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
