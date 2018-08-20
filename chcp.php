<?php
$meta =<<< EOF
  {
    "name": "zs",
    "success": true,
    "store_url_ios": "http://oss.tongyeju.com/oss3-back/api/App/upgrade_ios/TY_ZS/",
    "store_url_android": "http://oss.tongyeju.com/oss3-back/api/App/upgrade_android/TY_ZS/",
    "store_ver_ios": "0.0.3",
    "store_ver_android": "0.0.1",
    "update_ios": 0,
    "update_android": 0,
    "ios_identifier": "",
    "android_identifier": "",
    "update": "resume",
    "content_url": "http://oss.tongyeju.com/app/zs-app",
    "min_api_ver": "2018.07.20-00.00.00"
  }
EOF;
$meta = json_decode($meta,true);
$meta['release'] = $argv[1];
$dir = $argv[2]."/www"; 
$length = strlen($dir)+1;

$arr = [];
function list_file($dir){
	global $arr;
	global $length;
	$list = scandir($dir); 
	foreach($list as $file){
		$file_location=$dir."/".$file;
		if(is_dir($file_location)){ 
			if( $file!="." &&$file!=".." ){
				list_file($file_location);
			}
		}else{
			if(substr($file,0,1) === '.' || substr($file,0,4) === 'chcp'){
				continue;
			}
			// echo "$file_location\n";
			$arr[] = [
				'file'=>substr($file_location,$length),
				'hash'=>md5(file_get_contents($file_location))
			];
		}
	}
}


list_file($dir);

file_put_contents($dir.'/chcp.manifest',json_encode($arr,JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

file_put_contents($dir.'/chcp.json',json_encode($meta,JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));




