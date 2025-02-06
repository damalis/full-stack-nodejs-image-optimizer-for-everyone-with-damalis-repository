# [full stack Nodejs image optimizer for everyone with damalis repository](https://github.com/damalis/full-stack-nodejs-image-optimizer-for-everyone-with-damalis-repository)

If You want to build a website optimized image with Node.js at short time;

#### Full stack Node.js image optimizer:
<p align="left"> <a href="https://nodejs.org/en" target="_blank" rel="noreferrer"> <img src="https://avatars.githubusercontent.com/u/9950313?s=200&v=4" alt="node.js" height="40" width="40" style="text-decoration: none;"/> </a>&nbsp;&nbsp;&nbsp; 
<a href="https://github.com/damalis?tab=repositories" target="_blank" rel="noreferrer"> <img src="https://avatars.githubusercontent.com/u/11361779?v=4" alt="damalis" width="40" height="40" width="40"/> </a>&nbsp;&nbsp;&nbsp;</p>

### How to 

download with

```
git clone <wordpress damalis repository>
cd <the wordpress damalis repository folder>
git clone https://github.com/damalis/full-stack-nodejs-for-everyone-with-damalis-repository.git node
```

add the below code snippets in "docker-compose.yml" file.

```
    node:
        depends_on:
            - webserver
        image: 'node:latest'        
        container_name: node
        networks:
            - backend
        working_dir: /home/node
        volumes:
            - type: bind
              source: ./node/app
              target: /home/node/app
            - 'html:${WEBSERVER_DOC_ROOT}'
        hostname: node
        restart: unless-stopped
        ports:
            - '3000:3000'        
        environment:
            NODE_ENV: 'production'
            TZ: '${LOCAL_TIMEZONE}'
        labels:            
            - 'docker-volume-backup.stop-during-backup=true'
        command: bash -c 'apt-get update && apt-get upgrade -y && apt-get install -y openssh-server && service ssh start && npm init -y && tail -f /dev/null'
```

and

ssh2 php extension as below to wordpress container service command parameter.

```
curl -sSL https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions -o - | sh -s ... ssh2 ...
```

#### Then,

continue the wordpress damalis repository guide.

#### Finally, 

open the functions.php file to WordPress folder using a text editor like nano or Sublime Text. Add the below code snippet at the bottom of the file.

```
add_action( "add_attachment", "optimizer_image", 10, 1);
function optimizer_image(  $attachment_id ) {

	$mimes = array( 'image/jpeg', 'image/png', 'image/webp', 'image/tiff' );
	$mime_type = get_post_mime_type( $attachment_id );

	if( !in_array( $mime_type, $mimes ) ) {
		$post_content = array(
			'ID' => $attachment_id,
			'post_content' => "couldn't optimize image! Unsupported image format."
		);
		wp_update_post( $post_content );
		return;
	}

	$quality = [ 'image/jpeg' => 60, 'image/png' => 60, 'image/webp' => 60, 'image/tiff' => 60];

	$connection = ssh2_connect('node', 3000);
	if( !$connection ) return;
	if( !ssh2_auth_password( $connection, 'root', '' ) ) return;

	$stdout_stream = ssh2_exec( $connection, 'cd /home/node && node app/index.js --image=' . wp_get_original_image_path($attachment_id) . ' --quality=' . $quality[$mime_type] );
	stream_set_blocking( $stdout_stream, true );
	$stdout_contents = trim( stream_get_contents( $stdout_stream ) );
	$stderr_stream = ssh2_fetch_stream( $stdout_stream, SSH2_STREAM_STDERR );
	$stderr_contents = trim( stream_get_contents( $stderr_stream ) );
	//exec( 'node E:\GitHub\full-stack-nodejs-image-optimizer-for-everyone-with-damalis-repository\app\index.js --image=' . wp_get_original_image_path($attachment_id) . ' --quality=' . $quality[$mime_type], $output, $retval );
	if( $stdout_contents == "The optimized image has been saved!" ) {
		$post_content = array(
			'ID' => $attachment_id,
			'post_content' => $stdout_contents
		);
	} else {
		$post_content = array(
			'ID' => $attachment_id,
			'post_content' => "couldn't optimize image! " . $stdout_contents . " and/or " . $stderr_contents
		);
	}
	wp_update_post($post_content);

	fclose( $stderr_stream );
	fclose( $stdout_stream );

	return;
}
```
