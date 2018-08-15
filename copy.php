<?php

function cp($src,$dst)
{
    $dir = dirname($dst);
    file_exists($dir) OR mkdir($dir, 0755, TRUE);
    copy($src,$dst);
}

$manifest = file_get_contents('build/asset-manifest.json');
$manifest = json_decode($manifest,true);

$dest = '../'.$argv[1].'/www';

system("rm -rf $dest/static");

$css = file_get_contents("build/${manifest['main.css']}");
foreach ($manifest as $k => $v) {
	$k = str_replace("\\",'/',$k);//windows问题
	$k = explode('?',$k)[0];
	if(substr($k,0,6)==='static'){
		//without "homepage": ".",
		// $css = str_replace('/'.$v,'../../'.$k,$css);

		//with "homepage": ".",
		$css = str_replace($v,$k,$css);
		
		cp("build/$v","$dest/$k");
	}
}
$css = str_replace('url(/img/','url(../../img/',$css);
$css = str_replace('url("/img/','url("../../img/',$css);
cp("build/${manifest['main.js']}","$dest/static/js/main.js");
mkdir("$dest/static/css/");
file_put_contents("$dest/static/css/main.css",$css);

