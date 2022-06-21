var express = require( 'express' );
var https = require( 'https' );
var app = express();
var compression = require( 'compression' );
var helmet = require( 'helmet' );
var morgan = require( 'morgan' );
var path = require( 'path' );
var fs = require( 'fs' );
var rfs = require( 'rotating-file-stream' );
const bodyParser = require( 'body-parser' );

var shopRouter = require( './router/shop/index' );

var logDirectory = path.join( __dirname, 'log' );

const mkdirs = ['log', 'tmp', 'upload'];

process.on( 'unhandledRejection', error => {
	// Will print "unhandledRejection err is not defined"
	console.log( 'unhandledRejection', error.message );
} );

//	创建文件夹
mkdirs.forEach(v => {
	const directory = path.join( __dirname, v );
	fs.existsSync( directory ) || fs.mkdirSync( directory );
});

var accessLogStream = rfs( 'access.log', {
	interval: '1d', // rotate daily
	size: "1G",
	path: logDirectory
} );
var errorLogStream = rfs( 'error.log', {
	interval: '1d',
	size: "1G",
	path: logDirectory
} );

morgan.token( 'body', function ( req, res ) {
	return JSON.stringify( req.body )
} );
morgan.token( 'resBody', function ( req, res ) {
	return JSON.stringify( res._resBody );
} );

var logContent = '[:date[clf]] ":method :url" :status :body :response-time ms :resBody ":referrer"';
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( morgan( logContent, { stream: accessLogStream } ) );
app.use( morgan( logContent, {
	stream: errorLogStream,
	skip: function ( req, res ) {
		return res.statusCode < 400
	}
} ) );

app.set( 'view engine', 'html' );
app.enable( 'trust proxy' )
app.use( express.static( path.join( __dirname, './public' ) ) );
//安全header设置
app.use( helmet() );

//  gzip压缩
app.use( compression() );

//  可以设置跨域来访域名
// app.use( function ( req, res, next ) {
// 	res.header( 'Cache-Control', 'no-cache,no-store,must-revalidate' );
// 	res.header( "Access-Control-Allow-Origin", "https://www.baidu.com" );
// 	res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept, access-control-allow-origin" );
// 	res.set( { 'Content-Type': 'application/json;charset=utf-8' } );
// 	if ( req.method === 'OPTIONS' ) {
// 		res.end();
// 	} else {
// 		next();
// 	}
// } );

//  防爬虫中间件
// app.use( function ( req, res, next ) {
// 	if ( req.headers.referer && req.headers.referer.indexOf( 'www.baidu.com' ) > -1 ) {
// 		next();
// 	} else {
// 		res.status( 403 ).send( 'Forbidden' );
// 	}
// } );

app.use( '/shop', shopRouter );

app.use( function ( err, req, res, next ) {
	console.log( err );
	res.status( 500 ).send( 'Something broke!' )
} );

app.listen( 3000, () => {
	console.log( 'node server start at 3000' );
} );

//  设置https
// var httpsOption = {
// 	key: fs.readFileSync( "./httpsConf/domain.key" ),
// 	cert: fs.readFileSync( "./httpsConf/domain.crt" )
// }
// https.createServer( httpsOption, app ).listen( 3001 );
