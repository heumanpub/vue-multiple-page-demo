const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理dist文件夹
const HtmlWebpackPlugin = require("html-webpack-plugin"); // html引擎
//const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽离css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const delimiter = path.delimiter;

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var entries = getEntry("./src/**/*.js");
var chunks = Object.keys(entries);
const base = {
    entry: entries,
    output: {
        filename: "[name].js",
        path: __dirname + "/dist", //必须是绝对路径
        //publicPath: '/Public/',                  // html, css, js 图片等资源文件的 server 上的路径
        chunkFilename: 'js/[id].[hash].js'
    },
    module: {
        rules: [
            {// vue-loader，加载vue组件
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {//支持热更新
                test: /\.css$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    //'postcss-loader'
					{ loader: 'postcss-loader', options: { parser: 'sugarss', exec: true } }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader', // base64
                    options: {
                        limit: 8192
                    }
                    /*,query: {
                     limit: 10000,
                     name: './imgs/[name].[ext]?[hash:7]'
                     }*/
                }]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true // 使用缓存
                        }
                    }
                    /*, {// 开发模式使用注入代码实现html热更新，注入normalize.css
                     loader: path.resolve("./inject-loader.js")
                     }*/
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: 'require'
                    }
                }]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    //test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: "vendors",
                    minChunks: chunks.length
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new FriendlyErrorsPlugin(),
        // 提取公共模块
        /*new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors', // 公共模块的名称
            chunks: chunks,  // chunks 是需要提取的模块
            minChunks: chunks.length
        }),*/
        new webpack.ProvidePlugin({ //加载jq
            /*$: 'jquery',
             jQuery: 'jquery',*/
            Vue: ['vue/dist/vue.esm.js', 'default']
        }),
        //new ExtractTextPlugin("[name].css"), // 样式抽离不支持热更新
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
		new VueLoaderPlugin()
    ],
    resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
		  'vue$': 'vue/dist/vue.esm.js',
		  '@': resolve('src'),
		}
    }
    /*,externals: {// 用来配置require的返回。一般用于加载cdn
    }*/
}

var pages = getEntry("./src/**/*.html");
for (var pathname in pages) {
    var conf = {
        hash: true,
        inject: true,
        template: pages[pathname],
        filename: __dirname + "/view/" + pathname + ".html" // 输出html文件的路径
        //,chunks: ['vendors', pathname]
    };
    base.plugins.push(new HtmlWebpackPlugin(conf));
}

// 根据项目具体需求，输出正确的 js 和 html 路径
function getEntry(globPath) {
  var entries = {},
    basename, pathname;

  glob.sync(globPath).forEach(function (entry) {
    filenameWithOutExtname = path.basename(entry, path.extname(entry));
    pathname = entry.split('/').splice(-3).splice(0, 1) + '/' + filenameWithOutExtname; // 正确输出 js 和 html 的路径
    entries[pathname] = entry;
  });
  console.log(entries);
  return entries;
}

module.exports = base;