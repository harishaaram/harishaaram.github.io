<?php
/*
	Plugin Name: Easy Gist Embed
	Plugin URI: http://wordpress.org/extend/plugins/easy-gist-embed/
	Description: Automatically embeds GitHub Gists just by posting a link to that Gist
	Author: Captain Theme
	Version: 1.0
	Author URI: http://captaintheme.com/
 */
 
// Auto-embed GitHub Gists
wp_embed_register_handler( 'gist', '/https:\/\/gist\.github\.com\/(\d+)(\?file=.*)?/i', 'ege_embed_gist' );
function ege_embed_gist( $matches, $attr, $url, $rawattr ){
	$embed = sprintf(
        '<script src="https://gist.github.com/%1$s.js%2$s"></script>',
        esc_attr($matches[1]),
        esc_attr($matches[2])
    );
    return apply_filters( 'embed_gist', $embed, $matches, $attr, $url, $rawattr );
}

// To use, simply insert the link to a github gist (including https://) into a post/page/etc.