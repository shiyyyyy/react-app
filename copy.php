<?php

$manifest = file_get_contents('build/asset-manifest.json');
$manifest = json_decode($manifest,true);

$dest = '../'.$argv[1].'/www';

system("rm -rf $dest/static");

$css = file_get_contents("build/${manifest['main.css']}");
foreach ($manifest as $k => $v) {
	$k = explode('?',$k)[0];
	if(substr($k,0,6)==='static'){
		//without "homepage": ".",
		// $css = str_replace('/'.$v,'../../'.$k,$css);

		//with "homepage": ".",
		$css = str_replace($v,$k,$css);
		
		system("ditto build/$v $dest/$k");
	}
}
$css = str_replace('url(/img/','url(../../img/',$css);
system("ditto build/${manifest['main.js']} $dest/static/js/main.js");
system("mkdir -p $dest/static/css/");
file_put_contents("$dest/static/css/main.css",$css);

